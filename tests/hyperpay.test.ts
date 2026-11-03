import { test } from "node:test";
import assert from "node:assert/strict";
import {
  amountJod, verifiedDebit, hyperpayProvider, hyperpayConfigured,
  validateHyperPayBilling,
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
