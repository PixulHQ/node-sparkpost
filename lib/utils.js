'use strict';

module.exports.isObject = (val) => {

    return val !== null && typeof val === 'object' && Array.isArray(val) === false;
};

module.exports.parseParams = (options, parameters) => {

    Object.keys(parameters).forEach((paramname) => {

        if (Array.isArray(parameters[paramname])) {

            options.searchParams[paramname] = parameters[paramname].join(',');
        }
        else {

            options.searchParams[paramname] = parameters[paramname];
        }
    });

    return options;
};
