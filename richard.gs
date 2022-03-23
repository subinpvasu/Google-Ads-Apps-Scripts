var setup_sheet_id = 'ID';
var timeZone = AdsApp.currentAccount().getTimeZone();
var spreadsheet = SpreadsheetApp.create("Report output");
var MULTIPLIER = 1000000;

var GENERIC_LABEL_CAMPAIGN = '';
var GENERIC_LABEL_ADGROUP = '';
var GENERIC_LABEL_KEYWORD = '';

var unlabelled_keywords = [];
var labelled_campaigns = [];
var unlabelled_adgroups = [];


function main() {
  var spreadsheet = SpreadsheetApp.create('INSERT_REPORT_NAME_HERE');
  /*const query =  
 'SELECT metrics.clicks,metrics.conversions,metrics.cost_per_conversion,search_term_view.search_term FROM search_term_view WHERE  metrics.clicks>14 AND metrics.cost_per_conversion>5000000 AND segments.date BETWEEN "2021-09-10" AND "2021-12-08"'

  var report = AdsApp.report(query);
  var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();   
      Logger.log(row['metrics.clicks']);
    }
  /*while (result.hasNext()) {
    var row = result.next();
    //console.log(JSON.stringify(row));
    spreadsheet.appendRow(row);
  }*/
  
  
  var report = AdsApp.report(
    'SELECT ExternalCustomerId, Clicks  FROM   ACCOUNT_PERFORMANCE_REPORT  DURING 20210911,20211209');
  report.exportToSheet(spreadsheet.getActiveSheet());
  Logger.log(spreadsheet.getUrl());
}






function maingg()
{    
  const setup = SpreadsheetApp.openById(setup_sheet_id);
  
  const email_address = setup.getRangeByName('email_address').getValue();
  const review_duration = setup.getRangeByName('review_duration').getValue();
  const threshold_click = setup.getRangeByName('threshold_click').getValue();
  const threshold_coscon = setup.getRangeByName('threshold_coscon').getValue()*MULTIPLIER;
  
  const status_campaign = setup.getRangeByName('status_campaign').getValue();
  const status_adgroup = setup.getRangeByName('status_adgroup').getValue();
  const status_keywords = setup.getRangeByName('status_keywords').getValue();
  const status_search_terms = setup.getRangeByName('status_search_terms').getValue();
  const status_country = setup.getRangeByName('status_country').getValue();
  const status_region = setup.getRangeByName('status_region').getValue();
  const status_city = setup.getRangeByName('status_city').getValue();
  const status_devices = setup.getRangeByName('status_devices').getValue();
  const status_match_type = setup.getRangeByName('status_match_type').getValue();
  const status_weekday = setup.getRangeByName('status_weekday').getValue();
  const status_hours = setup.getRangeByName('status_hours').getValue();
  const status_gender = setup.getRangeByName('status_gender').getValue();
  const status_age = setup.getRangeByName('status_age').getValue();
  const status_audience = setup.getRangeByName('status_audience').getValue();
  
  const label_campaign = setup.getRangeByName('label_campaign').getValue();
  const paused_campaign = setup.getRangeByName('paused_campaign').getValue();
  const label_adgroup = setup.getRangeByName('label_adgroup').getValue();
  const paused_adgroup = setup.getRangeByName('paused_adgroup').getValue();
  const label_keyword = setup.getRangeByName('label_keyword').getValue();
  const paused_keyword = setup.getRangeByName('paused_keyword').getValue();
  
  GENERIC_LABEL_CAMPAIGN = setup.getRangeByName('campaign_label').getValue();
  GENERIC_LABEL_ADGROUP = setup.getRangeByName('adgroup_label').getValue();
  GENERIC_LABEL_KEYWORD = setup.getRangeByName('keyword_label').getValue();
  
   
  status_campaign=='Yes'?write_to_sheet(campaign_performance(threshold_click, threshold_coscon, label_campaign, paused_campaign, review_duration)):'';    
  status_adgroup=='Yes'?write_to_sheet(adgroup_performance(threshold_click, threshold_coscon, label_adgroup, paused_adgroup, review_duration)):''; 
  status_keywords=='Yes'?write_to_sheet(keyword_performance(threshold_click, threshold_coscon, label_keyword, paused_keyword, review_duration)):''; 
  status_search_terms=='Yes'?write_to_sheet(search_terms_performance(threshold_click, threshold_coscon, review_duration)):'';   
  status_devices=='Yes'?write_to_sheet(device_performance(threshold_click, threshold_coscon, review_duration)):'';   
  status_weekday=='Yes'?write_to_sheet(dayofweek_performance(threshold_click, threshold_coscon, review_duration)):''; 
  status_hours=='Yes'?write_to_sheet(hourofday_performance(threshold_click, threshold_coscon, review_duration)):''; 
  status_country=='Yes'?write_to_sheet(location_performance(threshold_click, threshold_coscon, review_duration, 'Country')):''; 
  status_region=='Yes'?write_to_sheet(location_performance(threshold_click, threshold_coscon, review_duration, 'Region')):''; 
  status_city=='Yes'?write_to_sheet(location_performance(threshold_click, threshold_coscon, review_duration, 'City')):''; 
  status_match_type=='Yes'?write_to_sheet(matchtype_performance(threshold_click, threshold_coscon, review_duration)):''; 
  status_gender=='Yes'?write_to_sheet(gender_performance(threshold_click, threshold_coscon, review_duration)):''; 
  status_age=='Yes'?write_to_sheet(agerange_performance(threshold_click, threshold_coscon, review_duration)):''; 
  status_audience=='Yes'?write_to_sheet(audience_performance(threshold_click, threshold_coscon, review_duration)):''; 
  
  
  send_email_alerts(setup, email_address);
}

