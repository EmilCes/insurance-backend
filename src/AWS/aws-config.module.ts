// aws-config.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [
    MulterModule.register({
      storage: multerS3({
        s3: new S3Client({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
          region: process.env.AWS_REGION,
        }),
        bucket: process.env.AWS_S3_BUCKET_NAME,
        key: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalName = file.originalname.replace(/\s+/g, '_');
          cb(null, `reports/${uniqueSuffix}-${originalName}`);
        },
      }),
    }),
  ],
  exports: [MulterModule],
})
export class AwsConfigModule {}