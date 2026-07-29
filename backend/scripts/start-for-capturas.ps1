# Levanta PostgreSQL + migraciones + API para capturas S4/S5
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Add-Content ".env" "`nJWT_SECRET=dev_jwt_secret_bryan`nJWT_REFRESH_SECRET=dev_jwt_refresh_bryan"
  Write-Host "Creado .env desde .env.example"
}

Write-Host "Iniciando PostgreSQL (Docker)..."
npm run db:up
Start-Sleep -Seconds 6

Write-Host "Migraciones..."
$env:NODE_ENV = "development"
npm run db:migrate

Write-Host ""
Write-Host "Listo. Ejecuta en OTRA terminal: npm run dev"
Write-Host "Swagger: http://localhost:3000/api-docs"
Write-Host "Guia: docs/levantar-backend-capturas-s4-s5.md"
