function main() {
  //PROVIDE THE SHEET URL FROM ADDRESS BAR
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1hz7cAv2n8qOND66erOXI30EPlMPLQd0U3CzTsz5U-Zw/edit');  
  var sheet = spreadsheet.getSheetByName('Sheet2');//REPLACE SHEET NAME
  var data = sheet.getSheetValues(2, 1, -1, -1);  
  var begin = 2;
  var stat = 0;
  data.forEach(function(row) {      
   if(String(row[3])!=1)
   {
   stat = UpdateCampaigns(row);     
   }
    
    sheet.getRange(begin,4).setValue(stat);      
    begin++; 
    
  });
  
}

function UpdateCampaigns(row) {
  try{
  var campaignIterator = AdsApp.campaigns()
      .withCondition('Id = '+String(row[0]))
      .get();
  if (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();    
    Logger.log("Updated Campaign : "+campaign.getName());
    
    campaign.addLocation(String(row[1]), row[2]);
    return 1;
  }
  }catch(e){return 0;}
}

