const static = require('node-static')
const path = require('path')


// 
// Create a node-static server instance to serve the './public' folder 
// 
var file = new static.Server( path.join(__dirname, '../client'));

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);