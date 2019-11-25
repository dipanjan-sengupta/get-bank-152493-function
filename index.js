const map = require('./mapper');
const invoke = require('./invoker');

const CLIENT_CONTEXT = process.env.SOAP_CALL_CLIENT_CONTEXT;
const FUNCTION_NAME = process.env.SOAP_CALL_FUNCTION_NAME;
const INVOCATION_TYPE = process.env.SOAP_CALL_INVOCATION_TYPE;
const LOGGING_TYPE = process.env.SOAP_CALL_LOGGING_TYPE;
const QUALIFIER = process.env.SOAP_CALL_QUALIFIER;

exports.handler = async(event, context, callback) => {
    console.log(JSON.stringify(event));
    const input = event.input;
    const system = event.record.system;
    const payload = map(input, system.requestMapper.map, system.requestMapper.variables);
    const request = {
        url: system.endpoint,
        method: system.operation,
        payload: payload
    };
    console.log('SOAP Function Request - ', request);
    await invoke(CLIENT_CONTEXT, FUNCTION_NAME, INVOCATION_TYPE, LOGGING_TYPE, JSON.stringify(request), QUALIFIER).then((result) => {
            console.log('SOAP Function Response - ', result);
            if (result.StatusCode == 200) {
                var payload = JSON.parse(result.Payload);
                if (!result.FunctionError) {
                    if (system.responseMapper) {
                        payload = map(payload, system.responseMapper.map, system.responseMapper.variables);
                        callback(null, payload);
                    }
                    else {
                        callback(null, payload);
                    }
                }
                else {
                    callback(JSON.stringify(payload), null);
                }
            }
            else {
                callback(JSON.stringify(result), null);
            }
        })
        .catch((error) => callback(error, null));
};