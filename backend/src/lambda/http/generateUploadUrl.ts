import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getStatusCode, getUserId} from "../utils";
import {s3Access} from "../../businessLogic/s3Access";
import { getTodoById} from "../../businessLogic/todos";
import {createLogger} from "../../utils/logger";
import CustomError from '../../utils/CustomError';

const logger = createLogger('generate-uploadUrl');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todoId = event.pathParameters.todoId
  try {
    const userId = getUserId(event);
    const item = await getTodoById(todoId);
    if( item.userId !== userId){
      logger.error('Authorization error',{
        error: 'User is not authorized to perform getnerateUplodURL opertion on Item',
        todoId: todoId,
        userId: userId
      });
      throw new CustomError(409,'User is not authorized to perform this operation');
    }
    const signedUrl = s3Access.getSignedUrl(todoId, 'image/png');
    logger.info('Signed URL generated successfully', {todoId: todoId})
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl: signedUrl
      })
    }
  }
  catch (e) {
    logger.error('Error occurred generating signed URL', {error : e.message})
    let code = getStatusCode(e, 500)
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({
        message: 'Invalid To-Do id provided'
      })
    }
  }

}
