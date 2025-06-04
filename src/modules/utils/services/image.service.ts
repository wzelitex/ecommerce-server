import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ?? '',
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY') ?? '',
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET') ?? '',
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: 'business' | 'products' | 'payments',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No result from Cloudinary'));
          resolve(result);
        },
      );

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }
}
