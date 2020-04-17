import { TodoAccess } from "../dataLayer/todoAccess";
import * as uuid from 'uuid';
import { getUserId } from "../lambda/utils";
import { createLogger } from "../utils/logger";
import CustomError from "../utils/CustomError";
const todoAccess = new TodoAccess();
const logger = createLogger('todo');
export async function getAllTodos(userId) {
    const result = await todoAccess.getAllTodos(userId);
    return result;
}
export async function createTodo(todoRequest, event) {
    const todoId = uuid.v4();
    const userId = getUserId(event);
    if (!userId) {
        logger.error('Invalid UserId');
        throw new CustomError(409, 'Invalid UserId');
    }
    const newItem = {
        todoId: todoId,
        userId: userId,
        done: false,
        dueDate: todoRequest.dueDate,
        name: todoRequest.name,
        attachmentUrl: null,
        createdAt: new Date().toISOString()
    };
    const result = await todoAccess.createTodo(newItem);
    return result;
}
export async function udpateTodo(todoId, updateRequest) {
    // validate todo id
    await getTodoById(todoId);
    await todoAccess.updateTodo(todoId, updateRequest);
}
export async function deleteTodo(todoId) {
    //validate todo id
    await getTodoById(todoId);
    // Delete item
    await todoAccess.deleteItem(todoId);
}
export async function getTodoById(todoId) {
    return await todoAccess.getTodoById(todoId);
}
//# sourceMappingURL=todos.js.map