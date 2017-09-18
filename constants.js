var Config = require('./config');

exports.todayDate = function() {
    return moment().format('YYYY-MM-DD');
};

//var redis = require("redis");
//var pub = redis.createClient();


exports.logger = function(logLevel, logMessage) {
    //Redis pub sub push
    // pub.publish(logLevel,logMessage);
    console.log('--2--', logLevel,logMessage);
    return 1;
};
