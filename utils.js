var http = require('http');
var https = require('https');
var URL = require('url');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

exports.getFile = function(filePath, fileExtraData, cb) {
    try {
        var baseFileNameData = path.basename(filePath);
        var fileExtRegex = /[#\\?]/g;
        var extName = path.extname(baseFileNameData);
        var endOfExt = extName.search(fileExtRegex);
        if (endOfExt > -1) {
            extName = extName.substring(0, endOfExt);
        }
        var baseFileName = baseFileNameData.replace(/\.[^/.]+$/, "");
        if (baseFileName == 'photo') {
            var desiredLength = 16;
            baseFileName = crypto.randomBytes(Math.ceil(desiredLength/2)).toString('hex').slice(0, desiredLength);
        }
        var destinationPath = './temp/';
        var destinationFileFullPath = destinationPath+baseFileName+extName
        var fileFinal = fs.createWriteStream(destinationFileFullPath);
        var client = http;
        var urlParts = URL.parse(filePath, true);
        if (urlParts.protocol.replace(":", "") == 'https') {
            client = https;
        }
        var request = client.get(filePath, function(response) {
            response.pipe(fileFinal);
            fileFinal.on('finish', function() {
                fileFinal.close(cb(null, filePath));  // close() is async, call cb after close completes.
            });
        }).on('error', function(err) { // Handle errors
            fs.unlink(destinationFileFullPath); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
    }
    catch (err) {
        cb(err);
    }
}

