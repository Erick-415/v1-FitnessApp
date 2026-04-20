import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'EazyFitness',
  slug: 'eazyfitness-client',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.eazyfitness.client',
    usesAppleSignIn: true,
    infoPlist: {
      NSHealthShareUsageDescription: 'EazyFitness reads your health data to track workouts.',
      NSHealthUpdateUsageDescription: 'EazyFitness writes workout data to Apple Health.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.eazyfitness.client',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-apple-authentication',
      {
        enabled: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'YOUR_EAS_PROJECT_ID',
    },
  },
};

export default config;
