import { test } from "node:test";
import assert from "node:assert/strict";
import {
  amountJod, verifiedDebit, hyperpayProvider, hyperpayConfigured,
  validateHyperPayBilling, classifyHyperPayResult, hyperpayUsdTestConfigured, hyperpayRequest,
} from "../src/lib/payments/providers/hyperpay";

const expected = { orderId: "order-1", amountFils: 12340, currency: "JOD" };
const debit = {
  id: "transaction-1", merchantTransactionId: "order-1", amount: "12.34",
  currency: "JOD", paymentType: "DB", paymentBrand: "VISA",
  result: { code: "000.100.110" },
};
const billing = {
  givenName: "Test", surname: "Customer", street1: "123 Test Street",
  city: "Amman", state: "Amman", postcode: "11118", country: "JO",
};

test("JOD sandbox amounts have exactly two decimals and never round a fils", () => {
  assert.equal(amountJod(10), "0.01");
  assert.equal(amountJod(12340), "12.34");
  assert.equal(amountJod(12000), "12.00");
  for (const n of [0, -1, 1, 12345, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])
    assert.throws(() => amountJod(n));
});

test("only matching settled debits pass verification", () => {
  assert.equal(verifiedDebit(debit, expected), true);
  for (const patch of [
    { id: undefined }, { merchantTransactionId: "another-order" },
    { amount: "12.35" }, { amount: "12.340" }, { amount: 12.34 },
    { amount: "1.234e1" }, { amount: "012.34" }, { currency: "USD" },
    { paymentType: "PA" }, { paymentType: "RG" }, { paymentBrand: "OTHER" },
    { result: { code: "000.200.000" } },
    { result: { code: "000.400.000" } },
    { result: { code: "800.100.100" } }, { result: undefined },
  ]) assert.equal(verifiedDebit({ ...debit, ...patch }, expected), false, JSON.stringify(patch));
  assert.equal(verifiedDebit(debit, { ...expected, amountFils: 12345 }), false);
});

test("HyperPay result-code regex classifies success, review and unsuccessful states", () => {
  for (const code of [
    "000.000.000", "000.000.100", "000.100.105", "000.100.110",
    "000.100.111", "000.100.112", "000.300.000", "000.310.100",
    "000.600.000", "000.400.110", "000.400.120",
  ]) assert.equal(classifyHyperPayResult(code), "success", code);
  for (const code of [
    "000.400.000", "000.400.010", "000.400.020", "000.400.040",
    "000.400.050", "000.400.060", "000.400.100",
  ]) assert.equal(classifyHyperPayResult(code), "manual_review", code);
  for (const code of [
    "000.200.000", "000.200.100", "800.100.100",
    "000.400.030", "000.400.101", "000.400.111",
    "100.400.500", "", "000.100.1130", "000.000.000extra",
    null, undefined, 0,
  ]) assert.equal(classifyHyperPayResult(code), "not_successful", String(code));
});

test("classification alone never marks an authentication, generic API, review or risk operation as paid", () => {
  for (const code of [
    "000.000.100", "000.100.105", "000.300.000",
    "000.300.100", "000.310.100", "000.600.000",
    "000.400.110", "000.400.120",
    "000.400.000", "000.400.100", "000.200.000",
  ]) {
    assert.equal(verifiedDebit({ ...debit, result: { code } }, expected), false, code);
  }
});

test("USD sandbox configuration stays isolated to the dedicated test origin", () => {
  const saved = { ...process.env };
  try {
    process.env.HYPERPAY_MODE = "test";
    process.env.HYPERPAY_ACCESS_TOKEN = "dummy-test-token";
    process.env.HYPERPAY_ENTITY_ID = "dummy-jod-entity";
    process.env.HYPERPAY_USD_ENTITY_ID = "dummy-usd-entity";
    delete process.env.HYPERPAY_USD_ACCESS_TOKEN;
    process.env.HYPERPAY_USD_TEST_KEY = "x".repeat(32);
    process.env.NEXT_PUBLIC_SITE_URL = "https://nnovara.io";
    assert.equal(hyperpayUsdTestConfigured(), false);
    process.env.NEXT_PUBLIC_SITE_URL = "https://novara-hyperpay-staging.netlify.app";
    assert.equal(hyperpayUsdTestConfigured(), false);
    process.env.HYPERPAY_USD_ACCESS_TOKEN = "dummy-usd-token";
    assert.equal(hyperpayUsdTestConfigured(), true);
    process.env.HYPERPAY_USD_ENTITY_ID = "dummy-jod-entity";
    assert.equal(hyperpayUsdTestConfigured(), false);
    process.env.HYPERPAY_USD_ENTITY_ID = "dummy-usd-entity";
    process.env.HYPERPAY_USD_TEST_KEY = "short";
    assert.equal(hyperpayUsdTestConfigured(), false);
  } finally {
    process.env = saved;
  }
});

test("USD debit is verified only for an exact USD order and amount", () => {
  const transaction = { ...debit, amount: "1.00", currency: "USD" };
  const expectedUsd = { orderId: "order-1", amountFils: 1000, currency: "USD" };
  assert.equal(verifiedDebit(transaction, expectedUsd), true);
  assert.equal(verifiedDebit({ ...transaction, currency: "JOD" }, expectedUsd), false);
  assert.equal(verifiedDebit(transaction, { ...expectedUsd, currency: "JOD" }), false);
  assert.equal(verifiedDebit(transaction, { ...expectedUsd, amountFils: 2000 }), false);
  for (const code of ["800.100.100", "100.396.101", "000.200.000", "000.400.000", "000.000.100"]) {
    assert.equal(verifiedDebit({ ...transaction, result: { code } }, expectedUsd), false, code);
  }
  for (const patch of [
    { id: undefined }, { merchantTransactionId: "another-attempt" }, { amount: "0.10" },
    { amount: "100.00" }, { paymentType: "PA" }, { paymentBrand: ["VISA"] },
  ]) assert.equal(verifiedDebit({ ...transaction, ...patch }, expectedUsd), false);
  assert.equal(verifiedDebit({ ...transaction, paymentBrand: "MASTER" }, expectedUsd), true);
});

