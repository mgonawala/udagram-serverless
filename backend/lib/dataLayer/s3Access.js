import * as AWS from 'aws-sdk';
import { createLogger } from "../utils/logger";
const logger = createLogger('s3access');
export class S3Access {
    constructor(s3 = new AWS.S3(), bucket = process.env.IMAGES_BUCKET, expirationTime = parseInt(process.env.URL_EXPIRATION_TIME)) {
        this.s3 = s3;
        this.bucket = bucket;
        this.expirationTime = expirationTime;
    }
    getSignedUrl(todoId, contentType) {
        const signedUrl = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucket,
            Key: `${todoId}.png`,
            Expires: this.expirationTime,
            ContentType: contentType
        });
        logger.info('Generated signed url for put operation', { url: signedUrl });
        return signedUrl;
    }
    getReadSignedUrl(todoId) {
        const signedUrl = this.s3.getSignedUrl('getObject', {
            Bucket: this.bucket,
            Key: `${todoId}.png`,
            Expires: this.expirationTime
        });
        logger.info('Generated signed url for get operation', { url: signedUrl });
        return signedUrl;
    }
}
//# sourceMappingURL=s3Access.js.map