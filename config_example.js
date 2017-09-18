module.exports = {
    server: {
        host: '0.0.0.0',
        port: 3000,
        appName: 'Azazel',
        version: 'v1.0.0',
        environment: process.env.environment || 'local'
    },
    sqs:{
        accessKeyId: '',
        secretAccessKey: '',
        pollingQueueUrl: '',
        resultQueueUrl: '',
        region: ''
    },
    elasticSearch: {
        host: process.env.elasticsearch_host || 'localhost:9200',
        log: 'info',
        baseLogIndexName: '',
        typeName: '',
        requestTimeout: 3000,
        bufferTime: process.env.bufferTime || 40
    }
};
