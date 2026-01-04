# Diagnose and Fix API Issues (Leaderboard + Cosmos DB Empty)

## Problem Summary
- **Leaderboard not loading**: Shows "Failed to load leaderboard" error
- **Cosmos DB is empty**: No player scores are being saved
- **Root cause**: API endpoints return 404 (Functions not deployed/recognized)

## Quick Diagnostic Steps

### Step 1: Test API Endpoint Directly
Open in browser:
```
https://black-field-07a75c203.6.azurestaticapps.net/api/players
```

**Expected**: Returns `[]` (empty array) or player data  
**Actual**: Returns 404 Not Found

### Step 2: Check Azure Portal - Static Web App

1. **Go to Azure Portal** → Your Static Web App (`black-field-07a75c203`)

2. **Check Functions**:
   - Go to **Functions** (in left menu)
   - You should see `players` and `admin` functions listed
   - If they're missing → Functions aren't deployed

3. **Check Configuration**:
   - Go to **Settings** → **Configuration** → **General settings**
   - Verify:
     - **API location**: `api` or `/api`
     - **App location**: `/`
     - **Output location**: `dist`

4. **Check Application Settings**:
   - Go to **Settings** → **Configuration** → **Application settings**
   - Verify these are set:
     - `COSMOSDB_ENDPOINT`
     - `COSMOSDB_KEY`
     - `COSMOSDB_DATABASE`: `tetris-finance-fusion`
     - `COSMOSDB_CONTAINER`: `players`
   - If missing → Add them and click **Save**

### Step 3: Check Deployment Status

1. **Go to Deployment Center**:
   - Check latest deployment status
   - Look for any errors in deployment logs
   - If deployment failed → Check GitHub Actions

2. **Check GitHub Actions**:
   - Go to your GitHub repo → **Actions** tab
   - Check latest workflow run
   - Look for errors in "Build API Functions" step

## Solutions

### Solution 1: Verify API Functions Are Deployed

The Functions should be in this structure:
```
api/
├── dist/
│   ├── index.js       # Entry point (imports players & admin)
│   ├── players.js      # Players function
│   ├── admin.js        # Admin function
│   └── cosmosClient.js # Cosmos DB client
├── host.json
├── package.json
└── node_modules/       # Dependencies
```

**If missing**: The GitHub Actions workflow needs to build the API.

### Solution 2: Fix GitHub Actions Workflow

The workflow file `.github/workflows/azure-static-web-apps-black-field-07a75c203.yml` should:
1. Build the API Functions (`cd api && npm install && npm run build`)
2. Build the frontend (`npm install && npm run build`)
3. Deploy both to Static Web Apps

**Verify the workflow is correct** (we already updated it).

### Solution 3: Manually Trigger Deployment

1. **Push a commit** to trigger GitHub Actions:
   ```bash
   git add .
   git commit -m "Trigger deployment to fix API"
   git push
   ```

2. **Or manually trigger in Azure Portal**:
   - Go to Static Web App → **Deployment Center**
   - Click **Sync** or **Redeploy**

### Solution 4: Check Cosmos DB Connection

Even if Functions are deployed, they need Cosmos DB credentials:

1. **In Azure Portal** → Static Web App → **Configuration** → **Application settings**
2. **Add/Verify**:
   ```
   COSMOSDB_ENDPOINT = https://<your-cosmos-account>.documents.azure.com:443/
   COSMOSDB_KEY = <your-primary-key>
   COSMOSDB_DATABASE = tetris-finance-fusion
   COSMOSDB_CONTAINER = players
   ```
3. **Click Save** (this restarts the Functions)

### Solution 5: Verify Cosmos DB Exists

1. **Go to Azure Portal** → Cosmos DB accounts
2. **Find your Cosmos DB account**
3. **Check**:
   - Database `tetris-finance-fusion` exists
   - Container `players` exists
   - Container has partition key `/id`

**If missing**: Create them using Azure CLI or Portal.

## Testing After Fix

1. **Test API endpoint**:
   ```
   https://black-field-07a75c203.6.azurestaticapps.net/api/players
   ```
   Should return `[]` (not 404)

2. **Test Admin endpoint**:
   ```
   https://black-field-07a75c203.6.azurestaticapps.net/api/admin?action=stats
   ```
   Should return statistics JSON

3. **Play a game**:
   - Register a player
   - Play Tetris
   - Game should save score (no console errors)

4. **Check leaderboard**:
   - Should load and show your score
   - No "Failed to load leaderboard" error

5. **Check Cosmos DB**:
   - Go to Cosmos DB → Data Explorer
   - Query: `SELECT * FROM c`
   - Should see your player record

## Common Issues

### Issue: Functions show 404
**Cause**: Functions not deployed or API location misconfigured  
**Fix**: Check deployment status, verify API location in Static Web App settings

### Issue: Functions return 500
**Cause**: Cosmos DB environment variables not set  
**Fix**: Add COSMOSDB_* variables in Application settings

### Issue: Leaderboard loads but empty
**Cause**: Functions work but no data saved yet  
**Fix**: Play a game to create data, then refresh leaderboard

### Issue: Can't save scores
**Cause**: API endpoint returns 404 or 500  
**Fix**: Check browser console for errors, verify API is working

## Next Steps

1. **Commit and push** the workflow changes we made
2. **Wait for GitHub Actions** to deploy
3. **Verify in Azure Portal** that Functions are listed
4. **Test the API endpoints** directly in browser
5. **Play a game** and verify scores are saved
6. **Check Cosmos DB** to confirm data is being written

