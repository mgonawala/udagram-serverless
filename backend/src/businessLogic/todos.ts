import {TodoItem} from "../models/TodoItem";
import {TodoAccess} from "../dataLayer/todoAccess";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import * as uuid from 'uuid';
import {getUserId} from "../lambda/utils";
import {APIGatewayProxyEvent} from "aws-lambda";
import {createLogger} from "../utils/logger";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import CustomError from "../utils/CustomError"
const todoAccess = new TodoAccess();
const logger = createLogger('todo')

export async function getAllTodos(userId: string): Promise<TodoItem[]>{
  const result = await todoAccess.getAllTodos(userId);
  return result;

}

export async function createTodo(todoRequest: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem>{
  const todoId = uuid.v4();
  const userId = getUserId(event);

  if(!userId)
  {
    logger.error('Invalid UserId');
    throw new CustomError(409, 'Invalid UserId');
  }

  const newItem: TodoItem = {
    todoId: todoId,
    userId: userId,
    done: false,
    dueDate: todoRequest.dueDate,
    name: todoRequest.name,
    attachmentUrl: null,
    createdAt: new Date().toISOString()
  }
  const result = await todoAccess.createTodo(newItem);
  return result;
}

export async function udpateTodo(todoId: string, updateRequest: UpdateTodoRequest, userId: string): Promise<any>{
  // validate todo id
  const item = await getTodoById(todoId);
  if( item.userId !== userId)
    {
      logger.error('Authorization error',{
        error: 'User is not authorized to permorm udate on Item',
        todoId: todoId,
        userId: userId
      });
      throw new CustomError(409,'User is not authorized to perform update operation');
    }
  await todoAccess.updateTodo(todoId, updateRequest, userId);

}

export async function deleteTodo(todoId: string, userId: string): Promise<any>{
  //validate todo id
  const item = await getTodoById(todoId);
  if( item.userId !== userId){
    logger.error('Authorization error',{
      error: 'User is not authorized to permorm delete on Item',
      todoId: todoId,
      userId: userId
    });
    throw new CustomError(409,'User is not authorized to delete update operation');
  }
  // Delete item
  await todoAccess.deleteItem(todoId, userId);
}

export async function getTodoById(todoId : string){
  return await todoAccess.getTodoById(todoId);
}