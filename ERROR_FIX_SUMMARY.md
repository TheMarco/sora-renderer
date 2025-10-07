# Internal Server Error - Diagnosis & Fix

## What I Did

### 1. Added Detailed Logging

**Updated Files**:
- `app/api/openai/route.ts` - Added console.log statements for debugging
- `lib/openai.ts` - Added client-side logging

**What You'll See**:
- Browser console: `[OpenAI Client]` logs
- Server logs: `[API Proxy]` logs (in Vercel function logs)

### 2. Created Debug Page

**New File**: `app/debug/page.tsx`

**Access**: Go to `/debug` in your app

**Features**:
- Test API key retrieval
- Test API proxy with `/models` endpoint
- Test video generation endpoint
- See detailed error messages

### 3. Improved Error Handling

**Changes**:
- Better error messages in API proxy
- Non-JSON response handling
- Stack traces in development mode
- More detailed error propagation

### 4. Created Troubleshooting Guide

**New File**: `TROUBLESHOOTING.md`

**Covers**:
- Common issues and solutions
- How to check logs
- How to test endpoints
- Mock API setup for testing

## Most Likely Cause

The "Internal server error" is most likely because:

**The OpenAI Sora 2 API is not publicly available yet.**

The current implementation uses placeholder endpoints based on the specification. When the real API is released, you'll need to update the endpoints.

## How to Diagnose

### Step 1: Use the Debug Page

1. Go to `https://your-app.vercel.app/debug`
2. Click "Test API Key & /models Endpoint"
3. This will tell you if:
   - Your API key is valid ✅
   - The API proxy is working ✅
   - Your key has API access ✅

### Step 2: Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" → Latest deployment
4. Click "Functions" tab
5. Look for `/api/openai` logs

You should see something like:
```
[API Proxy] Request: { endpoint: '/video/generations', method: 'POST', ... }
[API Proxy] Calling: https://api.openai.com/v1/video/generations
[API Proxy] Response status: 404
[API Proxy] Error response: { error: { message: 'Not found' } }
```

### Step 3: Check Browser Console

Open DevTools (F12) and look for:
```
[OpenAI Client] Making request: { endpoint: '/video/generations', method: 'POST' }
[OpenAI Client] Response status: 500
[OpenAI Client] Error: Not found
```

## Expected Scenarios

### Scenario 1: Sora API Not Available (Most Likely)

**Symptoms**:
- 404 Not Found
- "Unknown endpoint" error
- "Not found" error

**Solution**:
Wait for OpenAI to release the Sora 2 API publicly, or update endpoints if you have beta access.

### Scenario 2: Invalid API Key

**Symptoms**:
- 401 Unauthorized
- "Invalid API key" error

**Solution**:
1. Go to Settings
2. Delete and re-add your API key
3. Make sure it's from https://platform.openai.com/api-keys

### Scenario 3: No Sora Access

**Symptoms**:
- 403 Forbidden
- "Model not available" error

**Solution**:
Your API key doesn't have access to Sora 2. Contact OpenAI or wait for public access.

## Testing Without Sora API

If you want to test the UI without the actual API:

### Option 1: Mock the API Route

Edit `app/api/openai/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;
    
    // Mock video generation for testing
    if (endpoint === '/video/generations') {
      return NextResponse.json({
        job_id: `mock_${Date.now()}`,
        status: 'queued'
      });
    }
    
    // ... rest of the code
  }
}
```

### Option 2: Use Environment Variable

Add to `app/api/openai/route.ts`:

```typescript
if (process.env.MOCK_API === 'true' && endpoint === '/video/generations') {
  return NextResponse.json({
    job_id: `mock_${Date.now()}`,
    status: 'queued'
  });
}
```

Then set in Vercel:
- Project Settings → Environment Variables
- Add: `MOCK_API=true`

## What to Do Now

### Immediate Actions

1. **Deploy the updated code**:
   ```bash
   git add .
   git commit -m "Add debugging and error handling"
   git push
   ```

2. **Test with debug page**:
   - Go to `/debug`
   - Click "Test API Key & /models Endpoint"
   - This will verify your API key works

3. **Check the logs**:
   - Browser console for client-side logs
   - Vercel function logs for server-side logs

### If API Key Test Passes

If the `/models` endpoint test succeeds, it means:
- ✅ Your API key is valid
- ✅ The API proxy works
- ✅ The issue is with the Sora endpoint

**Next Steps**:
- Wait for Sora 2 API public release
- Monitor OpenAI announcements
- Update endpoints when available

### If API Key Test Fails

If the `/models` endpoint test fails:
- ❌ API key might be invalid
- ❌ Network issues
- ❌ OpenAI API might be down

**Next Steps**:
- Verify API key in OpenAI dashboard
- Check OpenAI status page
- Try a different API key

## Files Changed

1. ✅ `app/api/openai/route.ts` - Added detailed logging
2. ✅ `lib/openai.ts` - Added client-side logging
3. ✅ `app/debug/page.tsx` - NEW debug page
4. ✅ `TROUBLESHOOTING.md` - NEW troubleshooting guide
5. ✅ `ERROR_FIX_SUMMARY.md` - This file

## Build Status

```
✓ Build successful
✓ All pages compiled
✓ Debug page added

Route (app)                              Size     First Load JS
├ ○ /debug                               1.97 kB         120 kB
├ ƒ /api/openai                          0 B                0 B
└ ... (other pages)
```

## Next Steps

1. **Commit and push** the changes
2. **Go to `/debug`** and test your API key
3. **Check Vercel logs** for detailed error messages
4. **Read TROUBLESHOOTING.md** for more help

---

## Quick Summary

**Problem**: "Internal server error" when submitting job

**Most Likely Cause**: Sora 2 API not publicly available yet

**How to Verify**: 
1. Go to `/debug`
2. Test API key with `/models` endpoint
3. Check Vercel function logs

**Solution**: 
- If `/models` works: Wait for Sora API or update endpoints
- If `/models` fails: Check API key validity

**Status**: Debugging tools added, ready to diagnose! 🔍

