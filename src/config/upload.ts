import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsFolder = path.resolve(tmpFolder, 'uploads')

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: multer.StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  }
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tmpFolder,
  uploadsFolder,

  multer: {
    storage: multer.diskStorage({
      destination: uploadsFolder,
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const filename = `${fileHash}-${file.originalname}`;
  
        return callback(null,filename);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: process.env.AWS_BUCKET,
    },
  },
} as IUploadConfig;