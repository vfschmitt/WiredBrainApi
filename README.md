# WiredBrain Coffee Inventory

This repository contains two parts:

1. ASP.NET Core (.NET 8) Web API exposing coffee bean inventory via `GET /Inventory/{id}`.
2. React + TypeScript client (Vite) located in `wiredbrain-client` that consumes the API.

Use it to look up inventory for cafe locations by numeric ID (sample IDs 1–4).

---

## API Endpoint
`GET /Inventory/{id}` returns JSON like:
```json
{
  "id": 1,
  "locationName": "Main Street",
  "kgDarkRoast": 5.8,
  "kgMediumRoast": 7.5,
  "kgLightRoast": 10.0,
  "kgSeasonalRoast": 0.0
}
```
Non‑existent IDs return 404. Swagger UI available at `/swagger`.

---

## Tech Stack
API:
- .NET 8 / ASP.NET Core
- In-memory data (no DB yet)
- Swagger / OpenAPI

Client:
- React 18
- TypeScript
- Vite dev server (port 5173)
- Vitest + Testing Library

---

## Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)

---

## Run Locally
Open two terminals at repo root.

Terminal 1 – API:
```powershell
dotnet run --project .\WiredBrainApi.Web\WiredBrainApi.Web.csproj
```
API: http://localhost:5154

Terminal 2 – Client:
```powershell
cd wiredbrain-client
npm install
npm run dev
```
Client: http://localhost:5173

The dev server proxies `/Inventory` requests to the API (see `vite.config.ts`).

---

## CORS
`Program.cs` defines a `ClientCors` policy allowing:
- http://localhost:5173
- http://127.0.0.1:5173

Update origins if you change ports or deploy elsewhere.

---

## Testing
API tests:
```powershell
dotnet test
```

Client tests:
```powershell
cd wiredbrain-client
npm test
```

---

## Production Builds
Client build:
```powershell
cd wiredbrain-client
npm run build
```
Outputs to `wiredbrain-client/dist`.

API publish:
```powershell
dotnet publish .\WiredBrainApi.Web\WiredBrainApi.Web.csproj -c Release -o publish
```

Future enhancement: copy `dist` into API `wwwroot` during CI for single deployment.

---

## Troubleshooting
| Issue | Fix |
|-------|-----|
| CORS error | Ensure API running & origins match dev host |
| 404 from /Inventory/{id} | Use IDs 1–4 (seeded) |
| Proxy not working | Use relative path `/Inventory/1`; confirm Vite dev server running |
| Module not found (client) | Run `npm install` in `wiredbrain-client` |

---

## Roadmap Ideas
- List endpoint `/Inventory` (all locations)
- Update endpoints (POST/PUT)
- Persist data in a database
- Authentication (JWT) once writes exist
- CI integrating client build into API publish

---

## One-Command Dev Startup
You can start both API and client with the helper script:

```powershell
./run-dev.ps1
```

Options:
```powershell
./run-dev.ps1 -InstallClient   # Force npm install before starting
./run-dev.ps1 -NoBrowser       # Do not auto-open the browser
./run-dev.ps1 -ApiPort 5154 -ClientPort 5173
```

Press ENTER in the script window to stop both processes.

---

## Deploying to Azure

### Option 1: Azure App Service (Single Combined Deployment)
The repository includes a workflow: `.github/workflows/azure-webapp.yml` that:
1. Restores .NET + Node dependencies
2. Runs `dotnet publish` (which builds the React client via the custom MSBuild target and copies output to `wwwroot`)
3. Deploys the published folder to an Azure Web App

Configure required secrets:
| Secret | Purpose |
|--------|---------|
| `AZURE_WEBAPP_NAME` | Name of the target App Service (Web App) |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Publish profile XML content (from Azure Portal: Get publish profile) |

Set them in GitHub: Repo Settings > Secrets and variables > Actions > New repository secret.

On first deploy make sure:
- App Service runtime stack is set to .NET 8
- Platform (Windows or Linux) matches your expectation

After deployment the React SPA is served from the API `wwwroot` and API endpoints share the same domain (e.g., `https://yourapp.azurewebsites.net/Inventory/1`).

### Option 2: Azure Static Web Apps + Separate API
If you later split concerns:
1. Deploy React build (`wiredbrain-client/dist`) to Azure Static Web Apps.
2. Host API in Azure App Service (or Azure Container Apps).
3. Configure CORS on the API for the Static Web App domain and set `VITE_API_BASE_URL` (environment variable injected at build time) for client fetches.

### Environment Variables (Future)
Add dynamic API base URL by introducing `import.meta.env.VITE_API_BASE_URL` in the client service. For now relative paths work because the SPA and API are co-hosted.

---

## License
Sample educational project. Add a formal license for distribution.


