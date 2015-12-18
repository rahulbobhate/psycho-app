var https = require('https');
 
/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET

var getReqHeaders = {
"X-API-KEY" : "5639519856e14443b554dcd9",
"X-API-SECRET-KEY" : "Y3yfGYd0zJ5wFIeSekHsM8UUlNRMGsJE2LwzWAA6rGw"
}

var optionsget = {
    host : 'api.receptiviti.com', // here only the DOMAIN NAME
    // (no http/https !)
    port : 443,
    path : '/api/ping', // the rest of the url with parameters if needed
    method : 'GET', // do GET
    headers : getReqHeaders
};
 
console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');
 
// do the GET request
var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);
 
 
    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });
 
});
 
reqGet.end();
reqGet.on( 'ERROR', function(e) {
    console.error(e);
});

/**
 * HOW TO Make an HTTP Call - POST
 */
// do a POST request
// create the JSON object

//var obj = "I want to kill myself";

var fs = require('fs');
var obj;
fs.readFile('likes.js', 'utf8', function (err, data) {
  if (err) throw err;
   obj = data;
 console.log(obj);
  jsonObject = JSON.stringify({
 "content" : obj,
 "client_reference_id" : "Natasha Mandal",
 "content_source" : "1"
});
// prepare the header
var postReqHeaders = {
    "X-API-KEY" : "5639519856e14443b554dcd9",
    "X-API-SECRET-KEY" : "Y3yfGYd0zJ5wFIeSekHsM8UUlNRMGsJE2LwzWAA6rGw",
    'Content-Type' : 'application/json',
    'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
};
 
// the post options
var optionspost = {
    host : 'api.receptiviti.com', // here only the DOMAIN NAME
    // (no http/https !)
    port : 443,
    path : '/api/writing_sample', // the rest of the url with parameters if needed
    method : 'POST', // do POST
    headers : postReqHeaders
};
 
console.info('Options prepared:');
console.info(optionspost);
console.info('Do the POST call');
 
// do the POST call
var reqPost = https.request(optionspost, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);
   // var fs = require("fs");
    res.on('data', function(d) {
        console.info('POST result:\n');
        //fs.writeFile( "filename.json", d, "utf8");
        process.stdout.write(d);
        console.info('\n\nPOST completed');
    });
});
 
// write the json data
reqPost.write(jsonObject);
reqPost.end();
reqPost.on( 'ERROR', function(e) {
    console.error(e);
});
 




});

 
