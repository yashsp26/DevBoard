Profile-specific views and hooks live here; shared layout, generic UI, and direct Axios calls do not belong here.

Password changes use the authenticated `PATCH /api/v1/user/change-password` endpoint and send only the current and new passwords. The backend resolves the user (and therefore their email) from the JWT, so no email or email delivery service is required for this flow. If password-reset or OTP verification is added later, that separate flow will require an email provider.
