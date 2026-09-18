#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080"

echo -e "${YELLOW}🧪 Testing Web Performance Backend API${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
response=$(curl -s -X GET "$BASE_URL/api/health")
if echo "$response" | grep -q "ok"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $response\n"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "Response: $response\n"
    exit 1
fi

# Test 2: Invalid URL
echo -e "${YELLOW}2. Testing Invalid URL (should fail)...${NC}"
response=$(curl -s -X POST "$BASE_URL/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"url":"invalid-url"}')
if echo "$response" | grep -q "error"; then
    echo -e "${GREEN}✅ Invalid URL handling passed${NC}"
    echo "Response: $response\n"
else
    echo -e "${RED}❌ Invalid URL handling failed${NC}"
    echo "Response: $response\n"
fi

# Test 3: Valid URL Analysis
echo -e "${YELLOW}3. Testing Valid URL Analysis (this will take 10-30 seconds)...${NC}"
echo "Analyzing https://example.com..."
response=$(curl -s -X POST "$BASE_URL/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' --max-time 60)

if echo "$response" | grep -q "lighthouseData"; then
    echo -e "${GREEN}✅ URL analysis passed${NC}"
    echo "Response includes Lighthouse data"
    # Pretty print if jq is available
    if command -v jq &> /dev/null; then
        echo "$response" | jq '.' || echo "$response"
    else
        echo "$response"
    fi
else
    echo -e "${RED}❌ URL analysis failed${NC}"
    echo "Response: $response\n"
fi

echo -e "\n${GREEN}🎉 All tests completed!${NC}"
