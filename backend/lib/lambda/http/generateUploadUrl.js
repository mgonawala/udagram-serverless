import 'source-map-support/register';
import { getStatusCode } from "../utils";
import { s3Access } from "../../businessLogic/s3Access";
import { getTodoById } from "../../businessLogic/todos";
import { createLogger } from "../../utils/logger";
const logger = createLogger('generate-uploadUrl');
export const handler = async (event) => {
    const todoId = event.pathParameters.todoId;
    try {
        await getTodoById(todoId);
        const signedUrl = s3Access.getSignedUrl(todoId, 'image/png');
        logger.info('Signed URL generated successfully', { todoId: todoId });
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                uploadUrl: signedUrl
            })
        };
    }
    catch (e) {
        logger.error('Error occurred generating signed URL', { error: e.message });
        let code = getStatusCode(e, 500);
        return {
            statusCode: code,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Invalid To-Do id provided'
            })
        };
    }
};
//# sourceMappingURL=generateUploadUrl.js.map