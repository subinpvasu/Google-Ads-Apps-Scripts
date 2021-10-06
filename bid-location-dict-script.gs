function main() {
    var data = {
    'user_name': 'subin@notus.ai',
    'password': 't_pass_google'
          };

    var options = {
    'method' : 'post',
    'contentType': 'application/json',  
    'payload' : JSON.stringify(data)
          };

    var response = UrlFetchApp.fetch("https://72oj4k5xhc.execute-api.us-east-1.amazonaws.com/dev/token", options);
    var obj = JSON.parse(response);  

    var Campoptions = {
    'method' : 'get',
    'contentType': 'application/json',    
    'headers':{'Authorization' : 'Bearer '+obj.AuthenticationResult.IdToken},    
    'redirect': 'follow',
    'muteHttpExceptions': true
        };
  
    var campresponse = UrlFetchApp.fetch("https://ktryyavzm1.execute-api.us-east-1.amazonaws.com/dev/campaigns/googlemodifers",Campoptions);
    var cmp = JSON.parse(campresponse);  
    var campaignid;
  
    for (i in cmp)
      {    
        //var cmpid = cmp[i].campaign_id=='1234.0'?11212935510:11212935507;    
        try{
          campaignid = cmp[i].campaign_id;
            //campaignid = cmpid;
          var campaignIterator = AdsApp.campaigns()
          .withCondition('Id = '+campaignid).get();
          if (campaignIterator.hasNext()) 
          {
            campaign = campaignIterator.next(); 
            for (l in cmp[i].bid_modifier)
            {
              stat = UpdateCampaigns(campaign,cmp[i].bid_modifier[l]);    
            }
            Logger.log("Updated Campaign : "+campaign.getName());                 
          }
          }catch(e){Logger.log(e);}
      }  
}

function UpdateCampaigns(campaign,row) {
    try{           
      campaign.addLocation(String(row['gid']), row['bm']);
      return 1;  
    }catch(e){return 0;}
}