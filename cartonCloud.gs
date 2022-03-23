function getToken()
{
  var client_id = '8VX3dSFyv2nIX6Yvt7PTHJEcQ';
  var secret_id = 'EOmr9E5AoXac1Krtskr6iyr9MAKGmuTlcvq21pdf';
  var tokenEndpoint = "https://api.cartoncloud.com/uaa/oauth/token";
    var head = {
      'Authorization':"Basic "+ Utilities.base64Encode(client_id+':'+secret_id),
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    var postPayload = {
        "grant_type" : "client_credentials"
    }
    var params = {
        headers:  head,
        contentType: 'application/x-www-form-urlencoded',
        method : "post",
        muteHttpExceptions: true,
        payload : postPayload      
    }    
    var response = UrlFetchApp.fetch(tokenEndpoint, params); 
    Logger.log(response);
}

function getCompanyData()
{
var endPoint = "https://api.cartoncloud.com/uaa/userinfo";
var head = {
      'Authorization':"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJhcGkiXSwiaXNzIjoiY2MtYXBpIiwiZXhwIjoxNjQ1NTUxODA0LCJ1c2VyIjp7ImlkIjoiNGZhNDI2ZDQtZDdiMi00NjU2LTljOGItNDAyNzNjNTE1ZTk4In0sImp0aSI6IjEwNmU5OTMzLWY4ZjItNDY1OC05N2ZiLWFhNzU2MjFiMzI4YyIsImNsaWVudF9pZCI6IjhWWDNkU0Z5djJuSVg2WXZ0N1BUSEpFY1EifQ.TTd2TnQ5w7lkcMH9PNjITVwpGaq501K2Tcsncmfrc75AHZdr6bG1gf-jhGcB7Th6f9-_fYNRVGByrph9r_icC8M5ajR8PO9juKeFRV8noQ9EnEeY129Av1KrqsjAFMEZDQuJnJuM2TPENueN27JJzIsaxCZiS7yHMytgZ0xfmMT1la4154XG4u9LAv6BcC-t0HHLc2looYHtG577spJdqEJ5JpxAg3lZQNScWaVZ7kofGLutmPxhOJu8pyNItF1XuD_whIOIB6l29KSbe4pMGn-YSRaew6L6Er7H44g1rSLX5qvPjahVWQGZtrBOs1caH2NLBmblQREcneFl9efHGA",
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
var params = {
        headers:  head,
        contentType: 'application/x-www-form-urlencoded',
        method : "get",
        muteHttpExceptions: true        
    }    
    var response = UrlFetchApp.fetch(endPoint, params); 
    Logger.log(response);
}
function getProductsData()
{
var endPoint = "https://api.cartoncloud.com/tenants/dbe58139-b434-411a-a674-843756c4cac8/products";
var head = {
      'Authorization':"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJhcGkiXSwiaXNzIjoiY2MtYXBpIiwiZXhwIjoxNjQ1NTUxODA0LCJ1c2VyIjp7ImlkIjoiNGZhNDI2ZDQtZDdiMi00NjU2LTljOGItNDAyNzNjNTE1ZTk4In0sImp0aSI6IjEwNmU5OTMzLWY4ZjItNDY1OC05N2ZiLWFhNzU2MjFiMzI4YyIsImNsaWVudF9pZCI6IjhWWDNkU0Z5djJuSVg2WXZ0N1BUSEpFY1EifQ.TTd2TnQ5w7lkcMH9PNjITVwpGaq501K2Tcsncmfrc75AHZdr6bG1gf-jhGcB7Th6f9-_fYNRVGByrph9r_icC8M5ajR8PO9juKeFRV8noQ9EnEeY129Av1KrqsjAFMEZDQuJnJuM2TPENueN27JJzIsaxCZiS7yHMytgZ0xfmMT1la4154XG4u9LAv6BcC-t0HHLc2looYHtG577spJdqEJ5JpxAg3lZQNScWaVZ7kofGLutmPxhOJu8pyNItF1XuD_whIOIB6l29KSbe4pMGn-YSRaew6L6Er7H44g1rSLX5qvPjahVWQGZtrBOs1caH2NLBmblQREcneFl9efHGA",
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Version': 1
    }
var params = {
        headers:  head,
        contentType: 'application/json',
        method : "get",
        muteHttpExceptions: true        
    }    
    var response = UrlFetchApp.fetch(endPoint, params); 
    Logger.log(response);
}