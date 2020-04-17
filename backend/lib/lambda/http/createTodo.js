import 'source-map-support/register';
import { createLogger } from "../../utils/logger";
import { createTodo } from "../../businessLogic/todos";
import { getStatusCode } from "../utils";
const logger = createLogger('createTodo');
export const handler = async (event) => {
    const newTodo = JSON.parse(event.body);
    try {
        const result = await createTodo(newTodo, event);
        logger.info('Item created successfully.', { item: result });
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                item: result
            })
        };
    }
    catch (e) {
        let code = getStatusCode(e, 500);
        logger.error('Error occurred creating new Item', { error: e.message });
        return {
            statusCode: code,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Error occurred creating new Item'
            })
        };
    }
};
//# sourceMappingURL=createTodo.js.map