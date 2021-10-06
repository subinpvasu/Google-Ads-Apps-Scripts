function main()
{
  var ssId = 'ID'
  SpreadsheetApp.openById(ssId)
  var ss = SpreadsheetApp.openById(ssId)

  var now = new Date()
  var today = Utilities.formatDate(new Date(now.getTime() - 1000 * 60 * 60 * 24), "GMT+1", "yyyy-MM-dd")
  var accountName = AdsApp.currentAccount().getName()
  var accountId = AdsApp.currentAccount().getCustomerId()
  var email_id = ss.getRangeByName('emailid').getValue()

  //Basic variables
  var report_path = ss.getRangeByName('vd_report_folder').getValue()
  var report_name = ss.getRangeByName('vd_sheet_name').getValue()
  var sheet = latest_file(report_path);
  var list_name = 'channel-list';

  //video campaigns values
  var vd_impr_status = ss.getRangeByName('vd_impression_status').getValue()
  var vd_impr_operator = ss.getRangeByName('vd_impression_operator').getValue()
  var vd_impr_value = ss.getRangeByName('vd_impression_value').getValue()

  var vd_view_status = ss.getRangeByName('vd_views_status').getValue()
  var vd_view_operator = ss.getRangeByName('vd_views_operator').getValue()
  var vd_view_value = ss.getRangeByName('vd_views_value').getValue()

  var vd_viewrate_status = ss.getRangeByName('vd_viewrate_status').getValue()
  var vd_viewrate_operator = ss.getRangeByName('vd_viewrate_operator').getValue()
  var vd_viewrate_value = ss.getRangeByName('vd_viewrate_value').getValue()

  var vd_conversion_status = ss.getRangeByName('vd_conversion_status').getValue()
  var vd_conversion_operator = ss.getRangeByName('vd_conversion_operator').getValue()
  var vd_conversion_value = ss.getRangeByName('vd_conversion_value').getValue()

  var vd_cpa_status = ss.getRangeByName('vd_cpa_status').getValue()
  var vd_cpa_operator = ss.getRangeByName('vd_cpa_operator').getValue()
  var vd_cpa_value = ss.getRangeByName('vd_cpa_value').getValue()

  var vd_conversion_rate_status = ss.getRangeByName('vd_conversion_rate_status').getValue()
  var vd_conversion_rate_operator = ss.getRangeByName('vd_conversion_rate_operator').getValue()
  var vd_conversion_rate_value = ss.getRangeByName('vd_conversion_rate_value').getValue()

  var vd_view_through_status = ss.getRangeByName('vd_view_through_status').getValue()
  var vd_view_through_operator = ss.getRangeByName('vd_view_through_operator').getValue()
  var vd_view_through_value = ss.getRangeByName('vd_view_through_value').getValue()
  

  var spreadsheet_sub = SpreadsheetApp.openByUrl(sheet[0].link);
  var sheet_sub = spreadsheet_sub.getSheetByName(report_name);
  var range = sheet_sub.getActiveRange();
  var data = sheet_sub.getSheetValues(4, 1, -1, -1);
  var header = sheet_sub.getSheetValues(3, 1, 1, -1);
  
  //add sheet for values
  var pro_sheet = spreadsheet_sub.getSheetByName('TBP');
  if(pro_sheet == null){
    pro_sheet = spreadsheet_sub.insertSheet();
    pro_sheet.setName('TBP');
    pro_sheet.appendRow(header[0]);
  }else{
    //newSheet.clearContents();
    //newSheet.clearFormats();
    pro_sheet.clear();
    pro_sheet.appendRow(header[0]);
  }

  
 
  var key_placement = 0;
  var key_campaign = 0;
  var key_impressions = 0;
  var key_video_views = 0;
  var key_view_rate = 0;
  var key_conversions = 0;
  var key_conv_rate = 0;
  var key_view_conv = 0;
  
  header.forEach(function(head) {    
    try{
     key_placement = head.indexOf("Placement url");
     key_campaign = head.indexOf("Campaign");
     key_impressions = head.indexOf("Impr.");
     key_video_views = head.indexOf("Views");
     key_view_rate = head.indexOf("View rate");  
     key_conversions = head.indexOf("Conversions");
     key_conv_rate = head.indexOf("Conv. rate");
     key_view_conv = head.indexOf("View-through conv.");
    }catch(e)
    {
      Logger.log(e);
    }
  });

  var operators = {
    '<': function(a, b) { return a < b },
    '>': function(a, b) { return a > b },
    '<=': function(a, b) { return a <= b },
    '>=': function(a, b) { return a >= b },
};

  var status = {
    'Include': true,
    'Exclude': false,
  };

  var flag_impr = status[vd_impr_status];
  var flag_view = status[vd_view_status];
  var flag_vrte = status[vd_viewrate_status];
  var flag_conv = status[vd_conversion_status];
  var flag_ccpa = status[vd_cpa_status];
  var flag_crte = status[vd_conversion_rate_status];
  var flag_vtcn = status[vd_view_through_status];

  
  
  data.forEach(function(row) {
      var val_check = 0;
      var con_check = 0;
    if(row[2]=='YouTube channel')
       {
           if(flag_impr)
             {
                con_check++;
                if(operators[vd_impr_operator](row[key_impressions], vd_impr_value))
                {   
                    val_check++;
                }
             }
         
          if(flag_view)
             {
                con_check++;
                if(operators[vd_view_operator](row[key_video_views], vd_view_value))
                {
                    val_check++;
                }
             }

         if(flag_vrte)
             {
                con_check++;
                if(operators[vd_viewrate_operator](row[key_view_rate], vd_viewrate_value))
                {
                    val_check++;
                }
             }

         if(flag_conv)
             {
                con_check++;
                if(operators[vd_conversion_operator](row[key_conversions], vd_conversion_value))
                {
                    val_check++;
                }
             }

         if(flag_crte)
             {
                con_check++;
                if(operators[vd_conversion_rate_operator](row[key_conv_rate], vd_conversion_rate_value))
                {
                    val_check++;
                }
             }

         if(flag_vtcn)
             {
                con_check++;
                if(operators[vd_view_through_operator](row[key_view_conv], vd_view_through_value))
                {
                    val_check++;
                }
             }
            if(con_check==val_check)
            {
                pro_sheet.appendRow(row);
            }
       }
  });
  
  ExcludeURL(sheet[0].link, email_id);
}



