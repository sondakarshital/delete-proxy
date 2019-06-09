var main = require("./main.js");
var async = require("async");
var utils = require("./utility/report");
exports.allUnUsedProxies = function (req, res) {
    async.waterfall([
        function (callback) {
            var appObj = {};
            appObj.req = req;
            appObj.res = res;
            callback(null, appObj);
        },
        // function to get all proxies which have zeero traffic
        zeroTrafficProxyDetails,
        uniqueProxies,
        allProxies,
        finalResponse
    ], function (err, response) {
        var apiResponse = {};
        apiResponse.count = response.length;
        var path = utils.generateCsv(response,"not-deployed-to-any-env");
        apiResponse.filePath = req.protocol + '://' + req.get('host')+"/files/"+path;
        apiResponse.proxies = response;
        res.send(apiResponse);
        
    });
};

function zeroTrafficProxyDetails (appObj, callback) {
    console.log("inside zeroTrafficProxyDetails");
    var req = appObj.req;
    var res = appObj.res;
    var formattedFromDate = req.query.fromDate;
    var formattedToDate = req.query.toDate;
    if(!formattedFromDate || !formattedToDate){
        axDays = 2;
        var toDate = new Date();
        formattedToDate = (toDate.getMonth()+1)+"/"+(toDate.getDate())+"/"+toDate.getFullYear();//MM/DD/YYYY%20HH:MM
        var fromDate = new Date(toDate - (axDays*24*3600*1000));
        formattedFromDate = (fromDate.getMonth()+1)+"/"+fromDate.getDate()+"/"+fromDate.getFullYear();//MM/DD/YYYY%20HH:MM
    }
    var envs = ["dev", "test","bf1","sandbox"];
    var options = {
        host: "api.enterprise.apigee.com",
        port: 443,
        method: "GET",
        headers: {
            "Authorization": req.headers.authorization
        }
    };
    var proxiesArray = [];
    envs.forEach((env, index, envs) => {
        var url = "/v1/o/ee-nonprod/e/" + env + "/stats/apis?select=sum(message_count)&timeUnit=month&" + "timeRange=" + formattedFromDate + "%2000:00~" + formattedToDate + "%2023:59";
        options.path = url;
        main.httpReq(options, (error, response) => {
            if (error) {
                res.send(error);
            }
            //console.log("response 1234",JSON.stringify(response.environments[0].dimensions.length))
            // ... represents spread operators
             proxiesArray.push(...copyProxiesToArry(response.environments[0].dimensions));
            if (index == envs.length - 1) {
                appObj.proxiesArray = proxiesArray;
                return callback(null, appObj);
            }
        });
    });
}

function allProxies(appObj, callback){
    var req = appObj.req;
    var res = appObj.res;
    var options = {
        host: "api.enterprise.apigee.com",
        path: "/v1/organizations/ee-nonprod/apis",
        port: 443,
        method: "GET",
        headers: {
            "Authorization": req.headers.authorization
        }
    };
    main.httpReq(options, (error, response) => {
        if (error) {
            res.send(error);
        } else {
            appObj.allProxies = response;
            callback(null, appObj);
        }
    });
}

function uniqueProxies (appObj, callback) {
    proxiesArray = appObj.proxiesArray;
    proxiesArray = proxiesArray.filter((proxy, index, proxiesArray) => {
        return proxiesArray.indexOf(proxy) == index;
    });
    console.log("proxiesArray ",proxiesArray.length);
    appObj.proxiesArray = proxiesArray;
    return callback(null, appObj);
}

function copyProxiesToArry (dimensions) {
    var proxies = [];
    dimensions.forEach((dimension) => {
        proxies.push(dimension.name);
    });
    return proxies;
}

function finalResponse(appObj, callback){
    finalArray = appObj.allProxies.filter(x => appObj.proxiesArray.includes(x));
    finalArray = appObj.allProxies.filter(x => !finalArray.includes(x));
    console.log("final array ",finalArray);
    return callback(null,finalArray);
}
