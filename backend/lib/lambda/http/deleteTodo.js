import 'source-map-support/register';
import { createLogger } from "../../utils/logger";
import { getStatusCode } from "../utils";
import { deleteTodo } from "../../businessLogic/todos";
const logger = createLogger('delete-todo');
export const handler = async (event) => {
    const todoId = event.pathParameters.todoId;
    try {
        await deleteTodo(todoId);
        logger.info('Item deleted successfully', { todoId: todoId });
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Header': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        };
    }
    catch (e) {
        let statusCode = getStatusCode(e, 500);
        logger.error('Error deleting todo item:', { error: e.message });
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Error occurred deleting item' })
        };
    }
};
//# sourceMappingURL=deleteTodo.js.map