var http = require('http');
var https = require('https');
var Config = require('./config');
var URL = require('url');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var AWS = require('aws-sdk');

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
        console.log('destinationFileFullPath:', destinationFileFullPath);
        if (urlParts.protocol.replace(":", "") == 'https') {
            client = https;
        }
        var request = client.get(filePath, function(response) {
            response.pipe(fileFinal);
            fileFinal.on('finish', function() {
                fileFinal.close(cb(null, destinationFileFullPath));  // close() is async, call cb after close completes.
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

exports.uploadFile = function(filePath, cb) {
    // console.log('filePath:', filePath);
    var baseFileNameData = path.basename(filePath);
    var fileExtRegex = /[#\\?]/g;
    var extName = path.extname(baseFileNameData);
    var endOfExt = extName.search(fileExtRegex);
    if (endOfExt > -1) {
        extName = extName.substring(0, endOfExt);
    }
    var baseFileName = baseFileNameData.replace(/\.[^/.]+$/, "");
    // For dev purposes only
    AWS.config.update({
        region: Config.sqs.region,
        accessKeyId: Config.sqs.accessKeyId,
        secretAccessKey: Config.sqs.secretAccessKey
    });
    fs.readFile(filePath, function (err, data) {
        if (err) throw err;
        var s3bucket = new AWS.S3(
            {
                params: {
                    Bucket: Config.s3.bucketUploadTo
                }
            }
        );
        var fileKey = Config.s3.bucketDefaultKey+ '/' + crypto.randomBytes(Math.ceil(6/2)).toString('hex').slice(0, 6) + '/' + crypto.randomBytes(Math.ceil(6/2)).toString('hex').slice(0, 6) + '/' + baseFileName+extName
        var params = {
            Key: fileKey,
            Body: data
        };
        s3bucket.upload(params, function (err, data) {
            fs.unlink(filePath, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('Temp File Delete');
            });
            cb(null, data.Location);
            if (err) {
                console.log('ERROR MSG: ', err);
                cb(err);
            } else {
                console.log('Successfully uploaded data');
                cb(null, 1);
            }
        });
    });
}
