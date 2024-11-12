import { Storage } from '@google-cloud/storage';
import multer from 'multer';
const storage = new Storage({
  projectId: 'nimbus-441508',
  keyFilename: './src/config/serviceAccount.json', // Path to the service account file
});

const bucketName = 'nimbus-storage';
const bucket = storage.bucket(bucketName);
const upload = multer({ storage: multer.memoryStorage() });

export { bucket, upload };
