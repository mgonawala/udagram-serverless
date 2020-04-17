import * as AWSXRay from 'aws-xray-sdk';
import * as AWS_ from 'aws-sdk';
const AWS = AWSXRay.captureAWS(AWS_);
import { getReadUrl } from "../utils/AWS";
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
                const attachmentUrl = await getReadUrl(record.todoId);
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
        if (!result) {
        }
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
        return item;
    }
    async deleteItem(todoId) {
        const result = await this.docClient.get({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            }
        }).promise();
        if (!result) {
            await this.docClient.delete({
                TableName: this.todoTable,
                Key: {
                    todoId: todoId
                }
            }).promise();
        }
        throw new CustomError(404, 'Item with given id does not exist');
    }
}
//# sourceMappingURL=todoAccess.js.map