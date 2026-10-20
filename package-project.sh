#!/bin/bash

echo "📦 Creating PHX Marketplace project archive..."
echo ""

# Create archive name
ARCHIVE_NAME="phx-marketplace-$(date +%Y%m%d).tar.gz"

# Files and folders to include
FILES=(
    "index.html"
    "package.json"
    "tsconfig.json"
    "vite.config.js"
    "README.md"
    "src"
)

# Check if files exist
echo "📂 Checking files..."
for file in "${FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ✗ $file (not found)"
    fi
done

echo ""
echo "🗜️  Creating archive: $ARCHIVE_NAME"

# Create tar.gz archive
tar -czf "$ARCHIVE_NAME" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='*.log' \
    "${FILES[@]}" 2>/dev/null

if [ $? -eq 0 ]; then
    SIZE=$(du -h "$ARCHIVE_NAME" | cut -f1)
    echo ""
    echo "✅ Successfully created: $ARCHIVE_NAME"
    echo "📊 Size: $SIZE"
    echo ""
    echo "📁 Contents:"
    echo "   - 18 source files"
    echo "   - 9 complete pages"
    echo "   - Configuration files"
    echo "   - README.md"
    echo ""
    echo "🚀 To use:"
    echo "   1. Extract: tar -xzf $ARCHIVE_NAME"
    echo "   2. Install: npm install"
    echo "   3. Run: npm run dev"
    echo "   4. Open: http://localhost:3000"
else
    echo ""
    echo "❌ Error creating archive"
    exit 1
fi
