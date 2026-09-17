# Contact enquiry delivery

The contact form saves enquiries immediately under Admin > Enquiries / Requests, then sends a plain-text notification to **bigfoxsoftware@gmail.com**. The visitor's email is Reply-To, never the sender. Email delivery status is recorded on each enquiry. Failures do not discard customer submissions.

## Activate email

Copy `.env.mail.example` entries into the server environment or `.env.local`. For Gmail, set `SMTP_PASSWORD` to an app password for `SMTP_USER`, not the normal account password. For another SMTP service, set its host, port, credentials, and permitted sender. Port 465 uses TLS; other ports require STARTTLS. Restart the Next.js server after setting these values.

The implementation uses the [Nodemailer SMTP transport](https://nodemailer.com/smtp).

## Notifications and retries

- Existing admin and customer bell icons update through an authenticated event stream. A five-second polling fallback remains available.
- Signed-in customers receive enquiry receipt and status-change notifications in their own account. An anonymous visitor cannot link an enquiry to someone else's account by entering their email.
- Pending/failed email delivery is visible in admin notifications. While the admin console is open, it retries up to three pending messages every minute. An authenticated administrator can also POST `/api/admin/enquiries/retry-email` after activating mail.
- Enquiries are stored before delivery is attempted. A queued status is not proof of email delivery. SMTP acceptance is recorded as sent; inbox arrival still depends on the receiving mail service.
- Without a running admin console, pending messages remain stored until the next console visit or retry request. Production deployments needing unattended retries can schedule that authenticated operation.
