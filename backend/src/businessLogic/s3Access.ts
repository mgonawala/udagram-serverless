
const AWSXRay = require('aws-xray-sdk');
import * as AWS_ from 'aws-sdk';
const AWS = AWSXRay.captureAWS(AWS_);
import {S3Customizations} from "aws-sdk/lib/services/s3";
import {createLogger} from "../utils/logger";


const logger = createLogger('s3access')
class S3Access {

  constructor(
      private readonly s3: S3Customizations  = new AWS.S3(),
      private readonly bucket:string = process.env.IMAGES_BUCKET,
      private readonly expirationTime = parseInt(process.env.URL_EXPIRATION_TIME)
  ){}

  getSignedUrl(todoId: string , contentType: string) : string{
   const signedUrl =  this.s3.getSignedUrl('putObject',{
      Bucket: this.bucket,
      Key: `${todoId}.png`,
      Expires: this.expirationTime,
      ContentType: contentType
    });
   logger.info('Generated signed url for put operation', {url: signedUrl})
   return signedUrl;
  }


  getReadSignedUrl(todoId: string ) : string{
    const signedUrl =  this.s3.getSignedUrl('getObject',{
      Bucket: this.bucket,
      Key: `${todoId}.png`,
      Expires: this.expirationTime
    });
    logger.info('Generated signed url for get operation', {url: signedUrl})
    return signedUrl;
  }

}

export const s3Access = new S3Access();