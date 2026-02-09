# Deployment Guide - Vercel + Render

## 🎯 Overview

This guide will help you deploy the Second-Hand Marketplace to production:
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free tier)
- **Database**: Render PostgreSQL (Free - 500MB)

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Render account (sign up at [render.com](https://render.com))
- [ ] Project pushed to GitHub

---

## 🗄️ Step 1: Deploy Database (Render PostgreSQL)

### 1.1 Create PostgreSQL Database

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in details:
   ```
   Name: secondhand-db
   Database: secondhand
   User: secondhand_user
   Region: Singapore (or closest to you)
   Plan: Free
   ```
4. Click **"Create Database"**

### 1.2 Get Connection String

1. After creation, go to **"Info"** tab
2. Copy **"Internal Database URL"** (starts with `postgres://`)
3. Save it for later (format: `postgres://user:pass@host:port/db`)

### 1.3 Test Local Connection (Optional)

```bash
# Install PostgreSQL client locally (optional)
dotnet ef migrations add InitialCreate --context AppDbContext
dotnet ef database update --connection "YOUR_POSTGRES_URL"
```

---

## 🖥️ Step 2: Deploy Backend (Render Web Service)

### 2.1 Create Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `Second_Hand_System` repo

### 2.2 Configure Build Settings

Fill in these settings:

```
Name: secondhand-api
Region: Singapore
Branch: main
Root Directory: (leave empty)
Runtime: .NET
Build Command: dotnet publish -c Release -o out
Start Command: dotnet out/Second-hand_System.dll
```

### 2.3 Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `DATABASE_URL` | *(Paste Internal Database URL from Step 1.2)* |
| `JWT_SECRET_KEY` | *(Generate 64-char random string)* |
| `ProductionFrontendUrl` | `https://your-app.vercel.app` *(will update after Vercel deploy)* |

**Generate JWT Secret:**
```powershell
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for build (~3-5 minutes)
3. Once deployed, your API will be at: `https://secondhand-api.onrender.com`

### 2.5 Run Migrations

After first deploy, run migrations:

1. Go to **"Shell"** tab in Render dashboard
2. Run:
   ```bash
   dotnet ef database update
   ```

Or use Render's **"Run Command"** feature.

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Update API URL

Before deploying, update the frontend to point to Render API:

**File: `frontend/src/environments/environment.prod.ts`**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://secondhand-api.onrender.com/api'
};
```

Commit and push this change:
```bash
git add frontend/src/environments/environment.prod.ts
git commit -m "Update production API URL"
git push origin main
```

### 3.2 Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. **"Import Git Repository"** → Select your GitHub repo
3. Configure:
   ```
   Project Name: secondhand-marketplace
   Framework Preset: Angular
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist/frontend/browser
   ```
4. Click **"Deploy"**

### 3.3 Get Vercel URL

After deployment (~2 minutes):
- Your frontend will be at: `https://secondhand-marketplace.vercel.app`
- Copy this URL

### 3.4 Update Backend CORS

Go back to **Render** → Your web service → **Environment**:
- Update `ProductionFrontendUrl` to your Vercel URL
- Click **"Save Changes"** (this will redeploy backend)

---

## ✅ Step 4: Verification

### 4.1 Test API

Visit: `https://secondhand-api.onrender.com/swagger`
- Should see Swagger UI
- Test `/api/auth/login`

### 4.2 Test Frontend

Visit: `https://secondhand-marketplace.vercel.app`
- Homepage loads
- Can browse products
- Can register/login
- Can add to cart
- Admin login works

### 4.3 Full Flow Test

1. Register new customer account
2. Browse products
3. Add to cart
4. Checkout (creates order)
5. Login as admin
6. View orders in admin dashboard

---

## 🔧 Troubleshooting

### Issue: "CORS Error"
**Solution**: Make sure `ProductionFrontendUrl` in Render matches your Vercel URL exactly

### Issue: "Database connection failed"
**Solution**: 
- Verify `DATABASE_URL` is set correctly
- Use **Internal Database URL**, not External

### Issue: "JWT token invalid"
**Solution**: Make sure `JWT_SECRET_KEY` is at least 32 characters

### Issue: "Cold start - slow first load"
**Solution**: This is normal for Render free tier (10-20s first request)

### Issue: "Build failed on Render"
**Solution**: 
- Check logs in Render dashboard
- Verify `.csproj` has `Npgsql.EntityFrameworkCore.PostgreSQL` package

---

## 📊 Monitoring

### Render Dashboard
- **Logs**: View application logs
- **Metrics**: CPU/Memory usage
- **Shell**: SSH into container

### Vercel Dashboard
- **Analytics**: Page views, performance
- **Deployments**: History of all deployments
- **Domains**: Custom domain setup

---

## 🚀 Post-Deployment

### Update README

Add live demo section:

```markdown
## 🌐 Live Demo

**Frontend**: https://secondhand-marketplace.vercel.app
**API Documentation**: https://secondhand-api.onrender.com/swagger

**Test Accounts:**
- Admin: admin / Admin@123
- Customer: customer1 / Customer@123
```

### Screenshots

Take screenshots of:
1. Homepage
2. Product listing
3. Product details
4. Cart
5. Admin dashboard
6. Order management

Add to README in a carousel or grid.

---

## 💰 Cost Summary

- **Vercel**: $0/month (Free tier)
- **Render Web Service**: $0/month (Free tier with 750 hours)
- **Render PostgreSQL**: $0/month (Free tier - 500MB, 90 days)

**Total: $0/month** for demo purposes! 🎉

---

## ⚠️ Free Tier Limitations

### Render Free Tier:
- ❌ Sleeps after 15 min inactivity (cold start: 10-20s)
- ❌ PostgreSQL expires after 90 days
- ✅ 750 hours/month (enough for demo)

### Vercel Free Tier:
- ✅ No sleep
- ✅ Fast CDN
- ✅ Auto-deploy from GitHub

---

## 🎯 Next Steps

1. [ ] Test full deployment
2. [ ] Take screenshots
3. [ ] Record video walkthrough
4. [ ] Update README with demo links
5. [ ] Share on LinkedIn/Portfolio
6. [ ] Create Fiverr gig

---

**Questions?** Check Render docs: [render.com/docs](https://render.com/docs)
