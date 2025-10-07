# Troubleshooting Guide

## "Internal server error" when submitting job

This error occurs when the API proxy encounters an issue. Here's how to diagnose and fix it:

### Step 1: Check if Sora API is Available

**Important**: The OpenAI Sora 2 API may not be publicly available yet. The current implementation uses placeholder endpoints based on the specification.

**To verify**:
1. Check OpenAI's documentation: https://platform.openai.com/docs
2. Look for Sora 2 API endpoints
3. Check if your API key has access to Sora

### Step 2: Use the Debug Page

I've created a debug page to help diagnose issues:

1. Go to `/debug` in your app
2. Click "Test API Key & /models Endpoint"
3. This will verify:
   - Your API key is stored correctly
   - The API proxy is working
   - Your API key is valid

### Step 3: Check Browser Console

Open browser DevTools (F12) and check the Console tab for detailed logs:

```
[OpenAI Client] Making request: { endpoint: '/video/generations', method: 'POST' }
[OpenAI Client] Response status: 500
[OpenAI Client] Error: { error: '...' }
```

### Step 4: Check Vercel Function Logs

If deployed on Vercel:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on the latest deployment
5. Click "Functions" tab
6. Look for `/api/openai` logs

You should see:
```
[API Proxy] Request: { endpoint: '/video/generations', method: 'POST', ... }
[API Proxy] Calling: https://api.openai.com/v1/video/generations
[API Proxy] Response status: 404
```

### Common Issues and Solutions

#### Issue 1: Sora API Not Available

**Symptoms**:
- 404 Not Found error
- "Unknown endpoint" error

**Solution**:
The Sora 2 API is not publicly available yet. You have two options:

1. **Wait for official release**: Monitor OpenAI's announcements
2. **Update endpoints**: If you have access to a beta/preview API, update the endpoints in `lib/openai.ts`

**To update endpoints**:

<augment_code_snippet path="lib/openai.ts" mode="EXCERPT">
````typescript
// Update this section when real API is available
const response = await apiRequest<{ job_id: string }>('/video/generations', {
  method: 'POST',
  body: requestBody,
});
````
</augment_code_snippet>

#### Issue 2: Invalid API Key

**Symptoms**:
- 401 Unauthorized error
- "Invalid API key" error

**Solution**:
1. Go to Settings
2. Delete your current API key
3. Get a new key from https://platform.openai.com/api-keys
4. Add the new key
5. Try again

#### Issue 3: API Key Lacks Sora Access

**Symptoms**:
- 403 Forbidden error
- "Model not available" error

**Solution**:
Your API key may not have access to Sora 2. Contact OpenAI support or wait for public access.

#### Issue 4: Rate Limit Exceeded

**Symptoms**:
- 429 Too Many Requests error
- "Rate limit exceeded" error

**Solution**:
1. Wait a few minutes
2. Try again
3. Consider upgrading your OpenAI plan

#### Issue 5: Network/CORS Issues

**Symptoms**:
- "Failed to fetch" error
- CORS errors in console

**Solution**:
This should be fixed by the API proxy. If you still see CORS errors:
1. Make sure you're using the latest code
2. Verify `app/api/openai/route.ts` exists
3. Restart your dev server or redeploy

### Testing with Mock Data

If the Sora API is not available, you can test the UI with mock data:

1. Create a mock API route:

<augment_code_snippet path="app/api/openai/route.ts" mode="EXCERPT">
````typescript
// Add this at the top of the POST function for testing
if (endpoint === '/video/generations' && process.env.MOCK_API === 'true') {
  return NextResponse.json({
    job_id: `mock_${Date.now()}`,
    status: 'queued'
  });
}
````
</augment_code_snippet>

2. Set environment variable:
```bash
# Local
MOCK_API=true npm run dev

# Vercel
# Add MOCK_API=true in Project Settings → Environment Variables
```

3. Jobs will be created but won't actually generate videos

### Checking API Endpoint Structure

The current implementation assumes this API structure:

**Create Job**:
```
POST /v1/video/generations
{
  "model": "sora-2",
  "input": {
    "type": "video.generate",
    "prompt": "...",
    "resolution": "1280x720",
    "duration": 5
  }
}

Response:
{
  "job_id": "job_abc123",
  "status": "queued"
}
```

**Get Job Status**:
```
GET /v1/video/generations/{job_id}

Response:
{
  "job_id": "job_abc123",
  "status": "succeeded",
  "assets": [
    {
      "url": "https://...",
      "mime": "video/mp4"
    }
  ]
}
```

If the actual API structure is different, you'll need to update:
- `lib/openai.ts` - Request/response handling
- `lib/types.ts` - Type definitions

### Getting More Information

#### Enable Verbose Logging

The code now includes console.log statements. Check:

**Browser Console**:
- `[OpenAI Client]` logs - Client-side requests
- `[API Proxy]` logs - May appear if running locally

**Server Logs** (Vercel):
- `[API Proxy]` logs - Server-side requests
- Full request/response details

#### Test Individual Components

Use the debug page (`/debug`) to test:
1. API key retrieval
2. API proxy functionality
3. OpenAI API connectivity
4. Endpoint availability

### Still Having Issues?

If you're still encountering errors:

1. **Verify API Access**:
   - Check OpenAI dashboard
   - Verify your plan includes Sora access
   - Check usage limits

2. **Check Code Version**:
   - Make sure you have the latest code
   - Verify all files are committed
   - Redeploy if on Vercel

3. **Test Locally**:
   ```bash
   npm run dev
   # Open http://localhost:3000/debug
   ```

4. **Check Network**:
   - Open DevTools → Network tab
   - Look for failed requests
   - Check request/response details

5. **Review Logs**:
   - Browser console
   - Vercel function logs
   - Terminal output (if local)

### Expected Behavior

When everything is working:

1. **Submit Job**:
   - Click "Generate Video"
   - See "Job submitted successfully!" toast
   - Redirect to Queue page

2. **Queue Page**:
   - Job appears in "Active" section
   - Status updates automatically
   - Progress indicator shows polling

3. **Completion**:
   - Job moves to "Completed" section
   - Video appears in Library
   - Thumbnail generated automatically

### Known Limitations

1. **Sora API Availability**: The API may not be publicly available yet
2. **Endpoint Structure**: May differ from specification
3. **Rate Limits**: OpenAI may have strict rate limits
4. **Cost**: Video generation can be expensive

### Next Steps

1. **Test with Debug Page**: Go to `/debug` and run tests
2. **Check Logs**: Review browser console and Vercel logs
3. **Verify API Access**: Confirm your API key has Sora access
4. **Update Endpoints**: Adjust code when real API is available

---

## Quick Checklist

- [ ] API key added in Settings
- [ ] API key is valid (test with `/debug`)
- [ ] Sora API is available (check OpenAI docs)
- [ ] No CORS errors (should be fixed by proxy)
- [ ] Browser console shows detailed logs
- [ ] Vercel function logs show request details

If all checks pass but still getting errors, the Sora API may not be available yet or your API key may not have access.