test("USD checkout and inquiry use the USD credentials and the exact sandbox amount", async () => {
  const saved = { ...process.env };
  const originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, {
      NEXT_PUBLIC_SITE_URL: "https://novara-hyperpay-staging.netlify.app",
      HYPERPAY_MODE: "test",
      HYPERPAY_ACCESS_TOKEN: "dummy-jod-token",
      HYPERPAY_ENTITY_ID: "dummy-jod-entity",
      HYPERPAY_USD_ACCESS_TOKEN: "dummy-usd-token",
      HYPERPAY_USD_ENTITY_ID: "dummy-usd-entity",
      HYPERPAY_USD_TEST_KEY: "x".repeat(32),
    });
    const methods: string[] = [];
    globalThis.fetch = async (input, init) => {
      const url = new URL(String(input));
      assert.equal(url.origin, "https://eu-test.oppwa.com");
      assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer dummy-usd-token");
      methods.push(init!.method!);
      if (init?.method === "POST") {
        assert.equal(url.pathname, "/v1/checkouts");
        const body = init.body as URLSearchParams;
        for (const [key, value] of Object.entries({
          amount: "1.00", currency: "USD", merchantTransactionId: "attempt-1", paymentType: "DB",
          entityId: "dummy-usd-entity", testMode: "EXTERNAL", "customParameters[3DS2_enrolled]": "true",
        })) assert.equal(body.get(key), value, key);
        return Response.json({ id: "checkout-1", integrity: "sha256-abc=" });
      }
      assert.equal(url.pathname, "/v1/checkouts/checkout-1/payment");
      assert.equal(url.searchParams.get("entityId"), "dummy-usd-entity");
      return Response.json({ result: { code: "000.200.000" } });
    };
    const returnUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const session = await hyperpayProvider.createPaymentSession({
      orderId: "attempt-1", amountFils: 100 * 10, currency: "USD",
      customerEmail: "test@example.com", billing, returnUrl, cancelUrl: returnUrl,
    });
    await hyperpayRequest(`/v1/checkouts/${session.sessionId}/payment`, undefined, "USD");
    assert.deepEqual(methods, ["POST", "GET"]);
  } finally {
    process.env = saved;
    globalThis.fetch = originalFetch;
  }
});

test("3DS2 billing input is required and validated", () => {
  assert.equal(validateHyperPayBilling(billing), true);
  for (const change of [
    { givenName: "" }, { surname: "" }, { street1: "" }, { city: "" },
    { state: "" }, { postcode: "?" }, { country: "Jordan" },
    { country: "jo" }, { country: "" },
  ]) assert.equal(validateHyperPayBilling({ ...billing, ...change }), false);
});

test("test host, 3DS2 checkout fields and callback rejection", async () => {
  const saved = { ...process.env };
  const originalFetch = globalThis.fetch;
  try {
    process.env.HYPERPAY_MODE = "live";
    assert.equal(hyperpayConfigured(), false);
    process.env.HYPERPAY_MODE = "test";
    process.env.HYPERPAY_ACCESS_TOKEN = "test-secret";
    process.env.HYPERPAY_ENTITY_ID = "test-entity";
    globalThis.fetch = async (url, init) => {
      assert.equal(String(url), "https://eu-test.oppwa.com/v1/checkouts");
      const body = init!.body as URLSearchParams;
      for (const [key, value] of Object.entries({
        amount: "12.34", currency: "JOD", merchantTransactionId: "order-1",
        paymentType: "DB", entityId: "test-entity", testMode: "EXTERNAL",
        "customParameters[3DS2_enrolled]": "true",
        "customer.email": "test@example.com", "customer.givenName": "Test",
        "customer.surname": "Customer", "billing.street1": "123 Test Street",
        "billing.city": "Amman", "billing.state": "Amman",
        "billing.postcode": "11118", "billing.country": "JO", integrity: "true",
      })) assert.equal(body.get(key), value, key);
      assert.equal(init!.redirect, "error");
      return Response.json({ id: "checkout-1", integrity: "sha384-abc=" });
    };
    const input = {
      orderId: "order-1", amountFils: 12340, currency: "JOD" as const,
      customerEmail: "test@example.com", billing,
      returnUrl: "https://example.com/ar/order/success?order=ORD-1&access=access",
      cancelUrl: "https://example.com/ar/order/failed",
    };
    await assert.rejects(() => hyperpayProvider.createPaymentSession({ ...input, billing: undefined }));
    const session = await hyperpayProvider.createPaymentSession(input);
    assert.equal(new URL(session.redirectUrl!).pathname, "/api/payments/hyperpay");
    assert.equal(new URL(session.redirectUrl!).searchParams.get("session"), "checkout-1");
    assert.equal(hyperpayProvider.supportsSubscriptions, false);
    await assert.rejects(() => hyperpayProvider.verifyWebhook('{"status":"paid"}', new Headers()));
    await assert.rejects(() => hyperpayProvider.verifyPayment("checkout-1"));
  } finally {
    process.env = saved;
    globalThis.fetch = originalFetch;
  }
});
