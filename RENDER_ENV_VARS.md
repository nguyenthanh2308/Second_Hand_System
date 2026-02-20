# Render Environment Variables

## Copy these to Render Web Service

### 1. ASPNETCORE_ENVIRONMENT
```
Production
```

### 2. DATABASE_URL
```
postgresql://secondhand_user:Ee4QiKzVm8tOI0rpzG6pn78Ov7mCdSib@dpg-d64ukpbqhjbs73cqr2fg-a/secondhand_xg9l
```

### 3. JWT_SECRET_KEY
```
(Will be generated below)
```

### 4. ProductionFrontendUrl
```
https://your-app.vercel.app
(Update this after Vercel deployment)
```

---

## Instructions:

1. Go to Render Dashboard → New + → Web Service
2. Connect your GitHub repo: `nguyenthanh2308/Second_Hand_System`
3. Configure:
   - Name: `secondhand-api`
   - Region: Singapore
   - Branch: `main`
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `dotnet out/Second-hand_System.dll`
4. Click "Advanced" → Add Environment Variables (copy from above)
5. Deploy!

**After Vercel deployment, update ProductionFrontendUrl with the actual Vercel URL**
