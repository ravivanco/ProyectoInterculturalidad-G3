declare module 'expo-image-picker' {
  export type ImagePickerResult = {
    canceled: boolean;
    assets?: Array<{ uri: string }>;
  };

  export type MediaTypeOptionsValue = 'Images';

  export const MediaTypeOptions: {
    Images: MediaTypeOptionsValue;
  };

  export function requestCameraPermissionsAsync(): Promise<{ granted: boolean }>;
  export function launchCameraAsync(options?: { mediaTypes?: MediaTypeOptionsValue; quality?: number }): Promise<ImagePickerResult>;
  export function launchImageLibraryAsync(options?: { mediaTypes?: MediaTypeOptionsValue; quality?: number }): Promise<ImagePickerResult>;
}
