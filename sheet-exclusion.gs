//Exclusively for campaign : The Oath of Manifestation Topics GENERAL TARGETING 

function main() {
  //PROVIDE THE SHEET URL FROM ADDRESS BAR
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/13jwArBHt_Oll6E2UNOSZg6BOgL_HNrtdRTndjG54AQ4/edit#gid=1734635281');  
  var sheet = spreadsheet.getSheetByName('Automatic placements report');//REPLACE SHEET NAME
  var data = sheet.getSheetValues(4, 1, -1, -1);  
  var urls_impr = [];
  var urls_view = [];
  //getAdGroupByName();
  
  data.forEach(function(row) {          
     
   
    if(parseInt(row[7])==0)
    {      
      urls_impr.push(row[1]);        
    }
     if(parseInt(row[4])>25 && parseInt(row[10])==0)
     {
       urls_view.push(row[1]);   
       
     }   
    Logger.log("Name : "+row[3]);
    getAdGroupByName(row[3]);
    
   
  });
  urls_impr = urls_impr.filter(onlyUnique);
  urls_view = urls_view.filter(onlyUnique);
  //ExcludeURL(sheet,urls_impr);
 // ExcludeURL(sheet,urls_view);  
 // Logger.log(urls_view.length);
  Logger.log(urls_impr.length);
  
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function ExcludeURL(sheet,urls, adgs) {
  try{
  var campaignIterator = AdsApp.videoCampaigns()
      .withCondition('Id = 11676645805')
      .get();
  if (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();  
    Logger.log("Updated Campaign : "+campaign.getName());
  }
    var begin = 4;
    for(var i=0; i<urls.length;i++)
    {
  // campaign.videoTargeting().newPlacementBuilder().withUrl(urls[i]).exclude();  
      var arr = urls[i].split("/");
      var channelId = arr[arr.length-1];
      campaign.videoTargeting().newYouTubeChannelBuilder().withChannelId(channelId).exclude();
      
    }    
  
  }catch(e){return 0;}
}

function getAdGroupByName(name) {
  var adGroupIterator = AdsApp.videoAdGroups()
      .withCondition('Name = "'+name+'"')
      .get();
  if (adGroupIterator.hasNext()) {
    var adGroup = adGroupIterator.next();
    Logger.log('AdGroup Name: ' + adGroup.getName());
    Logger.log('Enabled: ' + adGroup.isEnabled());
  }
}


