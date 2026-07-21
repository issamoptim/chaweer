export interface PhotoStorageService {
  upload(file: Buffer, originalname: string, mimeType: string): Promise<string>;
  delete(photoUrl: string): Promise<void>;
}
