#!/bin/bash

echo "🚀 Setting up TakaTrack React Native Mobile App..."

# Install React Native CLI
npm install -g @react-native-community/cli

# Create React Native project
npx react-native@latest init TakaTrackMobile --template react-native-template-typescript

cd TakaTrackMobile

# Install dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios react-native-vector-icons
npm install @react-native-async-storage/async-storage

# iOS specific
cd ios && pod install && cd ..

echo "✅ React Native project created!"
echo "📱 Next steps:"
echo "1. cd TakaTrackMobile"
echo "2. npx react-native run-android (or run-ios)"