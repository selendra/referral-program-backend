const { google } = require('googleapis');

/*******************/
/** CONFIGURATION **/
/*******************/
/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];

/*************/
/** HELPERS **/
/*************/
/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } = process.env;
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL
  );
}
/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope
  });
}

/**********/
/** MAIN **/
/**********/
/**
 * Create the google url to be sent to the client.
 */
function urlGoogle() {
  const auth = createConnection(); // this is from previous step
  const url = getConnectionUrl(auth);
  return url;
}

/**
 * Extract the email and id of the google account from the "code" parameter.
 */
async function getGoogleAccountFromCode(code) {
  const auth = createConnection();
  // get the auth "tokens" from the request
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  return {
    tokens: tokens, // you can save these to the user if you ever want to get their details without making them log in again
  };
}

module.exports = {
  createConnection,
  urlGoogle,
  getGoogleAccountFromCode
}