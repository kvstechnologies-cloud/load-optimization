# Manual Azure Deployment Guide

## Step 1: Download and Prepare Your Code

### Download from Replit
1. In Replit, click the three dots menu (⋯) next to your project name
2. Select "Download as ZIP"
3. Extract the ZIP file to a folder on your computer

### Prepare for Azure
1. **Replace package.json** with the Azure-optimized version:
   ```bash
   # In your extracted folder
   copy azure-package.json package.json
   # OR on Mac/Linux:
   cp azure-package.json package.json
   ```

2. **Verify these files exist** (they should be included in your download):
   - `.nvmrc` (contains "20.11.0")
   - `web.config` (IIS configuration)
   - `server.js` (Azure startup file)
   - All your application code

## Step 2: Create Azure App Service (Web Portal Method)

### Using Azure Portal (Easiest)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Create a Web App**:
   - Click "Create a resource"
   - Search for "Web App" and click "Create"
   
3. **Fill in the details**:
   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new called "truck-optimization-rg"
   - **Name**: "truck-optimization-app" (must be globally unique)
   - **Publish**: Code
   - **Runtime stack**: Node 20 LTS
   - **Operating System**: Linux
   - **Region**: East US (or your preferred region)
   - **Pricing Plan**: B1 Basic ($13/month)

4. **Click "Review + Create"** then **"Create"**

## Step 3: Configure App Settings

1. **Go to your App Service** in Azure Portal
2. **Click "Configuration"** in the left menu
3. **Add these Application Settings**:

   Click "New application setting" for each:
   
   | Name | Value |
   |------|-------|
   | `WEBSITE_NODE_DEFAULT_VERSION` | `20.11.0` |
   | `NODE_ENV` | `production` |
   | `PORT` | `8080` |
   | `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
   | `WEBSITE_RUN_FROM_PACKAGE` | `1` |
   | `DATABASE_URL` | `your-database-connection-string` |

4. **Click "Save"** at the top

## Step 4: Deploy Your Code

### Method A: ZIP Upload (Recommended)

1. **Create deployment package**:
   ```bash
   # In your project folder
   # Remove node_modules if it exists
   rm -rf node_modules
   
   # Create ZIP file (exclude unnecessary files)
   # Windows: Use WinRAR/7-Zip to create zip
   # Mac/Linux:
   zip -r truck-optimization.zip . -x "node_modules/*" ".git/*" "*.log" ".DS_Store"
   ```

2. **Deploy via Azure Portal**:
   - Go to your App Service
   - Click "Advanced Tools" → "Go"
   - In Kudu console, click "Tools" → "ZIP Push Deploy"
   - Drag your ZIP file to upload
   - Wait for deployment to complete

### Method B: FTP Upload

1. **Get FTP credentials**:
   - In Azure Portal, go to your App Service
   - Click "Deployment Center"
   - Click "FTPS credentials" tab
   - Note the FTP endpoint and credentials

2. **Upload files**:
   - Use FileZilla or any FTP client
   - Connect using the FTPS credentials
   - Upload all your files to `/site/wwwroot/`

### Method C: GitHub Deployment

1. **Push to GitHub** (if you have the code there):
   - Go to your App Service
   - Click "Deployment Center"
   - Choose "GitHub"
   - Authorize and select your repository
   - Choose branch "main"
   - Click "Save"

## Step 5: Verify Deployment

1. **Check deployment status**:
   - Go to "Deployment Center" in Azure Portal
   - Check deployment logs

2. **Test your app**:
   - Your app URL: `https://truck-optimization-app.azurewebsites.net`
   - Test CSV upload functionality
   - Verify database connectivity

## Step 6: Troubleshooting

### If app doesn't start:

1. **Check logs**:
   - Go to "Log stream" in Azure Portal
   - Look for error messages

2. **Common fixes**:
   - Verify Node.js version is set to 20.11.0
   - Check that PORT is set to 8080
   - Ensure DATABASE_URL is correctly configured

### If build fails:

1. **Enable detailed logs**:
   - Go to "Configuration" → "General settings"
   - Set "Logging" to "File System"
   - Check logs in "Log stream"

2. **Manual build** (if needed):
   - Go to "Advanced Tools" → "Go" (Kudu)
   - Click "Debug console" → "CMD"
   - Navigate to `/site/wwwroot`
   - Run: `npm install --production`
   - Run: `npm run build`

## Required Files Checklist

Make sure these files are in your deployment:

- [ ] `package.json` (use the azure-package.json version)
- [ ] `.nvmrc` (contains "20.11.0")
- [ ] `web.config`
- [ ] `server.js`
- [ ] All source code files (`client/`, `server/`, `shared/`)
- [ ] Configuration files (`vite.config.ts`, `tailwind.config.ts`, etc.)

## Environment Variables Summary

These must be set in Azure App Service Configuration:

```
WEBSITE_NODE_DEFAULT_VERSION=20.11.0
NODE_ENV=production
PORT=8080
SCM_DO_BUILD_DURING_DEPLOYMENT=true
WEBSITE_RUN_FROM_PACKAGE=1
DATABASE_URL=postgresql://user:password@host:port/database
```

## Alternative: Azure CLI Method

If you prefer command line:

```bash
# Login
az login

# Create resource group
az group create --name truck-optimization-rg --location eastus

# Create app service plan
az appservice plan create --name truck-optimization-plan --resource-group truck-optimization-rg --sku B1 --is-linux

# Create web app
az webapp create --name truck-optimization-app --resource-group truck-optimization-rg --plan truck-optimization-plan --runtime "NODE:20-lts"

# Configure settings
az webapp config appsettings set --name truck-optimization-app --resource-group truck-optimization-rg --settings WEBSITE_NODE_DEFAULT_VERSION=20.11.0 NODE_ENV=production PORT=8080 SCM_DO_BUILD_DURING_DEPLOYMENT=true WEBSITE_RUN_FROM_PACKAGE=1

# Deploy from ZIP
az webapp deployment source config-zip --name truck-optimization-app --resource-group truck-optimization-rg --src truck-optimization.zip
```

## Cost Estimate

- **App Service (B1 Basic)**: ~$13/month
- **Outbound data transfer**: Usually minimal
- **Total**: ~$13-15/month

Your app will be available at:
`https://[your-app-name].azurewebsites.net`

## Support

If you encounter issues:
1. Check the deployment logs in Azure Portal
2. Review the error messages in Log stream
3. Verify all environment variables are set correctly
4. Ensure you're using the azure-package.json file