import { parseUserId } from "../auth/utils";
import { createLogger } from "../utils/logger";
import CustomError from "../utils/CustomError";
const logger = createLogger('utils');
/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event) {
    logger.info('Parse UserId from event object.', { event: event });
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    logger.info('Auth Token', { token: jwtToken });
    return parseUserId(jwtToken);
}
export function getStatusCode(e, code) {
    if (e instanceof CustomError)
        return e.status;
    else
        return code;
}
//# sourceMappingURL=utils.js.map