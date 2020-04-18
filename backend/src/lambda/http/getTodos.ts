import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from "../utils";
import {createLogger} from "../../utils/logger";
import {getAllTodos} from "../../businessLogic/todos";
import {getStatusCode} from "../utils";
const logger = createLogger('get-todos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  try {
    logger.info('Get To-do items of user', {userId: userId});
    const result = await getAllTodos(userId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: result
      })
    }
  }
  catch (e) {

    logger.error('Error Occurred while getting list of Todos for User', {error: e.message});
    let code = getStatusCode(e, 500);
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Error occurred fetching TODO Items of User'
      })
    }
  }
}

