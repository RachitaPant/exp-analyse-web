# PowerShell test script for Windows

$BASE_URL = "http://localhost:8080"

Write-Host "🧪 Testing Web Performance Backend API`n" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/api/health" -Method GET -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) {
    Write-Host "✅ Health check passed" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n"
} else {
    Write-Host "❌ Health check failed" -ForegroundColor Red
    exit 1
}

# Test 2: Invalid URL
Write-Host "2. Testing Invalid URL (should fail)..." -ForegroundColor Yellow
$body = @{url = "invalid-url"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "$BASE_URL/api/analyze" -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -ErrorAction SilentlyContinue
if ($response.Content -match "error") {
    Write-Host "✅ Invalid URL handling passed" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n"
} else {
    Write-Host "❌ Invalid URL handling failed" -ForegroundColor Red
    Write-Host "Response: $($response.Content)`n"
}

# Test 3: Valid URL Analysis
Write-Host "3. Testing Valid URL Analysis (this will take 10-30 seconds)..." -ForegroundColor Yellow
Write-Host "Analyzing https://example.com..."
$body = @{url = "https://example.com"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "$BASE_URL/api/analyze" -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -TimeoutSec 90 `
    -ErrorAction SilentlyContinue

if ($response.Content -match "lighthouseData") {
    Write-Host "✅ URL analysis passed" -ForegroundColor Green
    Write-Host "Response includes Lighthouse data"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
} else {
    Write-Host "❌ URL analysis failed" -ForegroundColor Red
    Write-Host "Response: $($response.Content)`n"
}

Write-Host "`n🎉 All tests completed!" -ForegroundColor Green
