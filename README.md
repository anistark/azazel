# Azazel

[![Coverage Status](https://coveralls.io/repos/github/anistark/azazel/badge.svg)](https://coveralls.io/github/anistark/azazel)
[![Build Status](https://travis-ci.org/anistark/azazel.svg?branch=master)](https://travis-ci.org/anistark/azazel)

File transporter.

2 queues are used to operate. Any node trying to use Azazel must run a task to push the files to be uploaded and write the files to their corresponding database after reading from result queue.

Azazel can run concurrently across multiple instances in case of scalability requirements.

## How does it work?

Steps:
 1. Upload the data to a queue(currently works with AWS SQS).
 2. Azazel will download the file from the queue to the temp folder in this project. (Can be replaced with any other directory location).
 3. Azazel will then upload the file to s3 and provide with the sqs url.
 4. The sqs url is now pushed to another queue(AWS SQS).


## Setup

* Setup node app: `npm install`

* Setup sqs queue

* Create config file: `cp config_example.js config.js`

* Update the config file according to your requirements.

## Run

`node app.js`


# Todo

- [x] Add Documentation/Wiki.
- [ ] Add a landing gh-pages to be seen at https://anistark.github.io/azazel.
- [ ] Run SQS queue across multiple instances at the same time.
- [ ] Add Test-Cases.
- [ ] Add Coveralls.
- [ ] Support more queues.
