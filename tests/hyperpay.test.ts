import { test } from "node:test";
import assert from "node:assert/strict";
import { amountJod, verifiedDebit, hyperpayProvider, hyperpayConfigured } from "../src/lib/payments/providers/hyperpay";

const expected = { orderId: "order-1", amountFils: 12345, currency: "JOD" };
const debit = { id: "transaction-1", merchantTransactionId: "order-1", amount: "12.345", currency: "JOD", paymentType: "DB", paymentBrand: "VISA", result: { code: "000.100.110" } };
test("JOD uses exact fils, including sub-cent values", () => {
  assert.equal(amountJod(1), "0.001"); assert.equal(amountJod(12345), "12.345");
  assert.equal(amountJod(12000), "12.000");
  for (const n of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => amountJod(n));
});
test("only matching settled debits pass verification", () => {
  assert.equal(verifiedDebit(debit, expected), true);
  assert.equal(verifiedDebit({ ...debit, amount: "12.34" }, { ...expected, amountFils: 12340 }), true);
  for (const patch of [
    { id: undefined }, { merchantTransactionId: "another-order" }, { amount: "12.346" },
    { amount: 12.345 }, { amount: "1.2345e1" }, { amount: "012.345" }, { currency: "USD" },
    { paymentType: "PA" }, { paymentType: "RG" }, { paymentBrand: "OTHER" },
    { result: { code: "000.200.000" } }, { result: { code: "000.400.000" } },
    { result: { code: "800.100.100" } }, { result: undefined },
  ]) assert.equal(verifiedDebit({ ...debit, ...patch }, expected), false, JSON.stringify(patch));
});
test("test configuration, fixed host, server amount and callback rejection", async () => {
  const saved = { ...process.env }; const originalFetch = globalThis.fetch;
  try {
    process.env.HYPERPAY_MODE = "live";
    assert.equal(hyperpayConfigured(), false);
    process.env.HYPERPAY_MODE = "test"; process.env.HYPERPAY_ACCESS_TOKEN = "test-secret"; process.env.HYPERPAY_ENTITY_ID = "test-entity";
    globalThis.fetch = async (url, init) => {
      assert.equal(String(url), "https://eu-test.oppwa.com/v1/checkouts");
      const body = init!.body as URLSearchParams;
      assert.equal(body.get("amount"), "12.345"); assert.equal(body.get("currency"), "JOD");
      assert.equal(body.get("merchantTransactionId"), "order-1"); assert.equal(body.get("paymentType"), "DB");
      assert.equal(init!.redirect, "error");
      return Response.json({ id: "checkout-1", integrity: "sha384-abc=" });
    };
    const session = await hyperpayProvider.createPaymentSession({ ...expected, currency: "JOD", customerEmail: "test@example.com", returnUrl: "https://example.com/ar/order/success?order=ORD-1&access=access", cancelUrl: "https://example.com/ar/order/failed" });
    assert.equal(new URL(session.redirectUrl!).pathname, "/api/payments/hyperpay");
    assert.equal(new URL(session.redirectUrl!).searchParams.get("session"), "checkout-1");
    assert.equal(hyperpayProvider.supportsSubscriptions, false);
    await assert.rejects(() => hyperpayProvider.verifyWebhook('{"status":"paid"}', new Headers()));
    await assert.rejects(() => hyperpayProvider.verifyPayment("checkout-1"));
  } finally { process.env = saved; globalThis.fetch = originalFetch; }
});
