const express = require('express');
var oauth = require("./services/oauthValidation.js");
var bodyParser = require("body-parser");
var cors = require('cors');

var getAllProxies = require('./services/getAllProxies.js');
var unUsedProxies = require('./services/unUsedProxies.js');
var deploymentDetails = require('./services/deploymentDetails.js');
var undeployProxy = require('./services/undeployProxy.js');
var deleteProxy = require("./services/deleteProxy.js");
var productDetail = require('./services/productDetail.js');
var updateProductDetail = require('./services/updateProductDetail.js');
var allUnUsedProxies =  require('./services/allUnUsedProxies.js');
var undeployedAllEnv =  require('./services/undeployedAllEnv.js')


var app = express();

const port = process.env.PORT || 4000;
//app.use(morgan('dev'));
//body-parser as middleware configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use("/files",express.static('public'));
app.all("*",oauth.oauthValidation);
//setting middleware
 //Serves resources from public folder

/* returns all proxies*/
app.get('*/apis',getAllProxies.getAllProxies);
//app.get('*/zero-traffic',unUsedProxies.unUsedProxies);
//get deployment details for proxy
app.get('*/deployment-details',deploymentDetails.deploymentDetails);
//undeploy proxy by env name and revision no
// app.delete("*/undeploy-proxy/:proxyname",undeployProxy.undeployProxy);

// //delete proxy from organization;
// app.delete("*/delete-proxy/:proxyname",deleteProxy.deleteProxy);
// //get product details
app.get("*/product-detail",productDetail.productDetail);
// //update product details
// app.put("*/product-detail/:productname",updateProductDetail.updateProductDetail);

app.get("*/zero-traffic-all-env",allUnUsedProxies.allUnUsedProxies);
app.get("*/undeplyed-all-env",undeployedAllEnv.undeployedAllEnv);

app.listen(port,function(){
    console.log('server listening on ',port)
});
