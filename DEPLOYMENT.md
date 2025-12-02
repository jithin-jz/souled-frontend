# Deploying SOULED Frontend to Vercel

This guide will walk you through deploying the SOULED e-commerce frontend to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works great)
- Your backend API deployed and accessible (e.g., on Render, Railway, or similar)
- Google OAuth Client ID configured with your production domain

## Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub/GitLab/Bitbucket**

   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Verify `.env.example` exists** (already created)
   - This helps you remember which environment variables to configure

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New Project"**

3. **Import your Git repository**

   - Select your eCommerce repository
   - Vercel will auto-detect it's a Vite project

4. **Configure Project Settings**

   - **Framework Preset**: Vite
   - **Root Directory**: `Souled` (if your frontend is in a subdirectory)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Add Environment Variables**

   Click "Environment Variables" and add:

   | Name                    | Value                       | Example                                    |
   | ----------------------- | --------------------------- | ------------------------------------------ |
   | `VITE_API_URL`          | Your backend API URL        | `https://your-backend.onrender.com/api`    |
   | `VITE_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID | `123456789-abc.apps.googleusercontent.com` |

   > **Important**: Make sure these values match your production backend!

6. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - You'll get a URL like `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to your frontend directory
cd c:\Users\Jithi\Desktop\eCommerce\Souled

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add VITE_API_URL
vercel env add VITE_GOOGLE_CLIENT_ID

# Deploy to production
vercel --prod
```

## Step 3: Configure Google OAuth

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Navigate to your OAuth 2.0 Client**

   - APIs & Services → Credentials
   - Click on your OAuth 2.0 Client ID

3. **Add Authorized JavaScript Origins**

   ```
   https://your-project.vercel.app
   ```

4. **Add Authorized Redirect URIs**

   ```
   https://your-project.vercel.app
   https://your-project.vercel.app/
   ```

5. **Save changes**

## Step 4: Configure Backend CORS

Update your Django backend's CORS settings to allow your Vercel domain:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Keep for local development
    "https://your-project.vercel.app",  # Add your Vercel URL
]
```

Redeploy your backend after making this change.

## Step 5: Test Your Deployment

1. **Visit your Vercel URL**

   - Open `https://your-project.vercel.app`

2. **Test Core Features**

   - ✅ Browse products
   - ✅ Register/Login with email
   - ✅ Login with Google OAuth
   - ✅ Add items to cart
   - ✅ Add items to wishlist
   - ✅ Complete checkout (COD and Stripe)
   - ✅ View orders
   - ✅ Admin panel access

3. **Check Browser Console**

   - Open DevTools (F12)
   - Verify no console errors
   - Verify no console.log statements appear

4. **Test on Mobile**
   - Open on your phone
   - Verify responsive design works

## Troubleshooting

### Issue: "Missing VITE_API_URL in .env"

**Solution**: Environment variables not set in Vercel

- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`
- Redeploy: Deployments → Three dots → Redeploy

### Issue: CORS errors in browser console

**Solution**: Backend not configured for your Vercel domain

- Update `CORS_ALLOWED_ORIGINS` in Django settings
- Redeploy backend
- Clear browser cache and try again

### Issue: Google OAuth not working

**Solution**: Authorized origins not configured

- Add your Vercel URL to Google Cloud Console
- Make sure there are no trailing slashes mismatch
- Wait a few minutes for Google's changes to propagate

### Issue: API calls failing

**Solution**: Check your `VITE_API_URL`

- Make sure it ends with `/api` (not just the domain)
- Verify your backend is actually running
- Test backend directly: `https://your-backend.com/api/products/`

### Issue: Build failing on Vercel

**Solution**: Check build logs

- Look for missing dependencies
- Verify `package.json` has all required packages
- Try building locally: `npm run build`

## Custom Domain (Optional)

1. **Go to Vercel Dashboard → Your Project → Settings → Domains**

2. **Add your custom domain**

   - Enter your domain (e.g., `souled.com`)
   - Follow DNS configuration instructions

3. **Update Google OAuth**

   - Add your custom domain to authorized origins
   - Add to authorized redirect URIs

4. **Update Backend CORS**
   - Add custom domain to `CORS_ALLOWED_ORIGINS`

## Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel will automatically build and deploy!
```

## Monitoring & Analytics

1. **Vercel Analytics**

   - Go to your project → Analytics
   - View page views, performance metrics

2. **Vercel Logs**

   - Go to your project → Deployments → View Function Logs
   - Debug runtime issues

3. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals in Vercel dashboard

## Environment-Specific Deployments

- **Production**: `main` branch → `your-project.vercel.app`
- **Preview**: Other branches → `branch-name.your-project.vercel.app`
- **Local**: `npm run dev` → `localhost:5173`

## Security Checklist

- ✅ Environment variables set in Vercel (not in code)
- ✅ `.env` file in `.gitignore`
- ✅ CORS configured correctly
- ✅ Google OAuth authorized origins updated
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Security headers configured in `vercel.json`

## Next Steps

1. **Set up custom domain** (optional)
2. **Enable Vercel Analytics** (optional)
3. **Set up monitoring/alerts** (optional)
4. **Configure CDN caching** (automatic with Vercel)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Congratulations! Your SOULED frontend is now live! 🎉**
