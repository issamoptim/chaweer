import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { PhotoStorageService } from './photo-storage-service';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const PUBLIC_PATH = '/uploads';

export class LocalPhotoStorageService implements PhotoStorageService {
  constructor() {
    void this.ensureDir();
  }

  private async ensureDir(): Promise<void> {
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch {
      // directory may already exist
    }
  }

  async upload(file: Buffer, originalname: string, mimeType: string): Promise<string> {
    await this.ensureDir();

    const ext = path.extname(originalname) || this.extFromMime(mimeType);
    const filename = `${randomUUID()}${ext}`;
    const fullPath = path.join(UPLOAD_DIR, filename);

    await fs.writeFile(fullPath, file);

    return `${PUBLIC_PATH}/${filename}`;
  }

  async delete(photoUrl: string): Promise<void> {
    const filename = this.extractFilename(photoUrl);
    if (!filename) return;

    const fullPath = path.join(UPLOAD_DIR, filename);
    try {
      await fs.unlink(fullPath);
    } catch {
      // file may not exist
    }
  }

  private extractFilename(photoUrl: string): string | null {
    if (!photoUrl.startsWith(PUBLIC_PATH + '/')) return null;
    return photoUrl.slice(PUBLIC_PATH.length + 1);
  }

  private extFromMime(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };
    return map[mimeType] ?? '.bin';
  }
}

export const photoStorageService: PhotoStorageService = new LocalPhotoStorageService();
