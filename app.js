process.env.TZ = 'Asia/Kolkata';
var Config = require('./config'),
    Consumer = require('sqs-consumer'),
    AWS = require('aws-sdk'),
    moment = require('moment'),
    constants = require('./constants'),
    utils = require('./utils');

AWS.config.update({
    region: Config.sqs.region,
    accessKeyId: Config.sqs.accessKeyId,
    secretAccessKey: Config.sqs.secretAccessKey
});

function done_compiling(output, resultCallback) {
    var sqs = new AWS.SQS();
    var msg = output;
    var sqsParams = {
        MessageBody: JSON.stringify(msg),
        QueueUrl: Config.sqs.resultQueueUrl
    };
    sqs.sendMessage(sqsParams, function(err, data) {
        if (err) {
            constants.logger('error', err);
            resultCallback(0);
        }
        resultCallback(1);
    });
}

var consumer = Consumer.create({
    queueUrl: Config.sqs.pollingQueueUrl,
    handleMessage: function(message, done) {
        var doneMsg = function(err) {
            if (err) {
                constants.logger('error', 'Error in processing queue => ' + err);
                done(err);
            } else {
                done();
            }
        };
        try {
            var msgBody = JSON.parse(message.Body);
//            console.log('- -== msgBody ==- -', msgBody);
            utils.getFile(msgBody.file_url, msgBody.extra_data, function(err, finalFilePath) {
                if (err) {
                    console.log('err:', err);
                }
                else {
                    console.log('file final path', finalFilePath);
                    utils.uploadFile(finalFilePath, function (err, fileResponse) {
                        console.log('>> 1 >>', err, fileResponse);
                        var outputData = {
                            "file_url": fileResponse,
                            "file_db_data": msgBody.file_db_data,
                            "extra_data": msgBody.extra_data
                        }
                        var result = done_compiling(outputData, function(resultObject) {
                            if(resultObject) {
                                doneMsg();
                            }
                            else {
                                doneMsg('Output sending failed');
                            }
                        });
                    })
                }
            });
        } catch (e) {
            doneMsg('Parsing Error');
        }
    },
    batchSize: 10,
    sqs: new AWS.SQS()
});

consumer.on('error', function(err) {
    constants.logger('info', 'server file ERROR');
    constants.logger('info', err);
    return 1;
});

consumer.start();

constants.logger('info', 'server started. polling on ' + Config.sqs.pollingQueueUrl);
