# 5-Client Deployment Guide

## Overview
Each client gets an isolated Docker stack with unique:
- Database (PostgreSQL container)
- Environment variables (.env)
- Branding (logo, colors)
- Domain / subdomain

## Step 1: Copy Project
```powershell
# For each client
cd C:\Users\wjhmo
Copy-Item -Recurse LILJR-2.0-EMPIRE CLIENT-1
Copy-Item -Recurse LILJR-2.0-EMPIRE CLIENT-2
Copy-Item -Recurse LILJR-2.0-EMPIRE CLIENT-3
Copy-Item -Recurse LILJR-2.0-EMPIRE CLIENT-4
Copy-Item -Recurse LILJR-2.0-EMPIRE CLIENT-5
```

## Step 2: Configure Each Client
Edit each client's `.env.production`:

| Client | DB Name | Port | Domain |
|--------|---------|------|--------|
| 1 | client1_liljr | 8081 | client1.liljr.com |
| 2 | client2_liljr | 8082 | client2.liljr.com |
| 3 | client3_liljr | 8083 | client3.liljr.com |
| 4 | client4_liljr | 8084 | client4.liljr.com |
| 5 | client5_liljr | 8085 | client5.liljr.com |

Change in docker-compose.yml per client:
- `container_name` prefixes (client1_postgres, etc.)
- Port mappings (8081:80, 3001:3001, etc.)
- Network names (client1_network, etc.)

## Step 3: Branding
Replace in each client's `public/`:
- `logo.png` — client logo
- `favicon.ico` — client favicon
- Update `manifest.json` name/short_name

## Step 4: Deploy
```powershell
cd CLIENT-1
node deploy.js

cd ../CLIENT-2
node deploy.js

# ... repeat for all 5
```

## Step 5: DNS
Point each subdomain to your server IP:
```
client1.liljr.com → A → YOUR_SERVER_IP
client2.liljr.com → A → YOUR_SERVER_IP
# ...
```

## Step 6: SSL
Replace self-signed certs in `ssl/` with real certs:
- Let's Encrypt: `certbot --nginx`
- Or purchased certs

## Monitoring
Check all 5 clients:
```powershell
for ($i=1; $i -le 5; $i++) {
  Invoke-RestMethod -Uri "http://client$i.liljr.com/health" -TimeoutSec 5
}
```

## Billing Per Client
Track usage in each client's dashboard:
- Projects created
- Websites generated
- Emails sent
- SMS sent
- Chatbot conversations
