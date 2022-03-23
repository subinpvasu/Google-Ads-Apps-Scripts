var VER = 'v12.0';
var LONG_LIVED_PAGE_ACCESS_TOKEN = 'EAAH1QZA8ARMYBAAvpAqcQCgvlZCJFqj8Gp1WVfNJ5ghBjhFmEzTFZAeGS7rynDJZByRUwkpSjiuGeBojGtYYZAmZAMxWacO1xEvUedMAgXZB9MuDx0pd1pU3HnNyVT0RBKPGHZB61kjfgFWqM3WuGLKbGK2kwW3rIqGvIwPSHUETZBrKgKFOIOnmA';
var SPREADSHEET_ID = '1paZE9LFSa7bVvyLPdo6-eOea_-Y8JWX6yo0S6MLHh4c';
var LEAD_FORM_ID = '561785051815900';



function doGet(request)
{
  if (request.parameter['hub.verify_token'] == 'abcdefghijklmn0123456789') {
    return ContentService.createTextOutput(request.parameter['hub.challenge']);
  }

  if (request.parameter['pull_all_leads'] == 'true') {

    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var active_sheet = spreadsheet.getSheetByName("Sheet1");

    var lead_data_endpoint = 'https://graph.facebook.com/'+VER+'/' + LEAD_FORM_ID + '/leads?access_token=' + LONG_LIVED_PAGE_ACCESS_TOKEN;
    var lead_data_response = UrlFetchApp.fetch( lead_data_endpoint, {'method': 'get'} );
    var lead_raw_data = JSON.parse(lead_data_response);
    var lead_data = lead_raw_data.data;

    var initial = true;
    var to_proceed = true;
    var subsequent_api_endpoint = '';

    while( to_proceed ) {

      // Trigger another Graph API call to paginate to the next page
      if ( initial === false && subsequent_api_endpoint != '' ) {
        lead_data_response = UrlFetchApp.fetch( subsequent_api_endpoint, {'method': 'get'} );
        lead_raw_data = JSON.parse(lead_data_response);
        lead_data = lead_raw_data.data;
      }

      // Process all of the leads in this page (one page contains 25 leads)
      for( var z = 0; z < lead_data.length; z++ ) {

        // Get current lead information
        var current_lead = lead_data[z];
        var field_data = current_lead.field_data;
        var final_lead_information = {};

        // Compile all data in an object
        for( var x = 0; x < field_data.length; x++ ) {
          final_lead_information[field_data[x].name] = field_data[x].values[0];
        }

        // Get the date and time we received the lead
        var d = new Date( current_lead.created_time );
        var submitted_at = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        final_lead_information['submitted_at'] = submitted_at;

        // Arrange them in the proper order
        var final_order = [];
        var format_order = ['full_name', 'phone_number', 'email', 'company_name', 'job_title', 'submitted_at'];
        for( var y = 0; y < format_order.length; y++ ) {
           final_order.push(final_lead_information[format_order[y]]);
        }

        // Record it in the Google Sheets
        active_sheet.appendRow(final_order);

      }

      subsequent_api_endpoint = lead_raw_data['paging']['next'] !== undefined ? lead_raw_data['paging']['next'] : '';
      to_proceed = lead_raw_data['paging']['next'] !== undefined;

      initial = false;

    }

    return ContentService.createTextOutput('Done, please check your Google Sheets.');
  }



}
