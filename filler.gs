function test(){
const data = requestData('daily_sleep', '2024-07-01', '2024-07-05');
Logger.log(data);
}

function fillPersonalInfo(){
  const info = request('personal_info')
  const columns = Object.keys(info);
  const data = Object.values(info);
  fillRenew('Personal Info', columns, data);
}

function fillDailyScore(sheetName, collection, dataNames, contributors){
  const start_date = getLatestTime(sheetName);
  const data = requestData(collection, start_date);
  const columns = dataNames.concat(contributors);
  const data_array = [];
  data.forEach(function(d){
    const each_data = [];
    dataNames.forEach(function(c){
      each_data.push(d[c])
    });    
    contributors.forEach(function(c){
      each_data.push(d['contributors'][c])
    });
    data_array.push(each_data);
  });
  fillValues(sheetName, columns, data_array, 'yyyy-MM-dd');
}


function fillDailyReadiness(){
  fillDailyScore('Daily Readiness', 'daily_readiness', DAILY_READINESS_DATA, DAILY_READINESS_CONTRIBUTORS);
}

function fillDailySleep(){
  fillDailyScore('Daily Sleep', 'daily_sleep', DAILY_SLEEP_DATA, DAILY_SLEEP_CONTRIBUTORS);
}

function fillDailyStress(){
  fillDailyScore('Daily Stress', 'daily_stress', DAILY_STRESS_DATA, DAILY_STRESS_CONTRIBUTORS);
}

function fillSleep(){
  const sheet_name = 'Sleep';
  let start_date = getLatestTime(sheet_name);
  if(start_date){
    start_date = start_date.split(' ')[0];
  }
  const data = requestData('sleep', start_date);
  const columns = [SLEEP_DATA_INDEX].concat(SLEEP_DATA);
  const data_array = [];
  data.forEach(function(d){
    const each_data = [];
    columns.forEach(function(c){
      let column_data = d[c];
      if(SLEEP_DATA_DATETIME.includes(c)){
        column_data = column_data.replace('T', ' ').split('+')[0].split('.')[0];
      }
      each_data.push(column_data);
    }); 
    data_array.push(each_data);
  });
  fillValues(sheet_name, columns, data_array, 'yyyy-MM-dd HH:mm:ss');
}

function fillAll(){
  fillPersonalInfo();
  fillDailyReadiness();
  fillDailySleep();
  fillDailyStress();
  fillSleep();
}