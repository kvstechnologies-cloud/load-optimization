# Quick Azure Deployment Steps

## Node.js Version Required: 20.11.0

## Step-by-Step Instructions

### 1. Prepare Your Code

After downloading your code from Replit:

```bash
# Replace package.json with Azure-optimized version
cp azure-package.json package.json

# Ensure Node.js 20.x is specified
echo "20.11.0" > .nvmrc
```

### 2. Create Azure Resources

```bash
# Login to Azure
az login

# Create resource group
az group create --name truck-optimization-rg --location "East US"

# Create App Service plan
az appservice plan create \
  --name truck-optimization-plan \
  --resource-group truck-optimization-rg \
  --sku B1 \
  --is-linux

# Create web app with Node.js 20
az webapp create \
  --name truck-optimization-app \
  --resource-group truck-optimization-rg \
  --plan truck-optimization-plan \
  --runtime "NODE:20-lts"
```

### 3. Configure App Settings

```bash
# Set Node.js version and build settings
az webapp config appsettings set \
  --name truck-optimization-app \
  --resource-group truck-optimization-rg \
  --settings \
    WEBSITE_NODE_DEFAULT_VERSION=20.11.0 \
    NODE_ENV=production \
    PORT=8080 \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    WEBSITE_RUN_FROM_PACKAGE=1

# Set your database URL (replace with your actual URL)
az webapp config appsettings set \
  --name truck-optimization-app \
  --resource-group truck-optimization-rg \
  --settings DATABASE_URL="your-database-connection-string"
```

### 4. Deploy

```bash
# Create deployment package
npm install --production
npm run build
zip -r app.zip . -x "node_modules/*" ".git/*" "*.log"

# Deploy to Azure
az webapp deployment source config-zip \
  --name truck-optimization-app \
  --resource-group truck-optimization-rg \
  --src app.zip
```

### 5. Alternative: Direct Git Deployment

```bash
# Configure Git deployment
az webapp deployment source config \
  --name truck-optimization-app \
  --resource-group truck-optimization-rg \
  --repo-url https://github.com/kvstechnologies-cloud/load-optimization-v2.git \
  --branch main \
  --manual-integration
```

## Important Files for Azure

These files are specifically configured for Azure App Service:

- **azure-package.json** → Replace your package.json with this
- **.nvmrc** → Specifies Node.js 20.11.0
- **web.config** → IIS configuration for Windows App Service
- **.deployment** → Kudu deployment configuration
- **deploy.cmd** → Custom deployment script
- **server.js** → Azure-compatible startup file

## Troubleshooting Common Issues

### Issue: Application doesn't start
**Solution**: Check these settings in Azure Portal:
1. Go to Configuration → Application Settings
2. Verify: `WEBSITE_NODE_DEFAULT_VERSION = 20.11.0`
3. Verify: `PORT = 8080`
4. Verify: `NODE_ENV = production`

### Issue: Build fails during deployment
**Solution**: Enable build during deployment:
```bash
az webapp config appsettings set \
  --name truck-optimization-app \
  --resource-group truck-optimization-rg \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### Issue: Database connection fails
**Solution**: Set your database URL:
```bash
az webapp config appsettings set \
  --name truck-optimization-app \
  --resource-group truck-optimization-rg \
  --settings DATABASE_URL="postgresql://user:password@host:port/database"
```

## Testing Your Deployment

1. **Check App Status**:
   ```bash
   az webapp show \
     --name truck-optimization-app \
     --resource-group truck-optimization-rg \
     --query state
   ```

2. **View Logs**:
   ```bash
   az webapp log tail \
     --name truck-optimization-app \
     --resource-group truck-optimization-rg
   ```

3. **Test URL**: Visit `https://truck-optimization-app.azurewebsites.net`

## Cost Estimate

- **App Service Plan (B1)**: ~$13/month
- **Storage**: ~$2/month
- **Total**: ~$15/month for basic tier

Your app will be available at:
`https://[your-app-name].azurewebsites.net`