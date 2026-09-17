# Online checkout foundation

Implemented:
- Authenticated GET /api/customer/checkout reads only the current customer's cart.
- Prices are parsed strictly into integer paise on the server; quote-only or invalid prices are never treated as payable totals.
- Availability and quantity are rechecked against the current catalogue.
- /checkout shows products, a provisional subtotal, delivery fields and upcoming UPI, net banking and card methods.
- Delivery fields are not saved or submitted. No order is created and no stock is reserved.
- POST /api/customer/checkout always rejects payment creation while no provider is connected.

Before enabling a gateway:
1. Decide provider, INR pricing, GST, shipping and installation rules.
2. Add server-only credentials; never accept totals from the browser.
3. Implement authenticated order creation with availability revalidation and idempotency.
4. Add server-side payment verification and signed webhook handling with replay protection.
5. Update customer/admin orders only after verified provider status; handle failures, expiry and refunds.
6. Validate delivery details server-side and add appropriate storage/privacy handling.
7. Exercise sandbox payments for UPI, cards and net banking before live activation.

No environment variable alone enables charging in this foundation.
