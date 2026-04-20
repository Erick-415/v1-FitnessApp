import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'EazyFitness Trainer',
  slug: 'eazyfitness-trainer',
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
    supportsTablet: true,
    bundleIdentifier: 'com.eazyfitness.trainer',
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.eazyfitness.trainer',
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
