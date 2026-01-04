# Quick Diagnose: "Failed to load Leaderboard"

## Step 1: Check Browser Console (Most Important!)

1. **Open your deployed app**: `https://black-field-07a75c203.6.azurestaticapps.net/`
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Look for the error message** - it should show something like:
   - `Error fetching leaderboard: [error details]`
   - Or a network error with status code (404, 500, etc.)

**What to look for:**
- **404 error** → API Functions still not deployed
- **500 error** → Functions deployed but Cosmos DB not configured
- **Network error / CORS error** → API URL issue
- **Timeout** → Functions not responding

## Step 2: Test API Endpoint Directly

Open this URL in your browser:
```
https://black-field-07a75c203.6.azurestaticapps.net/api/players
```

**Expected results:**
- ✅ **`[]` (empty array)** → API works! Cosmos DB is just empty (normal for first time)
- ✅ **JSON array with player data** → API works perfectly!
- ❌ **404 Not Found** → Functions not deployed yet
- ❌ **500 Internal Server Error** → Functions deployed but Cosmos DB not configured
- ❌ **Timeout / Can't reach** → Functions not responding

## Step 3: Check GitHub Actions Deployment

1. **Go to GitHub**: `https://github.com/telit002/tetris-finance-fusion`
2. **Click "Actions" tab**
3. **Check latest workflow run**:
   - ✅ **Green checkmark** → Deployment succeeded
   - ❌ **Red X** → Deployment failed (check error logs)
   - 🟡 **Yellow circle** → Still running (wait for it to finish)

**If deployment failed:**
- Click on the failed workflow
- Check "Build API Functions" step for errors
- Look for npm install or build errors

## Step 4: Check Azure Portal - Functions

1. **Go to Azure Portal**: `https://portal.azure.com`
2. **Search for**: `black-field-07a75c203`
3. **Click your Static Web App**
4. **Check left menu**:
   - ✅ **"Functions" menu exists** → Functions are deployed!
   - ❌ **No "Functions" menu** → Functions still not recognized

**If Functions menu exists:**
- Click **Functions**
- You should see `players` and `admin` functions
- Click on `players` → **Code + Test** → **Test/Run**
- Test with a GET request - should return `[]` or data

## Step 5: Check Cosmos DB Settings

1. **In Azure Portal** → Your Static Web App
2. **Go to**: Settings → Configuration → Application settings
3. **Verify these exist**:
   - `COSMOSDB_ENDPOINT`
   - `COSMOSDB_KEY`
   - `COSMOSDB_DATABASE` = `tetris-finance-fusion`
   - `COSMOSDB_CONTAINER` = `players`

**If missing:**
- Add them
- Click **Save** (this restarts Functions)
- Wait 1-2 minutes for restart

## Step 6: Check Network Tab

1. **Open your app** → Press F12
2. **Go to Network tab**
3. **Refresh the page**
4. **Look for request to** `/api/players`
5. **Click on it** to see:
   - **Status code**: 200 (good), 404 (not found), 500 (server error)
   - **Response**: What the server returned
   - **Headers**: Any error messages

## Common Issues & Fixes

### Issue: Still getting 404
**Cause**: Functions not deployed or not recognized  
**Fix**: 
- Wait for GitHub Actions to finish (can take 5-10 minutes)
- Check deployment logs for errors
- Verify `api_location: "api"` in workflow

### Issue: Getting 500 error
**Cause**: Functions deployed but Cosmos DB not configured  
**Fix**:
- Add Cosmos DB environment variables in Application settings
- Click Save to restart Functions
- Wait 1-2 minutes

### Issue: CORS error
**Cause**: Frontend can't call API  
**Fix**:
- Check `src/services/api.ts` - should use `/api` for production
- Verify API base URL is correct

### Issue: Timeout
**Cause**: Functions not responding  
**Fix**:
- Check if Functions are running in Azure Portal
- Check Function logs for errors
- Verify Cosmos DB connection

## What to Report Back

Please share:
1. **Browser console error** (exact error message)
2. **API endpoint test result** (what you see at `/api/players`)
3. **GitHub Actions status** (succeeded/failed/running)
4. **Azure Portal Functions menu** (exists or not)
5. **Cosmos DB settings** (present or missing)

This will help identify the exact issue!

