function main() {
  //PROVIDE THE SHEET URL FROM ADDRESS BAR
  var spreadsheet = SpreadsheetApp.openByUrl('URL');  
  var sheet = spreadsheet.getSheetByName('budget');//REPLACE SHEET NAME
  var data = sheet.getSheetValues(2, 1, -1, -1);  
  var begin = 2;
  var stat = 0;
  var campaignid;
  var campaign;
  data.forEach(function(row) { 
    if(String(row[2])!=1)
    {
      
        try{
          campaignid = String(row[0]);
          var campaignIterator = AdsApp.campaigns()
          .withCondition('Id = '+campaignid).get();
          if (campaignIterator.hasNext()) 
          {
            campaign = campaignIterator.next();  
            campaign.getBudget().setAmount(row[1]);

            stat = UpdateCampaigns(campaign,row);     
          }
          }catch(e){stat = 0;}
               
   }
    sheet.getRange(begin,3).setValue(stat);      
    begin++;
  });
  
}