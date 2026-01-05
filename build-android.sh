#!/bin/bash

# Get the current working directory
PROJECT_DIR="$(pwd)"

# Run eas build and capture output
echo "Building APK..."
output=$(eas build -p android --local --profile production 2>&1)

# Extract the APK path from the output
apk_path=$(echo "$output" | grep -oE '/[^ ]+/build-[0-9]+\.apk' | head -1)

if [ -n "$apk_path" ]; then
    echo "Build successful!"
    echo "APK found at: $apk_path"
    
    # Rename the APK to super_app.apk
    mv "$apk_path" "${PROJECT_DIR}/super_app.apk"
    echo "Renamed APK to super_app.apk"
    
    # Open the folder
    open "$PROJECT_DIR"
    echo "Opened folder"
else
    echo "Failed to find APK path in build output"
    echo "Build output:"
    echo "$output"
    exit 1
fi
