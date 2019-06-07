var main = require("./main.js");
var async = require("async");
var utils = require("./utility/report")
exports.undeployedAllEnv = function (req, res) {
    async.waterfall([
        function (callback) {
            var appObj = {};
            appObj.req = req;
            appObj.res = res;
            callback(null, appObj);
        },
        // function to get all proxies which have zeero traffic
        allProxy,
        getDeploymentStatus
    ], function (err, response) {
        var apiResponse = {};
        console.log("response ", response.undePloyedProxies);
        apiResponse.count = response.undePloyedProxies.length;
        var path =utils.generateCsv(response.undePloyedProxies,"not-deployed-to-any-env");
        apiResponse.filePath = req.protocol + '://' + req.get('host')+"/files/"+path;
        apiResponse.proxies = response.undePloyedProxies;
        
        res.send(apiResponse);
        
    });
};

function allProxy(appObj, callback) {
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

function getDeploymentStatus(appObj, callback) {
    var req = appObj.req;
    count = 0;
    var undePloyedProxies = [];
    appObj.allProxies.forEach(proxy => {
        var url = "/v1/o/ee-nonprod/apis/" + proxy + "/deployments";
        console.log("url ", url)
        var options = {
            host: "api.enterprise.apigee.com",
            path: url,
            port: 443,
            method: "GET",
            headers: {
                "Authorization": req.headers.authorization
            }
        };
        main.httpReq(options, (error, response) => {
            if (error) {
                console.log("error ", error);
                return callback(error, null);
            }
            count++;
            if (response.environment.length == 0) {
                undePloyedProxies.push(response.name);
            }
            console.log("count ", count);
            if (count == appObj.allProxies.length) {
                appObj.undePloyedProxies = undePloyedProxies;
                return callback(null, appObj);
            }
        });
    })
}
