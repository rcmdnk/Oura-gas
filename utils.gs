function getSheet(sheetName, columns=[], formatA='yyyy/MM/dd HH:mm:ss'){
  const ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone(TIME_ZONE);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // remain 1 additional row, to frozen first row
    // (need additional rows to fix rows)
    sheet.deleteRows(1, sheet.getMaxRows()-2);
    sheet.deleteColumns(1, sheet.getMaxColumns()-columns.length);
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
    sheet.getRange('A:A').setNumberFormat(formatA);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getLatestTime(sheetName){
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);
  if(!sheet){
    return null;
  }
  const maxRows = sheet.getMaxRows();
  if(maxRows < 2){
    return null;
  } 
  return sheet.getRange(maxRows, 1).getDisplayValues()[0][0];
}

function fillValues(sheetName, columns, data, formatA='yyyy/MM/dd HH:mm:ss'){
  const sheet = getSheet(sheetName, columns, formatA);
  const datetimes = sheet.getRange('A:A').getDisplayValues().flat();
  const data_new = [];
  data.forEach(function(d) {
    if (datetimes.includes(d[0])) return;
    data_new.push(d);
  });
  if (data_new.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1,
        data_new.length, columns.length).setValues(data_new);
    sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn()).sort(1);
  }
}

function getDate(unixtime=null, timezone=null, format='yyyy/MM/dd HH:mm:ss'){
  if (!timezone) timezone = TIME_ZONE;
  if (!unixtime) {
    return Utilities.formatDate(new Date(), timezone, format);
  }
  return Utilities.formatDate(new Date(unixtime * 1000), timezone, format);
}

function fillRenew(sheetName, columns, data){
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);
  if (sheet) {
    sheet.clear();
  }else{
    sheet = ss.insertSheet(sheetName);
  }
  const maxRows = sheet.getMaxRows();
  if(maxRows > 2){
    sheet.deleteRows(1, maxRows-2);
  }
  const maxColumns = sheet.getMaxColumns();
  if(maxColumns > columns.length){
    sheet.deleteColumns(1, maxColumns-columns.length);
  }
  sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
  sheet.getRange(2, 1, 1, data.length).setValues([data]);
  sheet.setFrozenRows(1);
}