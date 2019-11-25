let aws = require('aws-sdk');
let lambda = new aws.Lambda();

const invoke = async(clientContext, functionName, invocationType, logType, payload, qualifier) => {
    return new Promise((resolve, reject) => {
        let params = {
            ClientContext: clientContext,
            FunctionName: functionName,
            InvocationType: invocationType,
            LogType: logType,
            Payload: payload,
            Qualifier: qualifier
        };
        lambda.invoke(params, (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};

module.exports = invoke;