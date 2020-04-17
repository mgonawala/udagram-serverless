const AWSXRay = require('aws-xray-sdk');
import * as AWS_ from 'aws-sdk';
const AWS = AWSXRay.captureAWS(AWS_);
import { createLogger } from "../utils/logger";
import { s3Access } from "../businessLogic/s3Access";
import CustomError from "../utils/CustomError";
const logger = createLogger('todoaccess');
export class TodoAccess {
    constructor(docClient = new AWS.DynamoDB.DocumentClient(), todoTable = process.env.TODO_TABLE, indexName = process.env.INDEX_NAME) {
        this.docClient = docClient;
        this.todoTable = todoTable;
        this.indexName = indexName;
    }
    async getAllTodos(userId) {
        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.indexName,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }).promise();
        if (result.Count !== 0) {
            for (const record of result.Items) {
                const attachmentUrl = await s3Access.getReadSignedUrl(record.todoId);
                record.attachmentUrl = attachmentUrl;
            }
        }
        return result.Items;
    }
    async createTodo(item) {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: item
        }).promise();
        return item;
    }
    async getTodoById(todoId) {
        const result = await this.docClient.get({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            }
        }).promise();
        if (!result.Item) {
            logger.error('Todo with give id not found', { todoId: todoId });
            throw new CustomError(404, 'Todo with given id not found');
        }
        const item = result.Item;
        item.attachmentUrl = s3Access.getReadSignedUrl(todoId);
        return item;
    }
    async updateTodo(todoId, item) {
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
            ExpressionAttributeNames: {
                "#name": "name"
            }
        }).promise();
        return undefined;
    }
    async deleteItem(todoId) {
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
//# sourceMappingURL=todoAccess.js.map