import { AWS_BUCKET_NAME , AWS_BUCKET_REGION ,AWS_ACCESS_KEY_ID , AWS_SECRET_ACCESS_KEY } from './config.js';
import { v4 as uuidv4 } from 'uuid';
import { S3Client  , PutObjectCommand , ListObjectsCommand , GetObjectCommand } from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import fs from 'fs'

const s3 = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export const uploadFile = async (file) => {
  // const stream = fs.createReadStream(file.tempFilePath);
  const Body = file.data
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Body,
    Key: `${uuidv4()}-${file.name}`,
    ContentType: file.mimetype
  }

  const command = new PutObjectCommand(uploadParams)
  const result = await s3.send(command);
  console.log(result)
}

export const getFiles = async () => {
  const command = new ListObjectsCommand({ Bucket: AWS_BUCKET_NAME })
  const result = await s3.send(command)
  return result.Contents
}

export const getFile = async (fileName) => {
  const command = new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: fileName})
  return await s3.send(command)
}

export const getFileUrl = async (fileName) => {
  const command = new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: fileName})
  return getSignedUrl(s3, command, { expiresIn: 3600 })
}

export const downloadFile = async (fileName) => {
  const command = new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: fileName})
  const { Body } = await s3.send(command)
  return Body.pipe(fs.createWriteStream(`./tmp/${fileName}`))
}
