# TalentOS Runbooks

> Phase 24 – Polish & Launch Prep. Stub runbooks for operations.

---

## Incident Response

### Severity levels
- **P1** – Full outage, all users affected
- **P2** – Major feature broken, significant users affected
- **P3** – Minor issue, workaround available

### P1: Full outage
1. Acknowledge incident in #incidents
2. Check health endpoint: `GET /api/health`
3. Verify deployment status (Vercel/ hosting dashboard)
4. Rollback if recent deploy: `vercel rollback` or platform equivalent
5. Notify stakeholders
6. Post-mortem within 48h

### P2: Feature broken
1. Acknowledge in #incidents
2. Identify affected routes/features
3. Check error tracking (Sentry if configured)
4. Apply hotfix or rollback
5. Document workaround for users

### P3: Minor issue
1. Create ticket
2. Triage in next sprint
3. Document known workaround

---

## Deployment

### Pre-deploy checklist
- [ ] All tests pass
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in staging

### Deploy steps (Vercel)
```bash
git push origin main
# Vercel auto-deploys from main
```

### Deploy steps (manual)
```bash
cd frontend
npm run build
npm run start
# Or: pm2 restart tma-frontend
```

### Rollback
```bash
vercel rollback  # Vercel
# Or: git revert <commit> && git push
```

---

## Health Check

- **Endpoint:** `GET /api/health` (or `/health` page)
- **Expected:** 200, `{ "status": "ok" }`
- **Monitoring:** Configure uptime checks to hit this endpoint every 1–5 min
