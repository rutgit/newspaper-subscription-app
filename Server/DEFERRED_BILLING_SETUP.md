Quick setup for Deferred Billing cron

1) Install the cron package (if not already):

```bash
npm install node-cron
```

2) The server will automatically start the deferred-billing cron when `src/server.js` starts.
It uses `startBillingCronJob()` in `src/services/BillingCronJob.js` and defaults to running daily at 02:00.

3) To change schedule, edit the cron expression in `startBillingCronJob()` call in `src/services/BillingCronJob.js` or pass a different expression when calling it.

4) Recommended: test the processing manually first by calling the admin endpoint:

```
POST /api/payment/deferred/process
Authorization: Bearer <ADMIN_TOKEN>
```

This will run `processPendingCharges()` immediately.
