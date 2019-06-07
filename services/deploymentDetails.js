var main = require('./main.js');
exports.deploymentDetails = function(req,res){
    var proxyname = req.query.proxyname;
    console.log("proxyname ",proxyname);
    var url = "/v1/o/ee-nonprod/apis/"+proxyname+"/deployments";
    var options = {
        host: "api.enterprise.apigee.com",
        path: url,
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
         console.log(" response ",JSON.stringify(response));
         apiResponse.proxyname = response.name;
         console.log("response.environment ",response.environment);
         apiResponse.deploymentDetails = copyProxiesToArry(response.environment);
         res.send(apiResponse);
      });
};

function copyProxiesToArry(environments){
    console.log("environments ",environments);
    var proxieDetails = [];
    environments.forEach((environment)=>{
        var proxy = {};
        proxy.name = environment.name;
        proxy.revision = environment.revision[0].name;
        proxieDetails.push(proxy);
    })
        return proxieDetails;
}