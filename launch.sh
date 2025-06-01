#!/bin/bash

# FUTUREOS Website Launch Script
# This script opens the website in your default browser

echo "🚀 Launching FUTUREOS ENTERPRISES Website..."
echo "📍 Location: $(pwd)/index.html"

# Check if index.html exists
if [ -f "index.html" ]; then
    echo "✅ Found index.html"
    
    # Open in default browser (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open index.html
        echo "🌐 Website opened in your default browser!"
    # Open in default browser (Linux)
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open index.html
        echo "🌐 Website opened in your default browser!"
    # Open in default browser (Windows/WSL)
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        start index.html
        echo "🌐 Website opened in your default browser!"
    else
        echo "💡 Please open index.html in your browser manually"
    fi
    
    echo ""
    echo "🎉 FUTUREOS Website is ready!"
    echo "📝 Key Features:"
    echo "   • Responsive design for all devices"
    echo "   • Interactive navigation and animations"
    echo "   • Call-to-action buttons for workshops"
    echo "   • Mobile-friendly hamburger menu"
    echo ""
    echo "📞 For support: hello@futureos.in"
else
    echo "❌ Error: index.html not found in current directory"
    echo "💡 Please navigate to the FutureOS project folder first"
fi