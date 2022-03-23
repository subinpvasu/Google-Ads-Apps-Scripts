var VER = 'v12.0';
var LONG_LIVED_PAGE_ACCESS_TOKEN = 'EAAH1QZA8ARMYBAAvpAqcQCgvlZCJFqj8Gp1WVfNJ5ghBjhFmEzTFZAeGS7rynDJZByRUwkpSjiuGeBojGtYYZAmZAMxWacO1xEvUedMAgXZB9MuDx0pd1pU3HnNyVT0RBKPGHZB61kjfgFWqM3WuGLKbGK2kwW3rIqGvIwPSHUETZBrKgKFOIOnmA';
var SPREADSHEET_ID = '1paZE9LFSa7bVvyLPdo6-eOea_-Y8JWX6yo0S6MLHh4c';

function doGet(request)
{
  if (request.parameter['hub.verify_token'] == 'abcdefghijklmn0123456789') {
    return ContentService.createTextOutput(request.parameter['hub.challenge']);
  }
}

function doPost(request)
{

    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var active_sheet = spreadsheet.getSheetByName("Sheet1");    
    var returned_json = request.postData.getDataAsString();  
    var returned_data = JSON.parse(returned_json);
      try{
    var lead_id = returned_data.entry[0].changes[0].value['leadgen_id'];
    var submitted_epoch_timestamp = returned_data.entry[0].changes[0].value['created_time'];
//var lead_id = 1048151682427915;
    var d = new Date( submitted_epoch_timestamp * 1000 );
    var submited_at = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    var lead_info_endpoint = 'https://graph.facebook.com/'+VER+'/' + lead_id + '?access_token=' + LONG_LIVED_PAGE_ACCESS_TOKEN;        
    var lead_info_response = UrlFetchApp.fetch(lead_info_endpoint, {'method': 'get'});    
    var lead_info = JSON.parse(lead_info_response);
    var field_data = lead_info.field_data;
    active_sheet.getRange(1,1).setValue('Created Time');
    active_sheet.getRange(1,2).setValue(field_data[0].name);
    active_sheet.getRange(1,3).setValue(field_data[1].name);
    active_sheet.getRange(1,4).setValue(field_data[2].name);
    var final_lead_information = [];
    final_lead_information.push(submited_at);
    for( var x = 0; x < field_data.length; x++ ) {
      final_lead_information.push(field_data[x].values[0]);
    }
    active_sheet.appendRow(final_lead_information); 
  }catch(e){
active_sheet.getRange(1,9).setValue(e);
  }
}