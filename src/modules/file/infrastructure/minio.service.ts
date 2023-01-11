import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { Express } from 'express';

@Injectable()
export class MinioService {
  private minioClient: Client;
  private bucketName = 'integration';

  constructor() {
    this.minioClient = new Client({
      endPoint: '172.29.30.58',
      port: 9000,
      useSSL: false,
      accessKey: 'integration-5Msk1V3xfaWzHtBsMnlCQ',
      secretKey: 'LXvCIGdjUgvd6pLmbFEm9bmjqpHjThAAnPlSrzt3L8',
    });
  }

  async upload(file: Express.Multer.File, objectName: string) {
    return await this.minioClient.putObject(this.bucketName, objectName, file.buffer, file.size);
  }

  async download(fileName: string) {
    return await this.minioClient.getObject(this.bucketName, fileName);
  }

  async delete(objectName: string) {
    return await this.minioClient.removeObject(this.bucketName, objectName);
  }
}
