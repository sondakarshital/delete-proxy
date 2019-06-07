var main = require('./main.js');
exports.productDetail = function(req,res){
    var productname = req.query.productname;
    
    console.log("productname ",productname)
    var url = "/v1/o/ee-nonprod/apiproducts/"+productname;
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
        apiResponse.displayName = response.displayName;
        apiResponse.approvalType = response.approvalType;
        apiResponse.proxies = response.proxies;
        res.send(apiResponse);
      });
};
