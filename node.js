var fs = require('fs');
// Module import
var Parser = require('binary-parser').Parser;
var http = require('http');
var url = require("url");

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post('/', function (req, res) {
    if (!req.body.name) return;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    var fileData = fs.readFileSync('data/' + req.body.name);

    var ipHeader = new Parser()
        .endianess('little')
        .string('sign', { length: 4 })
        .int32('channels')
        .int32('channel_size')
        .int32('spectral_lines')
        .int32('cutoff_frequency')
        .float('frequency_resolution')
        .float('block_receipt_time')
        .float('block_receipt_time_total')
        .int32('block_count')
        .int32('block_size')
        .int32('block_count_real')
        .float('block_size_max')
        .float('block_size_min')
        .array('data', {
            type: 'floatle',
            length: (fileData.length - 13*4)/4
        });

    var header = ipHeader.parse(fileData);

    res.end(JSON.stringify(header));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});