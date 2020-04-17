import { decode } from 'jsonwebtoken';
import { createLogger } from "../utils/logger";
const logger = createLogger('util');
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
    const decodedJwt = decode(jwtToken);
    logger.info('UserId', { userId: decodedJwt.sub });
    return decodedJwt.sub;
}
//# sourceMappingURL=utils.js.map