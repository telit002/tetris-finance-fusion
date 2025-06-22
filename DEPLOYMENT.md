# Azure Deployment Guide for Tetris Finance Fusion

This guide will help you deploy the Tetris Finance Fusion application to Azure with a complete backend solution using Azure Static Web Apps, Azure Functions, and Cosmos DB.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **Azure CLI**: Install from [https://docs.microsoft.com/en-us/cli/azure/install-azure-cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
3. **Node.js**: Version 16 or higher
4. **Azure Functions Core Tools**: Install with `npm install -g azure-functions-core-tools@4`

## Step 1: Azure Setup

### 1.1 Login to Azure
```bash
az login
```

### 1.2 Create Resource Group
```bash
az group create --name tetris-finance-fusion-rg --location "West Europe"
```

### 1.3 Create Cosmos DB Account
```bash
az cosmosdb create \
  --name tetris-finance-fusion-db \
  --resource-group tetris-finance-fusion-rg \
  --kind GlobalDocumentDB \
  --capabilities EnableServerless
```

### 1.4 Create Cosmos DB Database and Container
```bash
# Create database
az cosmosdb sql database create \
  --account-name tetris-finance-fusion-db \
  --resource-group tetris-finance-fusion-rg \
  --name tetris-finance-fusion

# Create container
az cosmosdb sql container create \
  --account-name tetris-finance-fusion-db \
  --resource-group tetris-finance-fusion-rg \
  --database-name tetris-finance-fusion \
  --name players \
  --partition-key-path "/id"
```

### 1.5 Get Cosmos DB Connection Details
```bash
# Get endpoint
az cosmosdb show \
  --name tetris-finance-fusion-db \
  --resource-group tetris-finance-fusion-rg \
  --query documentEndpoint

# Get primary key
az cosmosdb keys list \
  --name tetris-finance-fusion-db \
  --resource-group tetris-finance-fusion-rg \
  --type keys \
  --query primaryMasterKey
```

## Step 2: Configure Azure Functions

### 2.1 Update API Configuration
Edit `api/local.settings.json` and replace the placeholder values:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOSDB_ENDPOINT": "https://tetris-finance-fusion-db.documents.azure.com:443/",
    "COSMOSDB_KEY": "your-cosmosdb-primary-key-here",
    "COSMOSDB_DATABASE": "tetris-finance-fusion",
    "COSMOSDB_CONTAINER": "players"
  }
}
```

### 2.2 Test Azure Functions Locally
```bash
cd api
npm install
npm run start
```

The API will be available at `http://localhost:7071/api/`

## Step 3: Deploy to Azure Static Web Apps

### 3.1 Create Static Web App
```bash
az staticwebapp create \
  --name tetris-finance-fusion-app \
  --resource-group tetris-finance-fusion-rg \
  --source . \
  --location "West Europe" \
  --branch main \
  --app-location "/" \
  --api-location "/api" \
  --output-location "dist"
```

### 3.2 Configure Environment Variables
In the Azure Portal:
1. Go to your Static Web App
2. Navigate to Configuration → Application settings
3. Add the following environment variables:
   - `COSMOSDB_ENDPOINT`: Your Cosmos DB endpoint
   - `COSMOSDB_KEY`: Your Cosmos DB primary key
   - `COSMOSDB_DATABASE`: `tetris-finance-fusion`
   - `COSMOSDB_CONTAINER`: `players`

### 3.3 Update Frontend API URL
Edit `src/services/api.ts` and update the production URL:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tetris-finance-fusion-app.azurestaticapps.net/api'
  : 'http://localhost:7071/api';
```

## Step 4: Build and Deploy

### 4.1 Build the Application
```bash
npm run build
```

### 4.2 Deploy to Azure
```bash
# Deploy the frontend
az staticwebapp create \
  --name tetris-finance-fusion-app \
  --resource-group tetris-finance-fusion-rg \
  --source . \
  --location "West Europe" \
  --branch main \
  --app-location "/" \
  --api-location "/api" \
  --output-location "dist"

# Or use GitHub Actions (recommended)
# Push your code to GitHub and Azure will automatically deploy
```

## Step 5: Configure CORS and Authentication (Optional)

### 5.1 Configure CORS
In your Azure Static Web App, go to Configuration → CORS and add:
- Allowed origins: `*` (for development) or your specific domain
- Allowed methods: `GET, POST, PUT, DELETE`
- Allowed headers: `Content-Type, Authorization`

### 5.2 Add Authentication (Optional)
```bash
# Add Azure AD authentication
az staticwebapp identity assign \
  --name tetris-finance-fusion-app \
  --resource-group tetris-finance-fusion-rg
```

## Step 6: Monitoring and Analytics

### 6.1 Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app tetris-finance-fusion-insights \
  --location "West Europe" \
  --resource-group tetris-finance-fusion-rg \
  --application-type web
```

### 6.2 Log Analytics
```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
  --resource-group tetris-finance-fusion-rg \
  --workspace-name tetris-finance-fusion-logs
```

## Step 7: Security Best Practices

### 7.1 Network Security
- Configure Azure Firewall rules
- Use Private Endpoints for Cosmos DB
- Enable Azure DDoS Protection

### 7.2 Data Security
- Enable Cosmos DB encryption at rest
- Use Managed Identity for authentication
- Implement proper access controls

### 7.3 Application Security
- Validate all inputs
- Implement rate limiting
- Use HTTPS only
- Regular security updates

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured in Azure Static Web Apps
2. **Cosmos DB Connection**: Verify connection string and keys
3. **Function Deployment**: Check Azure Functions logs in the portal
4. **Build Errors**: Ensure all dependencies are installed

### Useful Commands

```bash
# Check deployment status
az staticwebapp show --name tetris-finance-fusion-app --resource-group tetris-finance-fusion-rg

# View function logs
az functionapp logs tail --name tetris-finance-fusion-app --resource-group tetris-finance-fusion-rg

# Test API endpoints
curl https://tetris-finance-fusion-app.azurestaticapps.net/api/players
```

## Cost Optimization

### 7.1 Cosmos DB
- Use Serverless mode for development
- Configure autoscale for production
- Monitor RU consumption

### 7.2 Static Web Apps
- Use the free tier for development
- Scale based on traffic patterns
- Monitor bandwidth usage

## Next Steps

1. **Custom Domain**: Configure a custom domain for your application
2. **CDN**: Enable Azure CDN for better performance
3. **Backup**: Set up automated backups for Cosmos DB
4. **Monitoring**: Configure alerts and monitoring
5. **CI/CD**: Set up GitHub Actions for automated deployment

## Support

For issues and questions:
- Azure Documentation: [https://docs.microsoft.com/azure/](https://docs.microsoft.com/azure/)
- Azure Support: [https://azure.microsoft.com/support/](https://azure.microsoft.com/support/)
- GitHub Issues: Create an issue in the project repository 