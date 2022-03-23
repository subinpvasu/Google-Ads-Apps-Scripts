function main() {
  
  var ssId = '1iXfGSqK2xJU1FF0ytBnn3VpvjonHqjyt8Yihw267nhs' 
  
  
  
  var scriptVersion = ''
  DriveApp.getStorageUsed()
  MailApp.getRemainingDailyQuota()
  SpreadsheetApp.openById(ssId)
  
  
  var ss = SpreadsheetApp.openById(ssId)
  //IDAR
  
  ss.setSpreadsheetLocale('en-US')
  var eventReportingToExcelinPpcComAllowed = ss.getRangeByName('reporting_allowed').getValue()
  var payload = {
    'v': '1',
    'tid': 'UA-69459605-1',
    't': 'event',
    'cid' : Utilities.getUuid(),
    'z' : Math.floor(Math.random() * 10E7),
    'ds' : 'google_ads_script',
    'cn' : 'script-bad_placement_cleaner',
    'cs' : 'google_ads_script',
    'cm' : 'google_ads_script',
    'ec' : 'script_run',
    'ea' : 'script_run_started',
    'el' : 'script-bad_placement_cleaner'
    };
  
  var options = {
    "method" : "post",
    "payload" : payload
   };
  
  //Send the hit to GA if allowed
  if(eventReportingToExcelinPpcComAllowed == 'YES'){UrlFetchApp.fetch("http://www.google-analytics.com/collect", options)};  

  //Date
  var now = new Date()
  var today = Utilities.formatDate(new Date(now.getTime() - 1000 * 60 * 60 * 24), "GMT+1", "yyyy-MM-dd")
        
  //Licensing magic
  var accountName = AdsApp.currentAccount().getName()
  
  //accountId
  var accountId = AdsApp.currentAccount().getCustomerId()
   
  if(typeof scriptVersion !== 'undefined')
    {var scriptVersionFinal = scriptVersion} 
    
    else {var scriptVersionFinal = 'scriptVersion variable not present'}      
  
  //Basic variables
  var forRealOrTesting = ss.getRangeByName('for_real_or_testing').getValue()
  var timeRange = ss.getRangeByName('time_range').getValue()
  var email = ss.getRangeByName('email').getValue()
  var statsFromEnabledCampaigns = ss.getRangeByName('stats_from_enabled_campaigns').getValue()
  var minimumImpressions =  ss.getRangeByName('minimum_impressions').getValue()
  var loggerSetup =  ss.getRangeByName('logger_setup').getValue()
  var developerMode = ss.getRangeByName('developer_mode').getValue()

  var domainEndingsListName = ss.getRangeByName('domain_endings_negative_placement_list_name').getValue()  
  var displayListName = ss.getRangeByName('display_negative_placement_list_name').getValue()  
  var videoListName = ss.getRangeByName('video_negative_placement_list_name').getValue()   
  var appListName = ss.getRangeByName('app_negative_placement_list_name').getValue()   

  var domainEndings = ss.getRangeByName('domain_endings').getValue()
    
  var displayQueryAggregation = ss.getRangeByName('display_query_aggregation').getValue()
  var displayQueryFiltering = ss.getRangeByName('display_query_filtering').getValue()
  
  var videoQueryAggregation = ss.getRangeByName('video_query_aggregation').getValue()
  var videoQueryFiltering = ss.getRangeByName('video_query_filtering').getValue()  
  var videoBumperExclusion = ss.getRangeByName('video_bumper_exclusion').getValue()
  var videoBumperString = ss.getRangeByName('video_bumper_string').getValue()
  
  var appsQueryAggregation = ss.getRangeByName('apps_query_aggregation').getValue()
  var appsQueryFiltering = ss.getRangeByName('apps_query_filtering').getValue() 
  var appsMobileUrlFormula = ss.getRangeByName('apps_mobile_urls_formula').getValue()
  
  //Let's define sheet names
  var sheetNameCampaignList = 'script_campaign_list_from_google_ads'
  
  var sheetNameDomainEndingsExport = 'script_domain_endings_bad_placements'

  var sheetNameReportExportDisplay = 'script_display_export_from_gads'
  var sheetNameReportExportVideo = 'script_video_export_from_gads'
  var sheetNameReportExportApps = 'script_apps_export_from_gads'
    
  var displayAggregatedPlacementData = 'script_display_agg_placement_data'
  var displayFilteredBadPlacements = 'script_display_filtered_bad_placements'
  var displayListOfDisplayCampaigns = 'script_display_list_of_display_campaigns'
  
  var videoAggregatedPlacementData = 'script_video_agg_placement_data'
  var videoFilteredBadPlacements = 'script_video_filtered_bad_placements'

  var appsAggregatedPlacementData = 'script_apps_agg_placement_data'
  var appsFilteredBadPlacements = 'script_apps_filtered_bad_placements'
  
  //Module status
  var domainEndingsModuleEnabled =  ss.getRangeByName('domain_endings_enabled').getValue()
  var displayModuleEnabled =  ss.getRangeByName('display_module_enabled').getValue()
  var displayAnonymousPlacementEnabled =  ss.getRangeByName('display_anonymous_yes_or_no').getValue()
  
  var videoModuleEnabled =  ss.getRangeByName('video_module_enabled').getValue()
  var appsModuleEnabled =  ss.getRangeByName('apps_module_enabled').getValue()
  
  //Let's get list of named ranges
  var namedRanges = ss.getNamedRanges()
  var listOfNamedRanges = []
  
  for(i=0;i<namedRanges.length;i++){
    var namedRange = namedRanges[i].getName()
    listOfNamedRanges.push(namedRange)
  }
    
  if(loggerSetup == 'HEAVY'){Logger.log('List of named ranges: '+listOfNamedRanges)}  
  
  
  var sheets = ss.getSheets()
  var sheetNameStartsWith = new RegExp('^script_')
  var sheetNames = []

  for(i=0;i<sheets.length;i++){
    var sheetName = sheets[i].getName()  
    
    if(sheetName.toString().match(sheetNameStartsWith)!==null){
      sheetNames.push(sheetName)
    }
  }

  Logger.log('List of existing helper sheets: '+sheetNames)
    
  
  for(i=0;i<sheetNames.length;i++){
    ss.deleteSheet(ss.getSheetByName(sheetNames[i]))
    } 

  ss.setActiveSheet(ss.getSheetByName('formula_config_do_not_touch'))
  ss.moveActiveSheet(2)
                                                                          
  
  ss.insertSheet(sheetNameCampaignList)
  var sheetNameCampaignListSheet = ss.getSheetByName(sheetNameCampaignList)
  sheetNameCampaignListSheet.deleteColumns(1,25)   
  sheetNameCampaignListSheet.setTabColor('yellow')

  ss.insertSheet(sheetNameDomainEndingsExport)
  var sheetNameDomainEndingsExportSheet = ss.getSheetByName(sheetNameDomainEndingsExport)
  sheetNameDomainEndingsExportSheet.deleteColumns(1,25)   
  sheetNameDomainEndingsExportSheet.setTabColor('blue')
  sheetNameDomainEndingsExportSheet.deleteRows(1,999)
  sheetNameDomainEndingsExportSheet.getRange('A1').setValue('Placements to exclude based on domain endings')
  
  ss.insertSheet(sheetNameReportExportDisplay)
  var sheetNameReportExportSheetDisplay = ss.getSheetByName(sheetNameReportExportDisplay)
  sheetNameReportExportSheetDisplay.deleteColumns(1,25) 
  sheetNameReportExportSheetDisplay.setTabColor('black')
  
  ss.insertSheet(displayAggregatedPlacementData)
  var displayAggregatedPlacementDataSheet = ss.getSheetByName(displayAggregatedPlacementData)
  displayAggregatedPlacementDataSheet.deleteColumns(14,12)
  displayAggregatedPlacementDataSheet.setTabColor('black')
  displayAggregatedPlacementDataSheet.deleteRows(1,999)
                                                                          
  ss.insertSheet(displayFilteredBadPlacements)
  var displayFilteredBadPlacementsSheet = ss.getSheetByName(displayFilteredBadPlacements)
  displayFilteredBadPlacementsSheet.deleteColumns(14,12)
  displayFilteredBadPlacementsSheet.setTabColor('black')
  displayFilteredBadPlacementsSheet.deleteRows(1,990)
  
  ss.insertSheet(sheetNameReportExportVideo)
  var sheetNameReportExportSheetVideo = ss.getSheetByName(sheetNameReportExportVideo)
  sheetNameReportExportSheetVideo.deleteColumns(1,25) 
  sheetNameReportExportSheetVideo.setTabColor('orange')  
  
  ss.insertSheet(videoAggregatedPlacementData)
  var videoAggregatedPlacementDataSheet = ss.getSheetByName(videoAggregatedPlacementData)
  videoAggregatedPlacementDataSheet.deleteColumns(14,12)  
  videoAggregatedPlacementDataSheet.setTabColor('orange')
  videoAggregatedPlacementDataSheet.deleteRows(1,990)
  
  ss.insertSheet(videoFilteredBadPlacements)
  var videoFilteredBadPlacementsSheet = ss.getSheetByName(videoFilteredBadPlacements)
  videoFilteredBadPlacementsSheet.deleteColumns(14,12)
  videoFilteredBadPlacementsSheet.setTabColor('orange')
  videoFilteredBadPlacementsSheet.deleteRows(1,990)
  
  ss.insertSheet(sheetNameReportExportApps)
  var sheetNameReportExportSheetApps = ss.getSheetByName(sheetNameReportExportApps)
  sheetNameReportExportSheetApps.deleteColumns(1,25)   
  sheetNameReportExportSheetApps.setTabColor('purple')    
  
  ss.insertSheet(appsAggregatedPlacementData)
  var appsAggregatedPlacementDataSheet = ss.getSheetByName(appsAggregatedPlacementData)
  appsAggregatedPlacementDataSheet.deleteColumns(14,12)
  appsAggregatedPlacementDataSheet.setTabColor('purple')
  appsAggregatedPlacementDataSheet.deleteRows(1,990)

  ss.insertSheet(appsFilteredBadPlacements)
  var appsFilteredBadPlacementsSheet = ss.getSheetByName(appsFilteredBadPlacements)
  appsFilteredBadPlacementsSheet.deleteColumns(15,11)  
  appsFilteredBadPlacementsSheet.setTabColor('purple')
  appsFilteredBadPlacementsSheet.deleteRows(1,990)
  
  
  if(domainEndings.length>0 && domainEndingsModuleEnabled == 'YES'){
    Logger.log('')
    Logger.log('***Running Domain Endings module***')
    Logger.log('')
    
    var domainEndingsAsList = domainEndings.split('|')
    var domainEndingsAsListWithRegex = []

    for(i=0;i<domainEndingsAsList.length;i++){
      var endingWithRegex = domainEndingsAsList[i].trim().concat('$')
      domainEndingsAsListWithRegex.push(endingWithRegex)
    }

    var domainEndingsAsStringtWithRegex = domainEndingsAsListWithRegex.join('|').replace(/\./g,'\\.')
    Logger.log('Domain endings with regex: '+domainEndingsAsStringtWithRegex)  
  

    var placementsToCheck = []
    var placementsToBeExcludedBasedOnEndings = []
    
    var queryDomainEndings =  'SELECT Criteria '+ 
                              'FROM PLACEMENT_PERFORMANCE_REPORT ' +
                              'WHERE AdNetworkType1 IN [CONTENT, YOUTUBE_SEARCH, YOUTUBE_WATCH, MIXED] AND Impressions > 0 ' +
                              'DURING LAST_30_DAYS' 

    Logger.log('Running report for domain endings check.')
    var domainEndingsReport = AdsApp.report(queryDomainEndings)
    
    var rows = domainEndingsReport.rows()
    
    while(rows.hasNext()){
      var eachRow = rows.next()
      var placement = eachRow['Criteria'] 

      placementsToCheck.push(placement)
      
    }
        
    var reg = new RegExp(domainEndingsAsStringtWithRegex)
    
    for(i=0;i<placementsToCheck.length;i++){
      //This is the check for "domain ends with"
      if(placementsToCheck[i].toString().match(reg)!==null){
        placementsToBeExcludedBasedOnEndings.push(placementsToCheck[i])
        if(loggerSetup == 'HEAVY'){Logger.log(placementsToCheck[i] + ' added to excluded placements - domain ending matched.')}
      }
    }
  
  var placementsToBeExcludedBasedOnEndingsUnique = placementsToBeExcludedBasedOnEndings.sort().filter(function(item, index){
      return placementsToBeExcludedBasedOnEndings.indexOf(item) >= index;
    })  
    
  var countOfPlacementsToBeExcludeDomainEndings = placementsToBeExcludedBasedOnEndingsUnique.length  
  Logger.log('countOfPlacementsToExcludeDomainEndings: '+ placementsToBeExcludedBasedOnEndingsUnique.length)
  Logger.log('These are the placements to exclude based on domain endings: '+ placementsToBeExcludedBasedOnEndingsUnique)  
  Logger.log('')
  Logger.log('***I\'m done with identification of bad placements in Domain Endings module***')
  Logger.log('')    
    
  }


  
  var queryCampaignList =
       'SELECT AccountDescriptiveName, AdvertisingChannelType, AdNetworkType1, AdNetworkType2, CampaignName, CampaignStatus, Impressions, ActiveViewImpressions, VideoViews, Clicks, Cost, ViewThroughConversions, Conversions '+ 
       'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
       'WHERE Impressions > 0'
 
  Logger.log(queryCampaignList)
  var report = AdsApp.report(queryCampaignList)
  report.exportToSheet(sheetNameCampaignListSheet)    
  
 
  var campaignNames = sheetNameCampaignListSheet.getRange('B2:E').getValues()
  Logger.log('Campaign names: '+campaignNames)
  
  var lastRowCampaignNames = sheetNameCampaignListSheet.getLastRow()-1 //minus one because the first row is the header
  Logger.log('Count of campaign names: '+lastRowCampaignNames)
  
  var displayCampaignNames = []
 
  for(z=0;z<lastRowCampaignNames;z++){
    var advertisingChannelType = campaignNames[z][0]
    //Logger.log(campaignNames[z][0])
    var campaignName = campaignNames[z][3]
    
    if(advertisingChannelType == 'Display'){displayCampaignNames.push(campaignName)}
  }
    
  Logger.log('List of Display campaigns: '+ displayCampaignNames)
  
  var videoCampaignNames = []
  
  for(t=0;t<lastRowCampaignNames;t++){
    var advertisingChannelType = campaignNames[t][0]
    var campaignName = campaignNames[t][3]
    
    if(advertisingChannelType == 'Video'){videoCampaignNames.push(campaignName)}
  }
    
  Logger.log('List of Video campaigns: '+ videoCampaignNames)  
    
  
  var columnSet = 'SELECT AccountDescriptiveName, AdNetworkType1, CampaignName, AdGroupName, Criteria, Impressions, ActiveViewImpressions, VideoViews, Clicks, Cost, ViewThroughConversions, Conversions '
  
  if(displayModuleEnabled == 'YES' || videoModuleEnabled == 'YES' || appsModuleEnabled == 'YES'){   

    if(statsFromEnabledCampaigns=='Get stats only from enabled campaigns')
      {var whereCondition = "CampaignName IN ['"+displayCampaignNames.join('\',\'')+"'] AND CampaignStatus = ENABLED AND Impressions >= " + minimumImpressions} 
       
    else
      {var whereCondition = "CampaignName IN ['"+displayCampaignNames.join('\',\'')+"'] AND Impressions >= " + minimumImpressions} 
    
    if(timeRange == 'ALL_TIME')
      {
      var queryDisplay =
          columnSet + 
          'FROM PLACEMENT_PERFORMANCE_REPORT ' +
          'WHERE AdNetworkType1 IN [CONTENT, YOUTUBE_SEARCH, YOUTUBE_WATCH, MIXED] AND ' + whereCondition
      }
    
    else
      {
      var queryDisplay =
          columnSet +
          'FROM PLACEMENT_PERFORMANCE_REPORT ' +
          'WHERE AdNetworkType1 IN [CONTENT, YOUTUBE_SEARCH, YOUTUBE_WATCH, MIXED] AND ' + whereCondition + ' ' +
          'DURING '+timeRange
      } 
    
    Logger.log('Display query: '+queryDisplay)
    if(displayCampaignNames.length>0){  
      var reportDisplay = AdsApp.report(queryDisplay)
      reportDisplay.exportToSheet(sheetNameReportExportSheetDisplay)
    }
    else 
      {Logger.log('No display campaigns in the account - display query will not run.')}  
    
    
    Logger.log('Stats setup: '+statsFromEnabledCampaigns +' | Bumper exclusion: '+videoBumperExclusion+'| String: '+videoBumperString + ' | Bumper string length: '+videoBumperString.trim.length)
    
    if(statsFromEnabledCampaigns=='Get stats only from enabled campaigns' && videoBumperExclusion == 'YES' && videoBumperString.length>0)
      {var whereCondition = "CampaignName IN ['"+videoCampaignNames.join('\',\'')+"'] AND CampaignName DOES_NOT_CONTAIN '"+videoBumperString+"' AND CampaignStatus = ENABLED AND Impressions >= " + minimumImpressions}
    
    else if(statsFromEnabledCampaigns=='Get stats even from paused campaigns' && videoBumperExclusion == 'YES' && videoBumperString.length>0)
      {var whereCondition = "CampaignName IN ['"+videoCampaignNames.join('\',\'')+"'] AND CampaignName DOES_NOT_CONTAIN '"+videoBumperString+"' AND Impressions >= " + minimumImpressions}
    
    else if(statsFromEnabledCampaigns=='Get stats only from enabled campaigns')
      {var whereCondition = "CampaignName IN ['"+videoCampaignNames.join('\',\'')+"'] AND CampaignStatus = ENABLED AND Impressions >= " + minimumImpressions} 
       
    else
      {var whereCondition = "CampaignName IN ['"+videoCampaignNames.join('\',\'')+"'] AND Impressions >= " + minimumImpressions} 
    
    if(timeRange == 'ALL_TIME')
      {
      var queryVideo =
          columnSet + 
          'FROM PLACEMENT_PERFORMANCE_REPORT ' +
          'WHERE AdNetworkType1 IN [CONTENT, YOUTUBE_SEARCH, YOUTUBE_WATCH, MIXED] AND ' + whereCondition
      }
    
    else
      {
      var queryVideo =
          columnSet +
          'FROM PLACEMENT_PERFORMANCE_REPORT ' +
          'WHERE AdNetworkType1 IN [CONTENT, YOUTUBE_SEARCH, YOUTUBE_WATCH, MIXED] AND ' + whereCondition + ' ' +
          'DURING '+timeRange
      } 
    
    Logger.log('Video query: '+queryVideo)
    if(videoCampaignNames.length>0){  
      var reportVideo = AdsApp.report(queryVideo)
      reportVideo.exportToSheet(sheetNameReportExportSheetVideo)
    }
    else 
      {Logger.log('No video campaigns in the account - video query will not run.')}
  
  }

  
  SpreadsheetApp.flush() 

  Logger.log('Line milestone 401')
  
  
  var rowAdjustment = 3
  
  
  if(displayModuleEnabled == 'YES' || appsModuleEnabled == 'YES'){
    var lastRowDisplayPerformance = ss.getSheetByName(sheetNameReportExportDisplay).getLastRow()+rowAdjustment
    Logger.log('Count of Display performance rows: '+lastRowDisplayPerformance)
    }

  if(videoModuleEnabled == 'YES' || appsModuleEnabled == 'YES'){  
    var lastRowVideoPerformance =  ss.getSheetByName(sheetNameReportExportVideo).getLastRow()+rowAdjustment
    Logger.log('Count of Video performance rows: '+lastRowVideoPerformance)
  }
  
  if(domainEndings.length>0 && domainEndingsModuleEnabled == 'YES'){
    
    sheetNameDomainEndingsExportSheet.insertRowsAfter(1,countOfPlacementsToBeExcludeDomainEndings+rowAdjustment)
  }
  
  
  if(displayModuleEnabled == 'YES' || appsModuleEnabled == 'YES'){  
    displayAggregatedPlacementDataSheet.insertRowsAfter(1,(lastRowDisplayPerformance))
    displayFilteredBadPlacementsSheet.insertRowsAfter(1,(lastRowDisplayPerformance))
  }

  Logger.log('Line milestone 431')

  if(videoModuleEnabled == 'YES' || appsModuleEnabled == 'YES'){
    videoAggregatedPlacementDataSheet.insertRowsAfter(1,(lastRowVideoPerformance))
    videoFilteredBadPlacementsSheet.insertRowsAfter(1,(lastRowVideoPerformance))
  }

  if(appsModuleEnabled == 'YES'){
    appsAggregatedPlacementDataSheet.insertRowsAfter(1,(lastRowDisplayPerformance+lastRowVideoPerformance))
    appsFilteredBadPlacementsSheet.insertRowsAfter(1,(lastRowDisplayPerformance+lastRowVideoPerformance))
  
    ss.getSheetByName(sheetNameReportExportApps).getRange('A1').setValue('AccountDescriptiveName')
    ss.getSheetByName(sheetNameReportExportApps).getRange('B1').setValue('AdNetworkType1')
    ss.getSheetByName(sheetNameReportExportApps).getRange('C1').setValue('CampaignName')
    ss.getSheetByName(sheetNameReportExportApps).getRange('D1').setValue('AdGroupName')
    ss.getSheetByName(sheetNameReportExportApps).getRange('E1').setValue('Criteria')
    ss.getSheetByName(sheetNameReportExportApps).getRange('F1').setValue('Impressions')
    ss.getSheetByName(sheetNameReportExportApps).getRange('G1').setValue('ActiveViewImpressions')
    ss.getSheetByName(sheetNameReportExportApps).getRange('H1').setValue('VideoViews')
    ss.getSheetByName(sheetNameReportExportApps).getRange('I1').setValue('Clicks')
    ss.getSheetByName(sheetNameReportExportApps).getRange('J1').setValue('Cost')
    ss.getSheetByName(sheetNameReportExportApps).getRange('K1').setValue('ViewThroughConversions')
    ss.getSheetByName(sheetNameReportExportApps).getRange('L1').setValue('Conversions')  
  
    
    SpreadsheetApp.flush()

    Logger.log('Line milestone 456')

    
    try{ss.getSheetByName(sheetNameReportExportDisplay).getRange('A2:'+lastRowDisplayPerformance).copyTo(sheetNameReportExportSheetApps.getRange('A2'), {contentsOnly:true})} catch(err){Logger.log('No display placements - nothing to copy to '+sheetNameReportExportApps+' sheet')}

    
    try{
        sheetNameReportExportSheetApps.insertRows(lastRowDisplayPerformance-rowAdjustment, 4)
        ss.getSheetByName(sheetNameReportExportVideo).getRange('A2:'+lastRowVideoPerformance).copyTo(sheetNameReportExportSheetApps.getRange('A'+(lastRowDisplayPerformance)), {contentsOnly:true})} 

    catch(err){Logger.log('No video placements - nothing to copy to '+sheetNameReportExportApps+' sheet')}  
  }
  
  
  if(domainEndings.length>0 && domainEndingsModuleEnabled == 'YES' && countOfPlacementsToBeExcludeDomainEndings>0){
    SpreadsheetApp.flush()
    
    var placementsToExcludeBasedOnEndingsAsArrayOfArrays = []
    
    for(i=0;i<placementsToBeExcludedBasedOnEndingsUnique.length;i++){
      var eachUrlAsArray = placementsToBeExcludedBasedOnEndingsUnique[i].split()
      placementsToExcludeBasedOnEndingsAsArrayOfArrays.push(eachUrlAsArray)
      }      
    
    sheetNameDomainEndingsExportSheet.getRange('A2:A'+(countOfPlacementsToBeExcludeDomainEndings+1)).setValues(placementsToExcludeBasedOnEndingsAsArrayOfArrays)
  }
  
  Logger.log('Line milestone 481')

  
  if(displayModuleEnabled == 'YES' || appsModuleEnabled == 'YES'){    
    var displayAggregationFormula = '='+displayQueryAggregation.replace(/script_display_export_from_gads/g,sheetNameReportExportDisplay)                                                                                 
    displayAggregatedPlacementDataSheet.getRange('A1').setFormula(displayAggregationFormula)
  
    var displayFilterFormula = '='+displayQueryFiltering.replace(/script_display_agg_placement_data/g,displayAggregatedPlacementData)
    displayFilteredBadPlacementsSheet.getRange('A1').setFormula(displayFilterFormula)     
  }

  if(videoModuleEnabled == 'YES' || appsModuleEnabled == 'YES'){
    var videoAggregationFormula = '='+videoQueryAggregation.replace(/script_video_export_from_gads/g,sheetNameReportExportVideo)                                                                                 
    videoAggregatedPlacementDataSheet.getRange('A1').setFormula(videoAggregationFormula) 

    var videoFilterFormula = '='+videoQueryFiltering.replace(/script_video_agg_placement_data/g,videoAggregatedPlacementData)
    videoFilteredBadPlacementsSheet.getRange('A1').setFormula(videoFilterFormula)
  }
  
  if(appsModuleEnabled == 'YES'){
    var appsAggregationFormula = '='+appsQueryAggregation.replace(/script_apps_export_from_gads/g,sheetNameReportExportApps)                                                                                 
    appsAggregatedPlacementDataSheet.getRange('A1').setFormula(appsAggregationFormula)   

    var appsFilterFormula = '='+appsQueryFiltering.replace(/script_apps_agg_placement_data/g,appsAggregatedPlacementData)
    appsFilteredBadPlacementsSheet.getRange('A1').setFormula(appsFilterFormula)    


    //Let's create the mobile URLs
    appsFilteredBadPlacementsSheet.getRange('O1').setValue('Normalized Mobile Placement URL')
    appsFilteredBadPlacementsSheet.getRange('O2').setFormula(appsMobileUrlFormula)
  }
  
  //Let's give the spreadsheet sometime to breathe after query formulas are deployed.
  SpreadsheetApp.flush()
  Utilities.sleep(10000)
  Logger.log('Line milestone 520')

  //Let's create the list of placements to negate
  //First I convert array of arrays to a string and then I make an array by splitting it by comma. Finally, I filter out blank cells since via the Boolean trick since B2:B may contain lots of blank cells.
  if(displayModuleEnabled == 'YES'){
    if(displayAnonymousPlacementEnabled == 'YES')
      {var displayBadPLacementsToAdd = displayFilteredBadPlacementsSheet.getRange('B2:B').getValues().join().split(',').filter(Boolean)}
      
    else
      {
       var displayBadPLacementsToAdd = displayFilteredBadPlacementsSheet.getRange('B2:B').getValues().join().split(',').filter(Boolean)
       for(y=0;y<displayBadPLacementsToAdd.length;y++){
         if(displayBadPLacementsToAdd[y]=='anonymous.google'){
           displayBadPLacementsToAdd.splice(y,1)
         }
        }
      }
  }
  
  if(videoModuleEnabled == 'YES'){var videoBadPLacementsToAdd = videoFilteredBadPlacementsSheet.getRange('B2:B').getValues().join().split(',').filter(Boolean)}
  if(appsModuleEnabled == 'YES'){var appsBadPLacementsToAdd = appsFilteredBadPlacementsSheet.getRange('O2:O').getValues().join().split(',').filter(Boolean)}
  
  if(displayModuleEnabled == 'YES'){Logger.log('Bad placements to add - display: '+displayBadPLacementsToAdd)}
  if(videoModuleEnabled == 'YES'){Logger.log('Bad placements to add - video: '+videoBadPLacementsToAdd)}
  if(appsModuleEnabled == 'YES'){Logger.log('Bad placements to add - apps: '+appsBadPLacementsToAdd)}
  
  //Let's do the magic in Google Ads
  //Let's create the list of excluded placements if it does not exist yet.
  
  //Domain endings first
  if(domainEndings.length>0 && domainEndingsModuleEnabled == 'YES'){
    var existingDomainEndingsExcludedPlacements = []
    if(AdsApp.excludedPlacementLists().withCondition("Name = '"+domainEndingsListName+"'").get().totalNumEntities()==1 && domainEndingsModuleEnabled == 'YES')
      {
        Logger.log('List '+domainEndingsListName+' already exists. No need to create.')

        var domainEndingsPlacementsInTheAccount = AdsApp.excludedPlacementLists().withCondition("Name = '"+domainEndingsListName+"'").get().next().excludedPlacements().get()
        while (domainEndingsPlacementsInTheAccount.hasNext()){
          var domainEndingsPlacementInTheAccount = domainEndingsPlacementsInTheAccount.next()

          var domainEndingsPlacementInTheAccountClean = domainEndingsPlacementInTheAccount.toString().replace(/SharedExcludedPlacement: /g,'').replace(/\[/g,'').replace(/\]/g,'')

          existingDomainEndingsExcludedPlacements.push(domainEndingsPlacementInTheAccountClean)
        } 
      }
    else
      {if(domainEndings.length>0 && domainEndingsModuleEnabled == 'YES'){AdsApp.newExcludedPlacementListBuilder().withName(domainEndingsListName).build()}}

    Logger.log('Excluded placements already on the list - domainEndings: '+existingDomainEndingsExcludedPlacements)   
  }
  
 
  //Display
  if(displayModuleEnabled == 'YES'){
    var existingDisplayExcludedPlacements = []

    if(AdsApp.excludedPlacementLists().withCondition("Name = '"+displayListName+"'").get().totalNumEntities()==1 && displayModuleEnabled == 'YES')
      {
        Logger.log('List '+displayListName+' already exists. No need to create.')

        var  displayPlacementsInTheAccount = AdsApp.excludedPlacementLists().withCondition("Name = '"+displayListName+"'").get().next().excludedPlacements().get()
        while (displayPlacementsInTheAccount.hasNext()){
          var displayPlacementInTheAccount = displayPlacementsInTheAccount.next()

          var displayPlacementInTheAccountClean = displayPlacementInTheAccount.toString().replace(/SharedExcludedPlacement: /g,'').replace(/\[/g,'').replace(/\]/g,'')

          existingDisplayExcludedPlacements.push(displayPlacementInTheAccountClean)
        } 
      }
    else
      {if(displayModuleEnabled == 'YES'){AdsApp.newExcludedPlacementListBuilder().withName(displayListName).build()}}

    Logger.log('Excluded placements already on the list - display: '+existingDisplayExcludedPlacements)
  }
  
  //Then video
  if(videoModuleEnabled == 'YES'){
    var existingVideoExcludedPlacements = []

    if(AdsApp.excludedPlacementLists().withCondition("Name = '"+videoListName+"'").get().totalNumEntities()==1  && videoModuleEnabled == 'YES')
      {
        Logger.log('List '+videoListName+' already exists. No need to create.')

        var  videoPlacementsInTheAccount = AdsApp.excludedPlacementLists().withCondition("Name = '"+videoListName+"'").get().next().excludedPlacements().get()
        while (videoPlacementsInTheAccount.hasNext()){
          var videoPlacementInTheAccount = videoPlacementsInTheAccount.next()

          var videoPlacementInTheAccountClean = videoPlacementInTheAccount.toString().replace(/SharedExcludedPlacement: /g,'').replace(/\[/g,'').replace(/\]/g,'')

          existingVideoExcludedPlacements.push(videoPlacementInTheAccountClean)
        } 
      }
    else
      {if(videoModuleEnabled == 'YES'){AdsApp.newExcludedPlacementListBuilder().withName(videoListName).build()}}

    Logger.log('Excluded placements already on the list - video: '+existingVideoExcludedPlacements)    
  }

  //Then apps
  if(appsModuleEnabled == 'YES'){
    
    var existingAppExcludedPlacements = []

    if(AdsApp.excludedPlacementLists().withCondition("Name = '"+appListName+"'").get().totalNumEntities()==1  && appsModuleEnabled == 'YES')
      {
        Logger.log('List '+appListName+' already exists. No need to create.')

        var  appPlacementsInTheAccount = AdsApp.excludedPlacementLists().withCondition("Name = '"+appListName+"'").get().next().excludedPlacements().get()
        while (appPlacementsInTheAccount.hasNext()){
          var appPlacementInTheAccount = appPlacementsInTheAccount.next()

          var appPlacementInTheAccountClean = appPlacementInTheAccount.toString().replace(/SharedExcludedPlacement: /g,'').replace(/\[/g,'').replace(/\]/g,'')

          existingAppExcludedPlacements.push(appPlacementInTheAccountClean)
        } 
      }
    else
      {if(appsModuleEnabled == 'YES'){AdsApp.newExcludedPlacementListBuilder().withName(appListName).build()}}

    Logger.log('Excluded placements already on the list - app: '+existingAppExcludedPlacements)   
  }

  Logger.log('Line milestone 642')

  //Let's find the placements which are not on our list yet
  //Domain Endings first
  
  if(domainEndings.length>0 && domainEndingsModuleEnabled == 'YES'){
    Logger.log('')
    Logger.log('***Starting comparison of existing vs new placements - domain endings***')
    Logger.log('existingDomainEndingsExcludedPlacements: '+existingDomainEndingsExcludedPlacements)
    Logger.log('domainEndingsBadPLacementsToAdd: '+placementsToBeExcludedBasedOnEndings)

    var finalListOfDomainEndingsPlacementsToAdd = []

    for(i=0;i<placementsToBeExcludedBasedOnEndingsUnique.length;i++){
      if(existingDomainEndingsExcludedPlacements.indexOf(placementsToBeExcludedBasedOnEndingsUnique[i])==-1) //-1 means not found
         {  
         finalListOfDomainEndingsPlacementsToAdd.push(placementsToBeExcludedBasedOnEndingsUnique[i]) 
         if(loggerSetup=='HEAVY'){Logger.log(placementsToBeExcludedBasedOnEndingsUnique[i]+' index: '+existingDomainEndingsExcludedPlacements.indexOf(placementsToBeExcludedBasedOnEndingsUnique[i]))}
         }
      else
        {
        if(loggerSetup=='HEAVY'){Logger.log(placementsToBeExcludedBasedOnEndingsUnique[i]+' is already on the list. No need to add again. Index: '+existingDomainEndingsExcludedPlacements.indexOf(placementsToBeExcludedBasedOnEndingsUnique[i]))}
        }
    }

    Logger.log('Final list of bad placements to add: '+finalListOfDomainEndingsPlacementsToAdd)    
    Logger.log('**********End of comparison - domain endings*************')
    Logger.log('')    
  }
  
  Logger.log('Line milestone 672')

  //Display
  if(displayModuleEnabled == 'YES'){
    Logger.log('')
    Logger.log('***Starting comparison of existing vs new placements - display***')
    Logger.log('existingDisplayExcludedPlacements: '+existingDisplayExcludedPlacements)
    Logger.log('displayBadPLacementsToAdd: '+displayBadPLacementsToAdd)

    var finalListOfDisplayPlacementsToAdd = []

    for(i=0;i<displayBadPLacementsToAdd.length;i++){
      if(existingDisplayExcludedPlacements.indexOf(displayBadPLacementsToAdd[i])==-1) //-1 means not found
         {  
         finalListOfDisplayPlacementsToAdd.push(displayBadPLacementsToAdd[i]) 
         if(loggerSetup=='HEAVY'){Logger.log(displayBadPLacementsToAdd[i]+' index: '+existingDisplayExcludedPlacements.indexOf(displayBadPLacementsToAdd[i]))}
         }
      else
        {
        if(loggerSetup=='HEAVY'){Logger.log(displayBadPLacementsToAdd[i]+' is already on the list. No need to add again. Index: '+existingDisplayExcludedPlacements.indexOf(displayBadPLacementsToAdd[i]))}
        }
    }

    Logger.log('Final list of bad placements to add: '+finalListOfDisplayPlacementsToAdd)    
    Logger.log('**********End of comparison - display*************')
    Logger.log('')  
  }

  Logger.log('Line milestone 700')

  //Then video
  if(videoModuleEnabled == 'YES'){
    Logger.log('')
    Logger.log('***Starting comparison of existing vs new placements - video***')
    Logger.log('existingVideoExcludedPlacements: '+existingVideoExcludedPlacements)
    Logger.log('videoBadPLacementsToAdd: '+videoBadPLacementsToAdd)

    var finalListOfVideoPlacementsToAdd = []

    for(i=0;i<videoBadPLacementsToAdd.length;i++){
      if(existingVideoExcludedPlacements.indexOf(videoBadPLacementsToAdd[i])==-1) //-1 means not found
         {  
         finalListOfVideoPlacementsToAdd.push(videoBadPLacementsToAdd[i]) 
         if(loggerSetup == 'HEAVY'){Logger.log(videoBadPLacementsToAdd[i]+' index: '+existingVideoExcludedPlacements.indexOf(videoBadPLacementsToAdd[i]))}
         }
      else
        {
        if(loggerSetup=='HEAVY'){Logger.log(videoBadPLacementsToAdd[i]+' is already on the list. No need to add again. Index: '+existingVideoExcludedPlacements.indexOf(videoBadPLacementsToAdd[i]))}
        }
    }

    Logger.log('Final list of bad placements to add: '+finalListOfVideoPlacementsToAdd)    
    Logger.log('**********End of comparison - video*************')
    Logger.log('')  
  }
  
  Logger.log('Line milestone 728')

  //Then app
  if(appsModuleEnabled == 'YES'){
    Logger.log('')
    Logger.log('***Starting comparison of existing vs new placements - app***')
    Logger.log('existingAppExcludedPlacements: '+existingAppExcludedPlacements)
    Logger.log('appBadPLacementsToAdd: '+appsBadPLacementsToAdd)
  
    var finalListOfAppPlacementsToAdd = []

    for(i=0;i<appsBadPLacementsToAdd.length;i++){
      if(existingAppExcludedPlacements.indexOf(appsBadPLacementsToAdd[i])==-1) //-1 means not found
         {  
         finalListOfAppPlacementsToAdd.push(appsBadPLacementsToAdd[i]) 
         if(loggerSetup=='HEAVY'){Logger.log(appsBadPLacementsToAdd[i]+' index: '+existingAppExcludedPlacements.indexOf(appsBadPLacementsToAdd[i]))}
         }
      else
        {
        if(loggerSetup=='HEAVY'){Logger.log(appsBadPLacementsToAdd[i]+' is already on the list. No need to add again. Index: '+existingAppExcludedPlacements.indexOf(appsBadPLacementsToAdd[i]))}
        }
    }

    Logger.log('Final list of bad placements to add: '+finalListOfAppPlacementsToAdd)    
    Logger.log('**********End of comparison - app*************')
    Logger.log('')    
  
  }
  
  Logger.log('Line milestone 757')

  //Let's add the latest shit placements into the list - not big deal if you add the same placements over and over since the script won't fail.
  //But only if the script is set to run for real
  if(forRealOrTesting=='RUNNING_FOR_REAL' && domainEndingsModuleEnabled == 'YES' && domainEndings.length>0){AdsApp.excludedPlacementLists().withCondition("Name = '"+domainEndingsListName+"'").get().next().addExcludedPlacements(finalListOfDomainEndingsPlacementsToAdd)} 
  if(forRealOrTesting=='RUNNING_FOR_REAL' && displayModuleEnabled == 'YES'){AdsApp.excludedPlacementLists().withCondition("Name = '"+displayListName+"'").get().next().addExcludedPlacements(finalListOfDisplayPlacementsToAdd)} 
  if(forRealOrTesting=='RUNNING_FOR_REAL' && videoModuleEnabled == 'YES'){AdsApp.excludedPlacementLists().withCondition("Name = '"+videoListName+"'").get().next().addExcludedPlacements(finalListOfVideoPlacementsToAdd)} 
  if(forRealOrTesting=='RUNNING_FOR_REAL' && appsModuleEnabled == 'YES'){AdsApp.excludedPlacementLists().withCondition("Name = '"+appListName+"'").get().next().addExcludedPlacements(finalListOfAppPlacementsToAdd)} 
  
  //Let's assign Display campaigns with negative lists
  var displayCampaignsWhichGotDisplayExclusionList = []
  var displayCampaignsWhichGotAppsExclusionList = []
  var displayCampaignsWhichGotDomainEndingsExclusionList = []
  
  Logger.log('Line milestone 771')

  //The check for module enabled is down in the code - it's desirable here
  for(i=0;i<displayCampaignNames.length;i++){  

    var displayCampaigns = AdsApp.campaigns().withCondition("Status = 'ENABLED' AND Name = '"+displayCampaignNames[i]+"'").get()

    while(displayCampaigns.hasNext()){
      var displayCampaign = displayCampaigns.next()

      //Display plus app list
      //The total Num Entities trick is there to check whether the list is already assigned or not - if not then I am assigning the list to the campaign
      if(displayModuleEnabled == 'YES' && displayCampaign.excludedPlacementLists().withCondition("Name = '"+displayListName+"'").get().totalNumEntities()!=1){
        displayCampaign.addExcludedPlacementList(AdsApp.excludedPlacementLists().withCondition("Name = '"+displayListName+"'").get().next())
        displayCampaignsWhichGotDisplayExclusionList.push(displayCampaign)
      }
      if(appsModuleEnabled == 'YES' && displayCampaign.excludedPlacementLists().withCondition("Name = '"+appListName+"'").get().totalNumEntities()!=1){
        displayCampaign.addExcludedPlacementList(AdsApp.excludedPlacementLists().withCondition("Name = '"+appListName+"'").get().next())
        displayCampaignsWhichGotAppsExclusionList.push(displayCampaign)
      }
      if(domainEndingsModuleEnabled == 'YES' && domainEndings.length>0 && displayCampaign.excludedPlacementLists().withCondition("Name = '"+domainEndingsListName+"'").get().totalNumEntities()!=1){
        displayCampaign.addExcludedPlacementList(AdsApp.excludedPlacementLists().withCondition("Name = '"+domainEndingsListName+"'").get().next())
        displayCampaignsWhichGotDomainEndingsExclusionList.push(displayCampaign)
      }          
    }
  }
  
  Logger.log('Line milestone 798')
 
  //Now video campaigns - assign them the video list]
  var videoCampaignsWhichGotVideoExclusionList = []
  var videoCampaignsWhichGotDomainEndingsExclusionList = []
  
  
  for(s=0;s<videoCampaignNames.length;s++){ 

    //Let's take care of bumper campaigns
    if(videoBumperExclusion == 'YES' && videoBumperString.length>0)
    {var videoCampaigns = AdsApp.campaigns().withCondition("Status = 'ENABLED' AND Name = '"+videoCampaignNames[i]+"' AND Name DOES_NOT_CONTAIN '"+videoBumperString+"'").get()}    
    else
    {var videoCampaigns = AdsApp.campaigns().withCondition("Status = 'ENABLED' AND Name = '"+videoCampaignNames[i]+"'").get()}

    while(videoCampaigns.hasNext()){
      var videoCampaign = videoCampaigns.next()      

      //If the list is not assigned yet, then assign...
      if(videoModuleEnabled == 'YES' && videoCampaign.excludedPlacementLists().withCondition("Name = '"+videoListName+"'").get().totalNumEntities()!=1){
        videoCampaign.addExcludedPlacementList(AdsApp.excludedPlacementLists().withCondition("Name = '"+videoListName+"'").get().next())
        videoCampaignsWhichGotVideoExclusionList.push(videoCampaign)
      }

      if(domainEndingsModuleEnabled == 'YES' && domainEndings.length>0 && videoCampaign.excludedPlacementLists().withCondition("Name = '"+domainEndingsListName+"'").get().totalNumEntities()!=1){
        videoCampaign.addExcludedPlacementList(AdsApp.excludedPlacementLists().withCondition("Name = '"+domainEndingsListName+"'").get().next())
        videoCampaignsWhichGotDomainEndingsExclusionList.push(videoCampaign)
      }    
    }
  }
    
  

  /* The idea was to also assign exlusions lists to smart shopping campaigns but they are not suported in Google scripts yet, so commenting out for now
  //Now shopping campaigns - give them the display and video list
  var shoppingCampaigns = AdsApp.shoppingCampaigns().withCondition("Status = 'ENABLED'").get()
  
  while(shoppingCampaigns.hasNext()){
    var eachEnabledShoppingCampaign = shoppingCampaigns.next()
    
    //There's no check whether the list has been already assigned or not. Google Ads will not throw an error if you try to assign the list again.
    //Display+video+app negative list
    
    if(displayModuleEnabled == 'YES'){eachEnabledShoppingCampaign.addExcludedPlacementList(AdsApp.excludedPlacementLists().withCondition("Name = '"+displayListName+"'").get().next())}
    if(videoModuleEnabled == 'YES'){eachEnabledShoppingCampaign.addExcludedPlacementList(AdsApp.excludedPlacementLists().withCondition("Name = '"+videoListName+"'").get().next())}
    if(appsModuleEnabled == 'YES'){eachEnabledShoppingCampaign.addExcludedPlacementList(AdsApp.excludedPlacementLists().withCondition("Name = '"+appListName+"'").get().next())}

  }
  */
  
  Logger.log('Line milestone 848')

  //Let's send the email
//Let's send the email
var subjectText = 'Bad Placement Cleaner Just Did Changes in '+accountName+' Account | '+ accountId +' | '+ today

//####
Logger.log('Line milestone email 5')

if(domainEndingsModuleEnabled == 'YES' && domainEndings.length>0 && finalListOfDomainEndingsPlacementsToAdd.length>0){  
  var domainEndingsPlacementsForEmail = 
       'DOMAIN ENDINGS - Here are the bad placements which were added to the "'+domainEndingsListName+'" shared exclusion list:' + '<br>' +
       finalListOfDomainEndingsPlacementsToAdd.join('<br>') +
      '<br>' + '<br>'
  
}

else
  {var domainEndingsPlacementsForEmail = ''}
  

Logger.log('Line milestone email 19')  


//####
if(displayModuleEnabled == 'YES' && typeof finalListOfDisplayPlacementsToAdd !=='undefined' && finalListOfDisplayPlacementsToAdd.length>0){
  var displayPlacementsForEmail =
      'DISPLAY - Here are the bad placements which were added to the "'+displayListName+'" shared exclusion list:' + '<br>' +
      finalListOfDisplayPlacementsToAdd.join('<br>') +
      '<br>' + '<br>'
}
else 
  {var displayPlacementsForEmail = ''}

if(displayModuleEnabled == 'YES' && typeof displayCampaignsWhichGotDomainEndingsExclusionList !== 'undefined' && displayCampaignsWhichGotDomainEndingsExclusionList.length>0){  
  var displayCampaignsforEmailDomainEndingsList =
     'Display campaigns which got Domain Endings exclusion list assigned:'+'<br>'+
      displayCampaignsWhichGotDomainEndingsExclusionList.join('<br>') + 
      '<br>' + '<br>'
}
else 
  {var displayCampaignsforEmailDomainEndingsList = ''}

if(displayModuleEnabled == 'YES' && typeof displayCampaignsWhichGotDisplayExclusionList !== 'undefined' && displayCampaignsWhichGotDisplayExclusionList.length>0){  
  var displayCampaignsforEmailDisplayList =
      'Display campaigns which got Display exclusion list assigned:'+'<br>'+
      displayCampaignsWhichGotDisplayExclusionList.join('<br>') +
      '<br>' + '<br>' 
}
else 
  {var displayCampaignsforEmailDisplayList = ''}

if(displayModuleEnabled == 'YES' && typeof displayCampaignsWhichGotAppsExclusionList !== 'undefined' && displayCampaignsWhichGotAppsExclusionList.length>0){  
  var displayCampaignsforEmailAppList =   
      'Display campaigns which got Apps exclusion list assigned:'+'<br>'+
      displayCampaignsWhichGotAppsExclusionList.join('<br>') +  
      '<br>' + '<br>'
}
else 
    {var displayCampaignsforEmailAppList = ''}

Logger.log('Line milestone email 59') 

//####

  
if(videoModuleEnabled == 'YES' && typeof finalListOfVideoPlacementsToAdd !== 'undefined' && finalListOfVideoPlacementsToAdd.length>0){
  var videoPlacementsForEmail =
      'VIDEO - Here are the bad placements which were added to the "'+videoListName+'" shared exclusion list:' + '<br>' +
      finalListOfVideoPlacementsToAdd.join('<br>') +  
      '<br>' + '<br>'
}
else 
  {var videoPlacementsForEmail = ''}

if(videoModuleEnabled == 'YES' && typeof videoCampaignsWhichGotDomainEndingsExclusionList !== 'undefined' && videoCampaignsWhichGotDomainEndingsExclusionList.length>0){
  var videoCampaignsforEmailDomainEndingsList =       
    'Video campaigns which got Domain Endings exclusion list assigned:'+'<br>'+
    videoCampaignsWhichGotDomainEndingsExclusionList.join('<br>') +     
    '<br>' + '<br>'
}

else 
  {var videoCampaignsforEmailDomainEndingsList = ''}

if(videoModuleEnabled == 'YES' && typeof videoCampaignsWhichGotVideoExclusionList !== 'undefined' && videoCampaignsWhichGotVideoExclusionList.length>0){
  var videoCampaignsforEmailVideoList =
     'Video campaigns which got Video exclusion list assigned:'+'<br>'+
     videoCampaignsWhichGotVideoExclusionList.join('<br>') +     
     '<br>' + '<br>'
}
else 
  {var videoCampaignsforEmailVideoList = ''}


//####
if(appsModuleEnabled == 'YES' && typeof finalListOfAppPlacementsToAdd !== 'undefined' && finalListOfAppPlacementsToAdd.length>0){
  var appsPlacementsForEmail = 'APPS - Here are the bad placements which were added to the "'+appListName+'" shared exclusion list:' + '<br>' +
  finalListOfAppPlacementsToAdd.join('<br>') +
  '<br>' + '<br>'
}

else
  {var appsPlacementsForEmail = ''}   


//Let's contruct the email body
var bodyText =
    ( 'Mode: '+forRealOrTesting + '<br>' + '<br>' +

      '***Changes in Bad Placements***:' + '<br>' +
      'Hi,' + '<br>' +

      'Bad Placement Cleaner script has found new bad placements. Here they are: ' + '<br>' + '<br>' +

      domainEndingsPlacementsForEmail +
           
      displayPlacementsForEmail +
      
      videoPlacementsForEmail +
      
      appsPlacementsForEmail +

           
      '***Changes in the Assigned Lists***:' +'<br>'+

      displayCampaignsforEmailDomainEndingsList +
     
      displayCampaignsforEmailDisplayList +
     
      displayCampaignsforEmailAppList +

      videoCampaignsforEmailDomainEndingsList +

      videoCampaignsforEmailVideoList +

      '<br>' + '<br>' +
     
      'Here is full log:' + '<br>' + '<br>' +
     
       Logger.getLog().split('\n').join('<br>')
     
       + '<br>' + '<br>' +
     
      'Your config spreadsheet is here: https://docs.google.com/spreadsheets/d/'+ssId +
      
      '<br>' + '<br>' + 
      'And that\'s all!' + '<br>' +
      'This script is powered by www.ExcelinPPC.com.' + '<br>' +
      'You can join our newsletter here: https://www.excelinppc.com/newsletter/' + '<br>' +
      'Or you can join our FB group here: https://www.facebook.com/groups/Excelinppc/' + '<br>' +
      'If something is not working, send me an email to mail@danzrust.cz'
    )

if(email.length>0 &&
  
    (
        (typeof finalListOfDomainEndingsPlacementsToAdd !== 'undefined' && finalListOfDomainEndingsPlacementsToAdd.length>0 && domainEndingsModuleEnabled == 'YES') || 
        (typeof finalListOfDisplayPlacementsToAdd !== 'undefined' &&  finalListOfDisplayPlacementsToAdd.lnegth>0 && displayModuleEnabled == 'YES') || 
        (typeof finalListOfVideoPlacementsToAdd !== 'undefined' && finalListOfVideoPlacementsToAdd.length>0 && videoModuleEnabled == 'YES') || 
        (typeof finalListOfAppPlacementsToAdd !== 'undefined' && finalListOfAppPlacementsToAdd.length>0 && appsModuleEnabled == 'YES') ||
        
        (typeof displayCampaignsWhichGotDomainEndingsExclusionList !== 'undefined' && displayCampaignsWhichGotDomainEndingsExclusionList.length>0 && displayModuleEnabled == 'YES') ||       
        (typeof displayCampaignsWhichGotDisplayExclusionList !== 'undefined' && displayCampaignsWhichGotDisplayExclusionList.length>0 && displayModuleEnabled == 'YES') || 
        (typeof displayCampaignsWhichGotAppsExclusionList !== 'undefined' && displayCampaignsWhichGotAppsExclusionList.length>0 && displayModuleEnabled == 'YES') || 

        (typeof videoCampaignsWhichGotDomainEndingsExclusionList !== 'undefined' && videoCampaignsWhichGotDomainEndingsExclusionList.length>0 && videoModuleEnabled == 'YES') ||
        (typeof videoCampaignsWhichGotVideoExclusionList !== 'undefined' && videoCampaignsWhichGotVideoExclusionList.length>0 && videoModuleEnabled == 'YES') ||
        (developerMode == 'developer')
  )
  )

    {
      MailApp.sendEmail({
            to: email, 
            subject: subjectText,
            htmlBody: bodyText
          })

      Logger.log('Email sent.')  
    }

  else 
    {
      Logger.log('Email will not be sent. Couple possible reasons: 1) No new bad placements were added 2) No lists were assigned 3) You did not enter the email address in the config sheet.')
    }  
  
  
  
  Logger.log('Script finished.')
  
  //send event completed to GA
  var payload = {
    'v': '1',
    'tid': 'UA-69459605-1',
    't': 'event',
    'cid' : Utilities.getUuid(),
    'z' : Math.floor(Math.random() * 10E7),
    'ds' : 'google_ads_script',
    'cn' : 'script-bad_placement_cleaner',
    'cs' : 'google_ads_script',
    'cm' : 'google_ads_script',
    'ec' : 'script_run',
    'ea' : 'script_run_completed',
    'el' : 'script-bad_placement_cleaner'
    };
  
  var options = {
    "method" : "post",
    "payload" : payload
   };
  
  // Send the hit to GA if allowed
  if(eventReportingToExcelinPpcComAllowed == 'YES'){UrlFetchApp.fetch("http://www.google-analytics.com/collect", options)};
  
  Logger.log('IDAR log events at simon@s.media')  
  Logger.log('If something is not working, visit http://s.media')

}