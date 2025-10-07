# API Updates - Sora 2 Correct Implementation

## Changes Made

### 1. ✅ Fixed Duration Constraints

**Problem**: The spec allowed 1-20 seconds, but Sora 2 only supports **4, 8, or 12 seconds**.

**Changes**:
- Updated `lib/constants.ts`:
  ```typescript
  // OLD:
  export const MIN_DURATION = 1;
  export const MAX_DURATION = 20;
  export const DEFAULT_DURATION = 5;
  
  // NEW:
  export const ALLOWED_DURATIONS = [4, 8, 12] as const;
  export const DEFAULT_DURATION = 4;
  ```

- Completely rewrote `components/render/DurationSlider.tsx`:
  - Changed from slider to button selection
  - Shows 3 buttons: 4s (Quick), 8s (Standard), 12s (Extended)
  - Clear visual feedback for selected duration
  - Helpful labels for each option

### 2. ✅ Updated API Request Structure

**Problem**: The API request structure was based on a spec that didn't match the actual OpenAI Sora 2 API.

**Changes in `lib/openai.ts`**:

**Create Video Job**:
```typescript
// OLD structure:
{
  model: 'sora-2',
  input: {
    type: 'video.generate',
    prompt: '...',
    resolution: '1280x720',
    duration: 5,
    image?: { ... }
  }
}

// NEW structure (matches OpenAI API):
{
  model: 'sora-2',
  prompt: '...',
  resolution: '1280x720',
  duration: 4,  // Must be 4, 8, or 12
  image?: { ... }
}
```

**Response Handling**:
```typescript
// OLD:
response.job_id

// NEW:
response.id
```

**Get Job Status**:
```typescript
// OLD:
{
  job_id: response.job_id,
  assets: response.assets
}

// NEW:
{
  job_id: response.id,
  assets: response.output?.map(item => ({
    url: item.url,
    mime: 'video/mp4'
  }))
}
```

## What This Fixes

### Duration Selection
- ✅ Users can only select valid durations (4, 8, or 12 seconds)
- ✅ Better UX with button selection instead of slider
- ✅ Clear labels showing what each duration means
- ✅ No more invalid duration errors

### API Compatibility
- ✅ Request structure matches actual OpenAI Sora 2 API
- ✅ Response parsing handles correct field names
- ✅ Should work with real API when you have access

## Testing

### 1. Check Duration Selection

1. Go to `/new` page
2. You should see 3 duration buttons: 4s, 8s, 12s
3. Click each one - it should highlight
4. Default should be 4s

### 2. Test API Call

1. Add your API key in Settings
2. Go to `/debug` page
3. Test API key with `/models` endpoint
4. If that works, try creating a video
5. Check browser console and Vercel logs for detailed output

## Reference

Based on the working implementation at:
https://github.com/alasano/sora-2-playground

Key findings:
- Sora 2 only supports 4, 8, and 12 second durations
- API uses flat structure, not nested `input` object
- Response uses `id` field, not `job_id`
- Output videos are in `output` array, not `assets`

## Files Changed

1. ✅ `lib/constants.ts` - Duration constraints
2. ✅ `components/render/DurationSlider.tsx` - Complete rewrite
3. ✅ `lib/openai.ts` - API request/response structure

## Build Status

```
✓ Build successful
✓ All pages compiled
✓ No errors

Route (app)                              Size     First Load JS
├ ○ /new                                 4.95 kB         144 kB
├ ○ /debug                               1.97 kB         120 kB
└ ... (other pages)
```

## Next Steps

1. **Commit and push** the changes:
   ```bash
   git add .
   git commit -m "Fix Sora 2 API: correct durations (4/8/12s) and request structure"
   git push
   ```

2. **Test with real API**:
   - Make sure your API key has Sora 2 access
   - Try creating a 4-second video
   - Check the logs for any errors

3. **If still getting errors**:
   - Go to `/debug` page
   - Test the `/models` endpoint first
   - Check Vercel function logs for details
   - The API might still be in beta/limited access

## Important Notes

### Duration Validation

The app now enforces the correct durations at multiple levels:
1. **UI**: Only shows 4, 8, 12 second buttons
2. **Constants**: `ALLOWED_DURATIONS` array
3. **Type Safety**: TypeScript ensures only valid values

### API Structure

The new structure matches the actual OpenAI Sora 2 API:
- Flat request body (no nested `input` object)
- Uses `id` for job identifier
- Uses `output` array for generated videos
- Simplified error handling

### Backward Compatibility

If you have existing jobs in the database with invalid durations (like 5s), they will still be displayed but you won't be able to create new ones with those durations.

## Troubleshooting

### "Invalid duration" Error

This should no longer happen since the UI only allows 4, 8, or 12 seconds.

### API Still Failing

1. Check if your API key has Sora 2 access
2. Verify the API is available (might be in limited beta)
3. Check Vercel logs for actual error messages
4. Use `/debug` page to test endpoints

### Duration Buttons Not Showing

1. Clear browser cache
2. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
3. Check browser console for errors

---

**Status**: ✅ API structure updated to match real Sora 2 API

The app now uses the correct duration constraints (4, 8, 12 seconds) and the proper API request/response structure based on the working implementation.