function send_email_alerts(setup, email_address) {
  var now = new Date();  
  var end = new Date(now.getTime());  
  
  var sheet = spreadsheet.getSheets()[0];  
  sheet.copyTo(setup).setName('Report - '+end);
  
  var email_arr = email_address.split(",");
  spreadsheet.addEditors(email_arr);
  MailApp.sendEmail({
    to: email_address,
    subject: 'Wasteful Elements Alert',
    htmlBody: "Hi, <br>" +
              "Find the details of the wasteful elements <a href="+setup.getUrl()+">here</a>."
  });
  Logger.log("Email Sent!");
  
}



function write_to_sheet(response)
{  
  var sheet = spreadsheet.getSheetByName('report');
  if(sheet == null){    
    sheet = spreadsheet.insertSheet();
    spreadsheet.moveActiveSheet(1);    
    sheet.setName('report');
    var header = ['Date Script Ran', 'Element Type',	'Wasteful Element',	'Clicks',	'Conversions',	'Cost / Conv'];
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,6).setFontWeight("bold");    
  }
 
  var reports = [];
  rows = response.result;
  for (i in rows)
  {
    reports[i] = [rows[i].date, rows[i].type, rows[i].element, rows[i].clicks, rows[i].conversion, rows[i].costperconversion];
  } 
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  if(reports.length>0)
  {
    sheet.getRange(lastRow+1,1,reports.length,6).setValues(reports);    
  }
  else
  {
    reports = [response.date, response.type, 'N/A', 'N/A', 'N/A', 'N/A'];
    sheet.appendRow(reports);    
  }
  
}

function get_date_intervals(interval)
{
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  var now = new Date();
  var start = new Date(now.getTime() - parseInt(interval) * MILLIS_PER_DAY);
  var end = new Date(now.getTime()- MILLIS_PER_DAY);
  var duration =  ' DURING ' + Utilities.formatDate(start, timeZone, 'yyyyMMdd') + ',' + Utilities.formatDate(end, timeZone, 'yyyyMMdd');
  return duration;
}

function get_date_intervals_latest(interval)
{
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  var now = new Date();
  var start = new Date(now.getTime() - parseInt(interval) * MILLIS_PER_DAY);
  var end = new Date(now.getTime()- MILLIS_PER_DAY);
  var duration =  ' AND segments.date BETWEEN  "' + Utilities.formatDate(start, timeZone, 'yyyy-MM-dd') + '" AND "' + Utilities.formatDate(end, timeZone, 'yyyy-MM-dd')+'"';
  return duration;
}

function campaign_performance(click, cost_conversion, labelled_campaign, paused_campaign, review_days)
{
    var data = {};
    var result = {};
    var type = 'Campaigns';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
    var xtra = '';
    var label = '';        
    
    try
    {    
        if(labelled_campaign=='Yes')
        {
          var labels = AdsApp.labels().withCondition("Name = '"+GENERIC_LABEL_CAMPAIGN+"'").get().next();  
          label = " AND Labels CONTAINS_NONE [" + labels.getId() + "] "
        }
    }catch(e){Logger.log(e)}
  
    if(paused_campaign=='Yes'){xtra = " AND CampaignStatus='ENABLED' "}  
  
    var query = "SELECT CampaignName, Clicks, CostPerConversion, Conversions, CampaignId,Labels FROM CAMPAIGN_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+" "+xtra+" "+label+ get_date_intervals(review_days);
    var report = AdsApp.report(query);
    Logger.log(query);
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();      
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['CampaignName'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }
    
  var query = "SELECT CampaignName, Clicks, CostPerConversion, Conversions, CampaignId,Labels FROM CAMPAIGN_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0 "+xtra+" "+label+ get_date_intervals(review_days);
    var report = AdsApp.report(query);
    Logger.log(query);
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();      
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['CampaignName'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }
  
  data.date = date;
  data.type = type;
  data.result = result;
  return data;
}