function ExcludeURL(url, email) {
  
  var spreadsheet_sub = SpreadsheetApp.openByUrl(url);
  var sheet_sub = spreadsheet_sub.getSheetByName('TBP');  
  sheet_sub.sort(4, true);
  var data = sheet_sub.getSheetValues(2, 1, -1, -1);
  
  try{
    var name  = '';
    var campaign;
    var rid = 2;
    var cid = sheet_sub.getLastColumn();
    var succeeded = 0;
     data.forEach(function(row) {
       var arr = row[2].split("/");
       var channelId = arr[arr.length-1];
      if(row[3]==name)
       {    
            var ret = campaign.videoTargeting().newYouTubeChannelBuilder().withChannelId(channelId).exclude();                              
            var new_range = sheet_sub.getRange(rid,cid+1);
            if(ret.isSuccessful())
            {
                new_range.setValue('Success');
                new_range.setBackground('green');
                succeeded++;
            }
            else
            {
                new_range.setValue('Error :'+ret.getErrors());
                new_range.setBackground('red');
            }
            rid++;
       }
       else
       {         
          name = row[3];
          var campaignIterator = AdsApp.videoCampaigns().withCondition('Name = "'+name+'"').get();
          campaign = campaignIterator.next();  
          var ret = campaign.videoTargeting().newYouTubeChannelBuilder().withChannelId(channelId).exclude();                
          var new_range = sheet_sub.getRange(rid,cid+1);
            if(ret.isSuccessful())
            {
                new_range.setValue('Success');
                new_range.setBackground('green');
                succeeded++;
            }
            else
            {
                new_range.setValue('Error :'+ret.getErrors());
                new_range.setBackground('red');
            }
            rid++;
       }
     
                  });
  }catch(e){
    Logger.log(e);
   }
  sheet_sub.setName('Processed Rows');
  send_report(email, url, rid-2, succeeded);
}

function latest_file(path)
{
  var folders = DriveApp.getFoldersByName(path);
  const today = new Date();
  const day = 1000 * 60 * 60 * 24;  
  const present = new Date(today.getTime() - (day));
  var sheetdata = [];
    while (folders.hasNext()) {
        var folder = folders.next();
        var files  = folder.getFiles();
        while (files.hasNext()) {
        file = files.next();
        var date = new Date(file.getDateCreated());          
            if(present.getDay()===date.getDay() && present.getMonth()===date.getMonth()  && present.getYear()===date.getYear())
            {
            var url = file.getUrl();
            var id = file.getId();            
          }
        }
   }
  Logger.log('Started.');
  Logger.log(url);
  sheetdata.push({link:url});
  sheetdata.push({sheetid:id});
  return sheetdata;
}


function send_report(mail, url, total, success){
  const today = new Date();
  const email = mail;
  const subject = 'Automatic Placement Exclusion Report.';
  const html = '<h1>Hi</h1><h3>Following are the details of the placement exclusion script execution : </h3><hr/><table><tr><th>Date of Execution</th><th>'+today.getDate()+'/'+(parseInt(today.getMonth()+1))+'/'+today.getFullYear()+'</th></tr><tr><th>Number of Rows Processed</th><th>'+total+'</th></tr><tr><th>Number of rows Succeeded</th><th>'+success+'</th></tr></table><p></p><a href="'+url+'">Please find the attachemnt as the processed sheet.</a>';
  const opts = {
    name:'Automatic Placement Exclusion Report',
    cc:'developer.subinpvasu@gmail.com',
    noReply: true,
    replyTo: 'manager.subinpvasu@gmail.com',
    htmlBody:html,
  
  };
  MailApp.sendEmail(email,subject,'',opts);  
  Logger.log('Finished.');
}


