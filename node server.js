6. Open browser: `http://localhost:3000/`
7. Enter amount + note → click **Send Payment Request**
8. The UPI app will show the collect notification (user must approve).

## Notes

- Keys must be kept secret, never expose in frontend.
- Webhook `/webhook` will log payment updates.
- Replace `callback_url` with your real domain when going live.
