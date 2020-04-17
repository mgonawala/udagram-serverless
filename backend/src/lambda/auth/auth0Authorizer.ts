import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import {JwtToken} from '../../auth/JwtToken'

const logger = createLogger('auth')

//  Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-mhn8qdzu.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function getSecret(decodedJwt){

  //getSigningKeys()
  const result = await Axios.get(jwksUrl);
  const keys = result.data.keys;
  //Filter valid signing keys
  const signingKeys = keys
  .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
      && key.kty === 'RSA' // We are only supporting RSA
      && key.kid           // The `kid` must be present to be useful for later
  ).map(key => {
    return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
  });

  if( !signingKeys.length)
    throw new Error('The JWKS endpoint did not contain any signing keys')

  //getKidFromJWT()
  const kid = decodedJwt.header.kid;
  // Find matching signing Key
  const signingKey = signingKeys.find(key => key.kid === kid);
  return  signingKey.publicKey;

}

// Function to convert cert to pem type
export function certToPEM(cert) {
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}


async function  verifyToken( authHeader : string) : Promise<JwtToken>{
  if(!authHeader)
    throw new Error('No Authentication header');

  if( !authHeader.toLocaleLowerCase().startsWith('bearer '))
    throw new Error('Invalid Authentication header');

  const split = authHeader.split(' ');
  const token = split[1];
  const decodedToken: Jwt = decode(token, { complete: true }) as Jwt
  console.log(decodedToken.header)

  const cert = await getSecret(decodedToken);
  logger.info('Public Certificate ', {message: cert})
  logger.info('JWT token ', {message: token});
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken

}