
const AWSXRay = require('aws-xray-sdk');
import * as AWS_ from 'aws-sdk';
const AWS = AWSXRay.captureAWS(AWS_);
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {TodoItem} from "../models/TodoItem";
import {createLogger} from "../utils/logger";
import {s3Access} from "../businessLogic/s3Access";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import CustomError from "../utils/CustomError"

const logger = createLogger('todoaccess')


export class TodoAccess{


  constructor(
      private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
      private readonly todoTable: string = process.env.TODO_TABLE,
      private readonly indexName: string = process.env.INDEX_NAME
  ){}

  async getAllTodos(userId: string) : Promise<TodoItem[]>{

   const result = await this.docClient.query({
      TableName: this.todoTable,
      IndexName: this.indexName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues:  {
        ":userId": userId
      }
    }).promise();

    if( result.Count !== 0) {
      for(const record of result.Items){
        const attachmentUrl =  await s3Access.getReadSignedUrl(record.todoId);
        record.attachmentUrl = attachmentUrl;
      }
    }

   return result.Items as TodoItem[];
  }

  async createTodo(item: TodoItem): Promise<TodoItem>{

    await this.docClient.put({
      TableName: this.todoTable,
      Item: item
    }).promise();

    return item;
  }

  async getTodoById(todoId: string): Promise<TodoItem>{
    const result = await this.docClient.get({
      TableName: this.todoTable,
      Key: {
        "todoId":todoId
      }
    }).promise();

    if( !result.Item){
      logger.error('Todo with give id not found', {todoId: todoId});
      throw new CustomError(404, 'Todo with given id not found');
    }

    const item  = result.Item as TodoItem;
    item.attachmentUrl = s3Access.getReadSignedUrl(todoId);
    return item;
  }


  async updateTodo(todoId:string, item: UpdateTodoRequest): Promise<any>{

    await this.docClient.update({
      TableName: this.todoTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: " SET #name= :name , dueDate = :dueDate, done = :done ",
      ExpressionAttributeValues: {
        ":name": item.name || null,
        ":dueDate": item.dueDate || null,
        ":done": item.done || null
      },
      ExpressionAttributeNames : {
        "#name": "name"
      }
    }).promise();

    return undefined
  }


  async deleteItem(todoId: string): Promise<any>{
    // validate todo id
    await this.getTodoById(todoId);
    await this.docClient.delete({
        TableName: this.todoTable,
        Key: {
          todoId: todoId
        }
      }).promise();
  }
}
