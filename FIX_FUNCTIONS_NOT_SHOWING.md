# Fix: Functions Not Showing in Static Web App

## Problem
- No "Functions" menu item in Azure Portal Static Web App
- API endpoints return 404
- Leaderboard doesn't load
- Cosmos DB stays empty

## Root Cause
Azure Static Web Apps isn't recognizing your Functions. This can happen because:
1. Functions aren't being deployed correctly
2. Functions are in wrong location/structure
3. Static Web Apps doesn't support Functions v4 programming model in integrated mode

## Solution Options

### Option 1: Use Separate Azure Function App (Recommended)

Instead of integrated Functions, deploy Functions to a separate Function App:

1. **Create Function App**:
   ```bash
   az functionapp create \
     --name tetris-finance-fusion-api \
     --resource-group <your-resource-group> \
     --consumption-plan-location "West Europe" \
     --runtime "node" \
     --runtime-version "18" \
     --functions-version "4"
   ```

2. **Deploy Functions**:
   ```bash
   cd api
   npm install
   npm run build
   func azure functionapp publish tetris-finance-fusion-api
   ```

3. **Update Frontend API URL**:
   Edit `src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 
     typeof window !== 'undefined' && window.location.hostname.endsWith('.azurestaticapps.net')
       ? 'https://tetris-finance-fusion-api.azurewebsites.net/api'
       : 'http://localhost:7071/api';
   ```

4. **Set Cosmos DB Environment Variables**:
   - Go to Function App → Configuration → Application settings
   - Add: `COSMOSDB_ENDPOINT`, `COSMOSDB_KEY`, `COSMOSDB_DATABASE`, `COSMOSDB_CONTAINER`

### Option 2: Fix Integrated Functions (Current Approach)

If you want to keep integrated Functions, try these fixes:

#### Fix A: Verify API Structure

The `api` folder should have:
```
api/
├── dist/
│   ├── index.js
│   ├── players.js
│   ├── admin.js
│   └── cosmosClient.js
├── host.json
├── package.json
└── node_modules/
```

#### Fix B: Check Static Web App Configuration

In Azure Portal → Static Web App → Configuration → General settings:
- **API location**: Should be `api` (not `api/dist`)
- **App location**: `/`
- **Output location**: `dist`

#### Fix C: Redeploy with Correct Structure

1. **Commit and push** the workflow changes
2. **Wait for GitHub Actions** to complete
3. **Check deployment logs** for errors
4. **Verify Functions appear** in Azure Portal

#### Fix D: Manual Deployment Test

1. **Build API locally**:
   ```bash
   cd api
   npm install
   npm run build
   ```

2. **Zip the api folder** (include dist/, host.json, package.json, node_modules/)

3. **Deploy via Azure Portal**:
   - Static Web App → Deployment Center
   - Use "Local Git" or "Zip Deploy"
   - Upload the zip

### Option 3: Check GitHub Actions Deployment

1. **Go to GitHub** → Your repo → **Actions** tab
2. **Check latest workflow run**:
   - Look for "Build API Functions" step
   - Check if it completed successfully
   - Look for any errors

3. **If workflow failed**:
   - Check error messages
   - Verify Node.js version matches
   - Check if dependencies installed correctly

## Verification Steps

After applying a solution:

1. **Check Azure Portal**:
   - Static Web App → **Functions** menu should appear
   - Should see `players` and `admin` functions

2. **Test API Endpoint**:
   ```
   https://black-field-07a75c203.6.azurestaticapps.net/api/players
   ```
   Should return `[]` (not 404)

3. **Test in Browser Console**:
   - Open your deployed app
   - Play a game
   - Check console - should NOT see 404 errors

4. **Check Cosmos DB**:
   - After playing a game, check Cosmos DB Data Explorer
   - Should see player records

## Recommended Next Steps

1. **Try Option 1 (Separate Function App)** - Most reliable
2. **If keeping integrated**: Check GitHub Actions logs for deployment errors
3. **Verify Cosmos DB settings** are configured in Application settings
4. **Test after each change** to see what works

## Why This Happens

Azure Static Web Apps has limitations with Functions v4 programming model:
- Integrated Functions work best with Functions v1/v2 model
- Functions v4 might need separate Function App
- Deployment structure must match exactly what Static Web Apps expects

## Need Help?

If Functions still don't appear:
1. Check GitHub Actions deployment logs
2. Verify API folder structure matches requirements
3. Consider using separate Function App (Option 1)
4. Check Azure Portal → Static Web App → Deployment Center for errors

