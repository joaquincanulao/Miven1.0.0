import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'miven1.1',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export interface PluginsConfig {
  [CAPACITOR_ANDROID_STUDIO_PATH: string]: | {
        [CAPACITOR_ANDROID_STUDIO_PATH: string]: '/opt/android-studio/bin/studio.sh'; // Ruta en Linux
      }
    | undefined;
}

export default config;
