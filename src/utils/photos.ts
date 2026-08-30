import * as ImagePicker from 'expo-image-picker';
import { File, Directory, Paths } from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
}

export async function captureAndSavePhoto(): Promise<{
  uri: string;
  base64: string;
  mimeType: string;
} | null> {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    throw new Error('Camera permission is required to take photos.');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    base64: true,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  const mimeType = asset.mimeType ?? 'image/jpeg';
  const extension = mimeType.includes('png') ? 'png' : 'jpg';

  const photosDir = new Directory(Paths.document, 'photos');
  if (!photosDir.exists) {
    photosDir.create({ intermediates: true });
  }

  const filename = `${uuidv4()}.${extension}`;
  const destFile = new File(photosDir, filename);

  if (asset.uri) {
    const sourceFile = new File(asset.uri);
    await sourceFile.copy(destFile);
  }

  return {
    uri: destFile.uri,
    base64: asset.base64 ?? '',
    mimeType,
  };
}
