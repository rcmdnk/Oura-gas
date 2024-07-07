function test(){
  let token = undefined;
  // let token = TOKEN;
  if(token == undefined){
    const service = getService();
    if (!service.hasAccess()) {
      throw new Error('Open the following URL and re-run the script: '
                      + service.getAuthorizationUrl());
    }
    token = service.getAccessToken();
  }
  let result = undefined;
  let url = 'https://api.ouraring.com/v2/usercollection/personal_info';
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  });
  result = JSON.parse(response.getContentText());
  Logger.log(result);
}

function testUserinfo(){
  let url = 'https://api.ouraring.com/v2/usercollection/personal_info';
  let payload = {};
  let result = request(url, payload, '')
  Logger.log(result);
}

function testOura(){
  let url = 'https://api.ouraring.com/v1/sleep?start=2022-01-01&end=2022-01-10';
  let payload = {};
  let result = request(url, payload, '')
  Logger.log(result);
}
