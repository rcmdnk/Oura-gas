/**
 * Oura API Ref: https://cloud.ouraring.com/docs/
 */

const API_URL_PREFIX = 'https://api.ouraring.com/v2/usercollection/'
const AUTHORIZATION_BASE_URL = 'https://cloud.ouraring.com/oauth/authorize';
const TOKEN_URL = 'https://api.ouraring.com/oauth/token';

/**
 * Authorizes and makes a request to the Oura API.
 */
function request(collection){
  check_service();
  const result = getResult(collection);
  return result;
}

/**
 * Authorizes and retrieve long term data from the Oura API.
 */
function requestData(collection, start_date=null, end_date=null){
  if(!start_date){
    start_date = START_DATE;
  }
  if(!end_date){
    end_date = getDate(null, TIME_ZONE, 'yyyy-MM-dd');
  }
  check_service();
  let url_suffix = collection + '?start_date=' + start_date + '&end_date=' + end_date;
  let result = getResult(url_suffix);
  let data = result.data;
  let next_token = data.next_token;
  while(next_token){
    result = getResult(url_suffix + '&next_token=' + next_token);
    data.concat(result.data);
    next_token = data.next_token;
  }
  return data;
}

/**
 * Check service
 */
function check_service(){
  const service = getService();
  if (!service.hasAccess()) {
    const authorizationUrl = service.getAuthorizationUrl();
    const msg = 'Open the following URL and re-run the script: ' +
      authorizationUrl;
    let EMAIL = PropertiesService.getScriptProperties().getProperty("EMAIL");
    if (!EMAIL) {
      EMAIL = Session.getActiveUser().getEmail();
    }
    if (!EMAIL) throw new Error('Set "EMAIL" if necessary\n\n' + msg); 
    MailApp.sendEmail(EMAIL,
      'NEED AUTHENTICATION: Google App Script for Withings API', msg);
    throw new Error(msg);
  }
  Logger.log('Service is authorized.')
}

/**
 * Get result
 */
function getResult(collection){
  let response = undefined;
  try{
    response = fetch(collection);
  }catch(e){
    const matches = e.message.match(/returned code (\d{3})/);
    let errorCode = '';
    if(matches.length > 1){
      errorCode = matches[1];
    }
    if(errorCode != 401){
      throw e;
    }
    Logger.log(e);
    Logger.log('Try refreshing token.')
    refresh();
    response = fetch(collection);
  }
  const result = JSON.parse(response.getContentText());
  return result;
}

/**
 * Fetch data
 */
function fetch(collection){
  const url = API_URL_PREFIX + collection;
  const service = getService();
  const options = {
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken()
    }
  };
  return UrlFetchApp.fetch(url, options);
}

/**
 * Refresh token
 */
function refresh(){
  const service = getService();
  const payload = {
    'refresh_token': service.getToken().refresh_token,
    'client_id': service.clientId_,
    'client_secret': service.clientSecret_,
    'grant_type': 'refresh_token'
  };
  let token = service.fetchToken_(payload, service.refreshUrl_);
  service.saveToken_(token);
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  Logger.log('Reset the authorization state.');
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  const properties = PropertiesService.getScriptProperties();
  const CLIENT_ID = properties.getProperty("CLIENT_ID");
  const CLIENT_SECRET = properties.getProperty("CLIENT_SECRET");
  if (!CLIENT_ID) throw new Error('Set CLIENT_ID'); 
  if (!CLIENT_SECRET) throw new Error('Set CLIENT_SECRET'); 
  return OAuth2.createService('Oura')
      // Set the endpoint URLs.
      .setAuthorizationBaseUrl(AUTHORIZATION_BASE_URL)
      .setTokenUrl(TOKEN_URL)

      // Set the client ID and secret.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function that should be invoked to
      // complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set scope
      .setScope(SCOPE)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  const service = getService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}

/**
 * Logs the redirect URI to register.
 */
function logRedirectUri() {
  Logger.log(OAuth2.getRedirectUri());
}