console.log('-- Test starts --');
var utils = require('./utils');

var gmailFilePath = 'https://lh4.googleusercontent.com/-zhkOsOwob60/AAAAAAAAAAI/AAAAAAAAAAA/AAyYBF5L0ITCCJmHZBrR-J1M0CVAj4OH1g/s96-c/photo.jpg'

var fbFilePath = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/16299499_774029869413565_3003085472559915996_n.jpg?oh=ef7d09d05803b224564938ab8b67b92d&oe=59A7902D'

var msgBody = {
  "file_url": gmailFilePath,
  "file_db_data": {
    "database_name": "db_name",
    "table_name": "table_name",
    "column_name": "column_name",
    "primary_key_id": "primary_key_id"
  },
  "extra_data": {
    "file_type": "image/jpg",
    "file_encoding": "default"
  }
}

// utils.getFile(msgBody.file_url, msgBody.extra_data, function(err, co) {
//     console.log('--1--', err, co);
// });

var filePath = './temp/4a301b4d577a31f3.jpg';

utils.uploadFile(filePath, function (err, fileResponse) {
    console.log('>> 1 >>', err, fileResponse);
})

console.log('-- Test ends --');
