// src/types/global.d.ts
declare global {
  interface Device {
    deviceId: string;
    status: number;
    latitude: string;
    longitude: string;
    validData: number;
  }

  // Any additional global types can be declared here
}

// This ensures the file is treated as a module
export { }

