# Fix 404 Error for API Endpoints

## Problem
Getting `404 (Not Found)` when calling `/api/players` on deployed Static Web App: `https://black-field-07a75c203.6.azurestaticapps.net`

## Root Cause
Azure Functions may not be properly deployed or recognized by Static Web Apps.

## Solutions Applied

### 1. Updated GitHub Actions Workflow
- Added frontend build step
- Ensured API Functions are built before deployment
- Workflow file: `.github/workflows/azure-static-web-apps-black-field-07a75c203.yml`

### 2. Fixed API Base URL
- Updated `src/services/api.ts` to use `/api` for production
- This ensures frontend calls the correct API endpoint

## Verification Steps (Azure Portal)

### Step 1: Check Static Web App Configuration
1. Go to Azure Portal → Your Static Web App (`black-field-07a75c203`)
2. Go to **Settings** → **Configuration** → **General settings**
3. Verify:
   - **API location**: Should be `api` or `/api`
   - **App location**: Should be `/`
   - **Output location**: Should be `dist`

### Step 2: Check Application Settings
1. Go to **Settings** → **Configuration** → **Application settings**
2. Verify these environment variables are set:
   - `COSMOSDB_ENDPOINT`: Your Cosmos DB endpoint URL
   - `COSMOSDB_KEY`: Your Cosmos DB primary key
   - `COSMOSDB_DATABASE`: `tetris-finance-fusion`
   - `COSMOSDB_CONTAINER`: `players`
3. Click **Save** if you made changes

### Step 3: Check Deployment Status
1. Go to **Deployment Center**
2. Check the latest deployment status
3. If deployment failed, check the logs
4. Trigger a new deployment if needed (push a commit or manually trigger)

### Step 4: Test API Directly
1. In Azure Portal, go to your Static Web App
2. Go to **Functions** (if available)
3. You should see `players` and `admin` functions listed
4. Test the `players` function directly

## Alternative: Manual API Verification

If the Functions still don't work, check:

1. **API Folder Structure** (should be):
   ```
   api/
   ├── dist/
   │   ├── index.js       # Entry point
   │   ├── players.js
   │   ├── admin.js
   │   └── cosmosClient.js
   ├── host.json
   ├── package.json
   └── node_modules/
   ```

2. **Test API Endpoint**:
   - Open: `https://black-field-07a75c203.6.azurestaticapps.net/api/players`
   - Should return `[]` (empty array) or player data, NOT 404

## Next Steps After Fix

1. **Commit and Push Changes**:
   ```bash
   git add .
   git commit -m "Fix API deployment for Static Web Apps"
   git push
   ```

2. **Wait for GitHub Actions**:
   - The workflow will automatically build and deploy
   - Check GitHub Actions tab for deployment status

3. **Verify in Browser**:
   - Play a game in your deployed app
   - Check browser console - should NOT see 404 errors
   - Check Admin Panel - statistics should load

## If Still Getting 404

1. **Check Function App (if separate)**:
   - If you have a separate Function App, verify it's running
   - Update frontend API URL to point to Function App URL

2. **Redeploy from Azure Portal**:
   - Go to Static Web App → **Deployment Center**
   - Click **Disconnect** then reconnect your GitHub repo
   - This will trigger a fresh deployment

3. **Check Logs**:
   - Go to Static Web App → **Functions** → **Logs**
   - Look for any errors or warnings

## Common Issues

- **404 Error**: Functions not deployed or API location misconfigured
- **500 Error**: Cosmos DB environment variables not set correctly
- **CORS Error**: Add frontend URL to CORS settings in Static Web App

