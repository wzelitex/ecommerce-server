import { Injectable, BadRequestException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ImageServiceInterface } from '../interfaces/services/utils.interface';

@Injectable()
export class ImageService implements ImageServiceInterface {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: 'C:/Company/Credenciales_google_cloud/',
    });
    this.bucketName = 'ecommerce-storages';
  }

  async uploadFile(body: Express.Multer.File): Promise<string> {
    const { buffer, originalname, mimetype } = body;

    const fileName = `${Date.now()}-${originalname}`;
    const bucket = this.storage.bucket(this.bucketName);

    try {
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: true,
        metadata: {
          contentType: mimetype,
        },
      });

      blobStream.end(buffer);

      await new Promise((resolve, reject) => {
        blobStream.on('finish', resolve);
        blobStream.on('error', reject);
      });

      await blob.makePrivate();
      return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    } catch {
      throw new BadRequestException(`Error al subir el archivo:`);
    }
  }
}
