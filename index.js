const map = require('./mapper');
const invoke = require('./invoker');
const processor = require('./response-processor');

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
    console.log('SOAP Function Request', request);
    try {
        let response = {};
        let payload = processor.processResponse(await invoke(CLIENT_CONTEXT, FUNCTION_NAME, INVOCATION_TYPE, LOGGING_TYPE, JSON.stringify(request), QUALIFIER));
        if (system.responseMapper) {
            payload = map(payload, system.responseMapper.map, system.responseMapper.variables);
            response = { StatusCode: 200, body: payload };
        }
        else {
            response = { StatusCode: 200, body: payload };
        }
        callback(null, response);
    }
    catch (e) {
        callback(null, processor.processError(e));
    }
};