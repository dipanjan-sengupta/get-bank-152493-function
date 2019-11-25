const mapper = require('object-mapper');
const query = require('json-query');

const map = (data, map, variables) => {
    let source = Object.assign({}, variables);
    for (var item in source) {
        source[item] = query(variables[item], { data: data }).value;
    }
    const target = mapper(source, map);
    return target;
};

module.exports = map;