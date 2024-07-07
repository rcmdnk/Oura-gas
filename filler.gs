function getPersonalInfo(){
  const result = request('personal_info')
  return result;
}

function testPersonalInfo(){
  Logger.log(getPersonalInfo());
}

function fillPersonalInfo(){
  const info = getPersonalInfo();
  const columns = Object.keys(info);
  const data = Object.values(info);
  fillRenew('Personal Info', columns, data);
}

function fillDailySleep(){
  const sheet_name = 'Daily Sleep';
  const start_date = getLatestTime(sheet_name);
  const data = requestData('daily_sleep', start_date);
  const columns = ['day', 'score'].concat(DAILY_SLEEP_CONTRIBUTORS);
  const data_array = [];
  data.forEach(function(d) {
    const each_data = [d['day'], d['score']];
    DAILY_SLEEP_CONTRIBUTORS.forEach(function(c){
      each_data.push(d['contributors'][c])
    });
    data_array.push(each_data);
  });
  fillValues(sheet_name, columns, data_array, 'yyyy-MM-dd');
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
