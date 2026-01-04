# Fixing 404 Error for API Endpoints

## Problem
Getting `404 (Not Found)` when calling `/api/players` on your deployed Static Web App.

## Root Cause
The Azure Functions API needs to be properly configured in your Static Web App deployment.

## Solution Steps

### Option 1: Fix via Azure Portal (Quick Fix)

1. **Go to Azure Portal** → Your Static Web App (`black-field-07a75c203`)

2. **Check API Configuration**:
   - Go to **Settings** → **Configuration** → **Application settings**
   - Verify these environment variables are set:
     - `COSMOSDB_ENDPOINT`: Your Cosmos DB endpoint URL
     - `COSMOSDB_KEY`: Your Cosmos DB primary key
     - `COSMOSDB_DATABASE`: `tetris-finance-fusion`
     - `COSMOSDB_CONTAINER`: `players`
   - Click **Save** if you made changes

3. **Verify API Location**:
   - Go to **Settings** → **Configuration** → **General settings**
   - Check that **API location** is set to `/api` (or `api`)
   - If not set, you may need to redeploy with the correct API location

4. **Redeploy the API**:
   - Go to **Deployment Center**
   - Trigger a new deployment (or push a commit to trigger GitHub Actions)

### Option 2: Fix via Azure CLI

```bash
# Update Static Web App configuration
az staticwebapp appsettings set \
  --name black-field-07a75c203 \
  --resource-group <your-resource-group> \
  --setting-names \
    COSMOSDB_ENDPOINT="<your-endpoint>" \
    COSMOSDB_KEY="<your-key>" \
    COSMOSDB_DATABASE="tetris-finance-fusion" \
    COSMOSDB_CONTAINER="players"
```

### Option 3: Verify Deployment Structure

The API functions should be deployed with this structure:
```
api/
├── dist/
│   ├── index.js          # Entry point (imports all functions)
│   ├── players.js
│   ├── admin.js
│   └── cosmosClient.js
├── host.json
├── package.json
└── node_modules/        # Dependencies
```

### Option 4: Manual API Deployment (If GitHub Actions isn't working)

1. **Build the API locally**:
   ```bash
   cd api
   npm install
   npm run build
   ```

2. **Zip the API folder** (include `dist/`, `host.json`, `package.json`, `node_modules/`)

3. **Deploy via Azure Portal**:
   - Go to Static Web App → **Deployment Center**
   - Use **Local Git** or **Zip Deploy** method
   - Upload the zip file

## Verification

After fixing, test the API:
1. Go to: `https://black-field-07a75c203.6.azurestaticapps.net/api/players`
2. Should return `[]` (empty array) or player data, not 404

## Common Issues

- **404 Error**: API functions not deployed or API location misconfigured
- **500 Error**: Cosmos DB environment variables not set
- **CORS Error**: Add your frontend URL to CORS settings in Static Web App

