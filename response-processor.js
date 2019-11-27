const config = require('./config/response-status-config.json');

const processResponse = (response) => {
    let payload = JSON.parse(response.Payload);
    if (response.FunctionError) {
        throw new Error(JSON.stringify({ type: payload.errorType || 'Error', message: payload.errorMessage }));
    }
    return payload;
};

const processError = (error) => {
    let object = JSON.parse(error.message);
    return {
        StatusCode: config[object.type] || 500,
        body: {
            message: object.message
        }
    };
};

module.exports = {
    processResponse,
    processError
};