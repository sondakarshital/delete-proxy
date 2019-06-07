
var https = require('https');
var main = require("./main.js");
var utils = require("./utility/report");
exports.getAllProxies = function(req,res){
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("full url  ",fullUrl);
    console.log("req.headers.authorization",req.headers.authorization);
        var options = {
        host: "api.enterprise.apigee.com",
        path: "/v1/organizations/ee-nonprod/apis",
        port: 443,
        method: "GET",
        headers: {
            "Authorization": req.headers.authorization
        }
    };

    main.httpReq(options,(error,response)=>{
        if(error){
            res.send(error);
        }
         var apiResponse ={};
         apiResponse.count = response.length;
         var path = utils.generateCsv(response,"all-api's");
         apiResponse.filePath = req.protocol + '://' + req.get('host')+"/files/"+path;
         apiResponse.proxies = response;
         res.send(apiResponse);
      });
}