function adgroup_performance(click, cost_conversion, labelled_adgroup, paused_adgroup, review_days)
{
    var data = {};
    var result = {};
    var type = 'Adgroups';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
    var xtra = '';
    var label = '';    
        
    try
    {    
        if(labelled_adgroup=='Yes')
        {
          var labels = AdsApp.labels().withCondition("Name = '"+GENERIC_LABEL_ADGROUP+"'").get().next();  
          label = " AND Labels CONTAINS_NONE [" + labels.getId() + "] "
        }
    }catch(e){Logger.log(e)}
  
    if(paused_adgroup=='Yes'){xtra = " AND AdGroupStatus='ENABLED' "}  
  
    var query = "SELECT AdGroupName, Clicks, CostPerConversion, Conversions, AdGroupId FROM   ADGROUP_PERFORMANCE_REPORT WHERE  Clicks>"+click+" "+xtra+" "+label+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days);
    var report = AdsApp.report(query);
  
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();  
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['AdGroupName'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }
  
    var query = "SELECT AdGroupName, Clicks, CostPerConversion, Conversions, AdGroupId FROM   ADGROUP_PERFORMANCE_REPORT WHERE  Clicks>"+click+" "+xtra+" "+label+" AND Conversions=0"+ get_date_intervals(review_days);
    var report = AdsApp.report(query);
  
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();  
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['AdGroupName'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function keyword_performance(click, cost_conversion, labelled_keyword, paused_keyword, review_days)
{
    var data = {};
    var result = {};
    var type = 'Keywords';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
    var xtra = '';
    var label = '';    
        
    try
    {    
        if(labelled_keyword=='Yes')
        {
          var labels = AdsApp.labels().withCondition("Name = '"+GENERIC_LABEL_KEYWORD+"'").get().next();  
          label = " AND Labels CONTAINS_NONE [" + labels.getId() + "] "
        }
    }catch(e){Logger.log(e)}
  
    if(paused_keyword=='Yes'){xtra = " AND Status='ENABLED' "}  
  
    var query = "SELECT Criteria, Clicks, CostPerConversion, Conversions, Id,KeywordMatchType FROM   KEYWORDS_PERFORMANCE_REPORT WHERE  Clicks>"+click+" "+xtra+" "+label+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days);
    var report = AdsApp.report(query);
  
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();      
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['Criteria']+' - '+row['KeywordMatchType'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }  
  
    var query = "SELECT Criteria, Clicks, CostPerConversion, Conversions, Id,KeywordMatchType FROM   KEYWORDS_PERFORMANCE_REPORT WHERE  Clicks>"+click+" "+xtra+" "+label+" AND Conversions=0"+ get_date_intervals(review_days);
    var report = AdsApp.report(query);
  
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();      
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['Criteria']+' - '+row['KeywordMatchType'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }  
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function search_terms_performance(click, cost_conversion, review_days)
{
    var data = {};
    var result = {};
    var type = 'Search Terms';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
    
    var query = 'SELECT  metrics.clicks, metrics.conversions, metrics.cost_per_conversion, search_term_view.search_term, segments.search_term_match_type FROM search_term_view WHERE  metrics.clicks>'+click+' AND metrics.cost_per_conversion>'+cost_conversion+ get_date_intervals_latest(review_days);    
    var report = AdsApp.report(query);
    Logger.log(query);
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();   
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['search_term_view.search_term']+' - '+row['segments.search_term_match_type'],
          'clicks' : row['metrics.clicks'],
          'conversion' : row['metrics.conversions'],
          'costperconversion' : row['metrics.cost_per_conversion']/MULTIPLIER
        }
      x++;
    }
  
    var query = 'SELECT  metrics.clicks, metrics.conversions, metrics.cost_per_conversion, search_term_view.search_term, segments.search_term_match_type FROM search_term_view WHERE  metrics.clicks>'+click+' AND metrics.conversions=0 ' + get_date_intervals_latest(review_days);    
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();   
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['search_term_view.search_term']+' - '+row['segments.search_term_match_type'],
          'clicks' : row['metrics.clicks'],
          'conversion' : row['metrics.conversions'],
          'costperconversion' : row['metrics.cost_per_conversion']
        }
      x++;
    }
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function location_performance(click, cost_conversion, review_days, location_type)
{ 
    var data = {};
    var result = {};
    var type = 'Location : '+location_type;
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
    switch(location_type)
    {
      case 'Country':
        var query = "SELECT CountryCriteriaId, Clicks, CostPerConversion, Conversions FROM   GEO_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days);    
        break;
      case 'Region':
        var query = "SELECT RegionCriteriaId, Clicks, CostPerConversion, Conversions FROM   GEO_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days);
        break;
      case 'City':
        var query = "SELECT CityCriteriaId, Clicks, CostPerConversion, Conversions FROM   GEO_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days);
        break;
    }
    
    Logger.log(query);
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
   
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : location_type=='Country'?row['CountryCriteriaId']:(location_type=='Region'?row['RegionCriteriaId']:row['CityCriteriaId']),
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }    
  
    switch(location_type)
    {
      case 'Country':
        var query = "SELECT CountryCriteriaId, Clicks, CostPerConversion, Conversions FROM   GEO_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+get_date_intervals(review_days);    
        break;
      case 'Region':
        var query = "SELECT RegionCriteriaId, Clicks, CostPerConversion, Conversions FROM   GEO_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+get_date_intervals(review_days);
        break;
      case 'City':
        var query = "SELECT CityCriteriaId, Clicks, CostPerConversion, Conversions FROM   GEO_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+get_date_intervals(review_days);
        break;
    }
    
    
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
   
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : location_type=='Country'?row['CountryCriteriaId']:(location_type=='Region'?row['RegionCriteriaId']:row['CityCriteriaId']),
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }    
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function device_performance(click, cost_conversion, review_days)
{
    var data = {};
    var result = {};
    var type = 'Devices';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
  
    var query = "SELECT Device, Clicks, CostPerConversion, Conversions FROM   ACCOUNT_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days); 
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['Device'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    } 
  
    var query = "SELECT Device, Clicks, CostPerConversion, Conversions FROM   ACCOUNT_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+get_date_intervals(review_days); 
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['Device'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    } 
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function matchtype_performance(click, cost_conversion, review_days)
{
    var data = {};
    var result = {};
    var type = 'Match Type';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
  
    var query = "SELECT KeywordMatchType, Clicks, CostPerConversion, Conversions, Date FROM   KEYWORDS_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days); 
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      result[x] = 
        {
          'date' : date,
          'type' : row['Date']+' - '+type,
          'element' : row['KeywordMatchType'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    } 
  
    var query = "SELECT KeywordMatchType, Clicks, CostPerConversion, Conversions, Date FROM   KEYWORDS_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+get_date_intervals(review_days); 
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      result[x] = 
        {
          'date' : date,
          'type' : row['Date']+' - '+type,
          'element' : row['KeywordMatchType'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    } 
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function gender_performance(click, cost_conversion, review_days)
{
    var data = {};
    var result = {};
    var buffer = {};
    var type = 'Gender';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
      
    buffer['MALE'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }
  
    buffer['FEMALE'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }

    buffer['UNDETERMINED'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }
  
    var query = "SELECT Criteria, Clicks, CostPerConversion, Conversions FROM   GENDER_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days); 
    var report = AdsApp.report(query);


    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      buffer[row['Criteria']] =     
      {
        'clicks' : parseFloat(buffer[row['Criteria']].clicks) + parseFloat(row['Clicks']),
        'conversion' : parseFloat(buffer[row['Criteria']].conversion) + parseFloat(row['Conversions']),
        'costperconversion' : parseFloat(buffer[row['Criteria']].costperconversion) + parseFloat(row['CostPerConversion'])
      }
    }
  
    var query = "SELECT Criteria, Clicks, CostPerConversion, Conversions FROM   GENDER_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+ get_date_intervals(review_days); 
    var report = AdsApp.report(query);


    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      buffer[row['Criteria']] =     
      {
        'clicks' : parseFloat(buffer[row['Criteria']].clicks) + parseFloat(row['Clicks']),
        'conversion' : parseFloat(buffer[row['Criteria']].conversion) + parseFloat(row['Conversions']),
        'costperconversion' : parseFloat(buffer[row['Criteria']].costperconversion) + parseFloat(row['CostPerConversion'])
      }
    }
  for(gen in buffer)
  {
    result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : gen,
          'clicks' : buffer[gen].clicks.toFixed(2),
          'conversion' : buffer[gen].conversion.toFixed(2),
          'costperconversion' : buffer[gen].costperconversion.toFixed(2)
        }
      x++;    
  }
  
    
  
    data.date = date;
    data.type = type;
    data.result = result;
  return data;  
}

function agerange_performance(click, cost_conversion, review_days)
{
    var data = {};
    var result = {};
    var type = 'Age Range';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
    var buffer = {};
    buffer['AGE_RANGE_18_24'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }
  
    buffer['AGE_RANGE_25_34'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }

    buffer['AGE_RANGE_35_44'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }
  buffer['AGE_RANGE_45_54'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }
  buffer['AGE_RANGE_55_64'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }
  buffer['AGE_RANGE_65_UP'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }
  buffer['AGE_RANGE_UNDETERMINED'] =     
      {
        'clicks' : 0,
        'conversion' : 0,
        'costperconversion' : 0
      }
  
    var query = "SELECT Criteria, Clicks, CostPerConversion, Conversions FROM   AGE_RANGE_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days); 
    var report = AdsApp.report(query);
  
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      buffer[row['Criteria']] =     
      {
        'clicks' : parseFloat(buffer[row['Criteria']].clicks) + parseFloat(row['Clicks']),
        'conversion' : parseFloat(buffer[row['Criteria']].conversion) + parseFloat(row['Conversions']),
        'costperconversion' : parseFloat(buffer[row['Criteria']].costperconversion) + parseFloat(row['CostPerConversion'])
      }
    }
  
    var query = "SELECT Criteria, Clicks, CostPerConversion, Conversions FROM   AGE_RANGE_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+ get_date_intervals(review_days); 
    var report = AdsApp.report(query);
  
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      buffer[row['Criteria']] =     
      {
        'clicks' : parseFloat(buffer[row['Criteria']].clicks) + parseFloat(row['Clicks']),
        'conversion' : parseFloat(buffer[row['Criteria']].conversion) + parseFloat(row['Conversions']),
        'costperconversion' : parseFloat(buffer[row['Criteria']].costperconversion) + parseFloat(row['CostPerConversion'])
      }
    }
  
   for(gen in buffer)
  {
    result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : gen,
          'clicks' : buffer[gen].clicks.toFixed(2),
          'conversion' : buffer[gen].conversion.toFixed(2),
          'costperconversion' : buffer[gen].costperconversion.toFixed(2)
        }
      x++;    
  }
  
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function audience_performance(click, cost_conversion, review_days)
{
    var data = {};
    var result = {};
    var type = 'Audience';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
  
    var query = "SELECT Criteria, Clicks, CostPerConversion, Conversions,Id FROM   AUDIENCE_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days); 
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['Criteria'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    } 
  
    var query = "SELECT Criteria, Clicks, CostPerConversion, Conversions,Id FROM   AUDIENCE_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+ get_date_intervals(review_days); 
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['Criteria'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    } 
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function hourofday_performance(click, cost_conversion, review_days)
{  
    var data = {};
    var result = {};
    var type = 'Hour of Day';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
  
    var query = "SELECT HourOfDay, Clicks, CostPerConversion, Conversions FROM   ACCOUNT_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days);
    
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
   
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['HourOfDay'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }  
  
    var query = "SELECT HourOfDay, Clicks, CostPerConversion, Conversions FROM   ACCOUNT_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+ get_date_intervals(review_days);
    
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
   
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['HourOfDay'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }  
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}

function dayofweek_performance(click, cost_conversion, review_days)
{      
    var data = {};
    var result = {};
    var type = 'Day of Week';
    var date = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
    var x = 0;
  
    var query = "SELECT DayOfWeek, Clicks, CostPerConversion, Conversions FROM   ACCOUNT_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND CostPerConversion>"+cost_conversion+ get_date_intervals(review_days);
    
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
   
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['DayOfWeek'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }
  
    var query = "SELECT DayOfWeek, Clicks, CostPerConversion, Conversions FROM   ACCOUNT_PERFORMANCE_REPORT WHERE  Clicks>"+click+" AND Conversions=0"+get_date_intervals(review_days);
    
    var report = AdsApp.report(query);
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
   
      result[x] = 
        {
          'date' : date,
          'type' : type,
          'element' : row['DayOfWeek'],
          'clicks' : row['Clicks'],
          'conversion' : row['Conversions'],
          'costperconversion' : row['CostPerConversion']
        }
      x++;
    }
    data.date = date;
    data.type = type;
    data.result = result;
  return data;
}
