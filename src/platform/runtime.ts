import { Capacitor } from "@capacitor/core";

export const platformRuntime = {
  isNativeApp: Capacitor.isNativePlatform(),
  platform: Capacitor.getPlatform(),
};
