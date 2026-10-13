# SaShopping Centre — PayPal checkout starter

This package preserves the existing **Fair Prices** HTML/CSS/JS storefront. The remote DummyJSON listings and browser-only admin products are **NOT** sellable through PayPal. Only approved products from `products.json` can be purchased. By default `products.json` is empty, so no real or sandbox order can be charged.

## Run locally (Windows)
1. Install Node.js 20+ from nodejs.org.
2. Unzip this folder, open PowerShell inside it.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Create a PayPal **Sandbox** REST app at https://developer.paypal.com/dashboard/applications/sandbox. Put its Client ID and Client Secret in `.env`. Do not share `.env`.
6. Run `npm start` and visit http://localhost:3000 (not by double-clicking index.html).

## Approve a product for testing
Replace `products.json` with an array such as:
```json
[{"id":"approved-001","name":"Approved sample item","priceZAR":199.00,"priceUSD":11.00,"active":true,"inStock":true}]
```
**This example is for sandbox testing only.** Set USD prices yourself based on a verified conversion method, fees and margin. The server charges the fixed `priceUSD` amount; it does not automatically convert ZAR. You must add a matching product ID to the displayed catalogue before a shopper can buy it. Do not sell third-party demo products without sourcing and approving stock, rights, images, and pricing.

## Before live deployment — NOT production ready
- Buy a domain and HTTPS Node.js hosting with persistent disk/database.
- Replace in-memory quotes and pending orders with a durable database, add authentication and stock reservations, and protect duplicate captures across restarts/instances.
- Add verified PayPal webhooks, reconciliation, refund/cancellation handling, shipping costs and VAT/tax treatment, delivery zones, privacy/returns/terms pages, and notification emails.
- Confirm South African PayPal merchant eligibility and currency handling, payout/withdrawal rules, and buyer-facing currency disclosure.
- Run sandbox payment tests (success, decline, cancel, retries) and verify PayPal transaction IDs against merchant dashboard.
- Only then configure live app credentials, `PAYPAL_MODE=live`, and `LIVE_PAYMENTS_ENABLED=true` on a reviewed production deployment.
- Do not expose Client Secret in browser code or Git.

## Technical notes
PayPal Orders v2 server API creates and captures the order. The server calculates USD totals from an approved product list and validates the captured USD amount and completion status. The local JSON order write is only a development convenience, not durable production accounting. Browser cart prices are never used as payment amounts.

Reference: https://developer.paypal.com/studio/checkout/standard/integrate
