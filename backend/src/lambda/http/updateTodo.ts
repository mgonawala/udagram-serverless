import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {TodoItem} from "../../models/TodoItem";
import {createLogger} from "../../utils/logger";
import {getStatusCode} from "../utils";
import {udpateTodo} from "../../businessLogic/todos";

const logger = createLogger('update-todo')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todoId: string = event.pathParameters.todoId
  const parsedBody: TodoItem = JSON.parse(event.body)

  try {
    await udpateTodo(todoId, parsedBody);
    logger.info('Todo item updated successfully',{item: parsedBody});
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin':'*'
      },
      body: ''
    }
  }
  catch (e) {
    let code = getStatusCode(e, 500);
    logger.error('Error occurred updating the item', {error: e.message})
    return {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({error: 'Error occurred updating TODO item'})
    }
  }

}
