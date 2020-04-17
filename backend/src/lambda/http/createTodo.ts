import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {createLogger} from "../../utils/logger";
import {createTodo} from "../../businessLogic/todos";
import {getStatusCode} from "../utils";


const logger = createLogger('createTodo');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  try {
    const result = await createTodo(newTodo, event);
    logger.info('Item created successfully.', {item: result})
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: result
      })
    }
  }
  catch (e) {
    let code = getStatusCode(e, 500);
    logger.error('Error occurred creating new Item',{error: e.message})
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Error occurred creating new Item'
      })
    }
  }
}
