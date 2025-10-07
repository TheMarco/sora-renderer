# Deployment Guide - Sora Renderer

## CORS Issue Fixed ✅

The CORS errors you encountered when running locally have been resolved by adding a Next.js API route that acts as a proxy to the OpenAI API.

### What Changed

1. **Added API Proxy**: `app/api/openai/route.ts`
   - Handles all OpenAI API requests server-side
   - Eliminates CORS issues
   - Works both locally and in production

2. **Updated OpenAI Integration**: `lib/openai.ts`
   - Now routes all requests through `/api/openai`
   - API key sent securely in request body
   - No more direct browser-to-OpenAI calls

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - What's your project's name? **sora-renderer** (or your choice)
   - In which directory is your code located? **./** (press Enter)
   - Want to override settings? **No**

5. **Deploy to Production**:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

### Option 3: Deploy via GitHub Integration

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

2. **Configure (if needed)**:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## Vercel Configuration

The project is already configured for Vercel deployment. No additional configuration needed!

### Automatic Settings

- ✅ Framework: Next.js 14
- ✅ Node Version: 20.x
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

### Environment Variables

**No environment variables needed!** 

The app stores API keys locally in the browser, so you don't need to configure anything on Vercel.

## Post-Deployment

### 1. Test the Deployment

Once deployed, Vercel will give you a URL like:
```
https://sora-renderer.vercel.app
```

Visit the URL and:
1. Go to Settings
2. Add your OpenAI API key
3. Try creating a video

### 2. Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### 3. Monitor Deployments

- Every push to `main` branch triggers a production deployment
- Pull requests get preview deployments automatically
- View logs in Vercel Dashboard

## Local Development (No CORS Issues)

The API proxy also works locally:

```bash
npm run dev
```

Now you can:
- ✅ Test API calls locally without CORS errors
- ✅ Use the same code in development and production
- ✅ Debug API issues more easily

## Troubleshooting

### Build Fails on Vercel

**Check Node Version**:
- Vercel uses Node 20.x by default
- If issues occur, add `engines` to `package.json`:

```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### API Calls Still Fail

**Verify API Key**:
1. Make sure you've added your OpenAI API key in Settings
2. Check browser console for error messages
3. Verify the key has access to Sora 2 API

**Check API Endpoints**:
- The current implementation uses placeholder endpoints
- Update `lib/openai.ts` with actual Sora 2 endpoints when available

### Deployment Succeeds but App Doesn't Work

**Clear Browser Data**:
1. Open DevTools (F12)
2. Go to Application → Storage
3. Click "Clear site data"
4. Refresh the page

**Check Browser Console**:
- Look for JavaScript errors
- Check Network tab for failed requests

## Performance Optimization

### Vercel Edge Network

Your app automatically benefits from:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Compression

### Recommended Settings

In Vercel Dashboard → Settings → General:

- **Node.js Version**: 20.x
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Build Command**: `npm run build`

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

### Manual Deployments

Redeploy from Vercel Dashboard:
1. Go to Deployments
2. Click "..." on any deployment
3. Click "Redeploy"

## Monitoring

### View Logs

In Vercel Dashboard:
1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. View "Build Logs" or "Function Logs"

### Analytics (Optional)

Enable Vercel Analytics:
1. Go to Analytics tab
2. Enable Web Analytics
3. View traffic and performance metrics

## Security Notes

### API Key Security

- ✅ API keys stored encrypted in browser
- ✅ Keys sent to API proxy via HTTPS
- ✅ Keys never exposed in client-side code
- ✅ No keys stored on Vercel servers

### Best Practices

1. **Use HTTPS**: Vercel provides automatic HTTPS
2. **Keep Dependencies Updated**: Run `npm update` regularly
3. **Monitor Usage**: Check OpenAI usage dashboard
4. **Rate Limiting**: Consider adding rate limiting if needed

## Cost Considerations

### Vercel Costs

- **Hobby Plan**: Free for personal projects
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless function executions included

- **Pro Plan**: $20/month
  - More bandwidth
  - More function executions
  - Team features

### OpenAI Costs

- Sora 2: $0.10/second
- Sora 2 Pro: $0.30-$0.50/second
- Monitor usage in OpenAI dashboard

## Updating the App

### Deploy Updates

1. **Make changes locally**
2. **Test locally**: `npm run dev`
3. **Commit changes**: `git commit -am "Update message"`
4. **Push to GitHub**: `git push`
5. **Vercel auto-deploys** (if connected to GitHub)

Or use Vercel CLI:
```bash
vercel --prod
```

## Rollback

If a deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find a working deployment
3. Click "..." → "Promote to Production"

## Support

### Vercel Support

- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

### App Issues

- Check browser console for errors
- Review `IMPLEMENTATION.md` for technical details
- Check OpenAI API status

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test with your OpenAI API key
3. ✅ Share the URL with your team
4. ✅ Monitor usage and costs
5. ✅ Customize as needed

---

## Quick Deploy Button

Add this to your GitHub README for one-click deployment:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheMarco/sora-renderer)
```

---

**Status**: Ready to deploy! 🚀

The CORS issue is resolved, and the app is fully configured for Vercel deployment.

## Credits

Created by **Marco van Hylckama Vlieg**
- Website: [ai-created.com](https://ai-created.com/)
- X/Twitter: [@AIandDesign](https://x.com/AIandDesign)

