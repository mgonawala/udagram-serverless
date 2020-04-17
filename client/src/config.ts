// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://oi3gapjky7.execute-api.us-east-1.amazonaws.com/dev`
//export const apiEndpoint = `http://localhost:3000/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-mhn8qdzu.auth0.com',            // Auth0 domain
  clientId: '7d9G79Ufr5yo6LglnFt8lZD6f1fksTEI',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
