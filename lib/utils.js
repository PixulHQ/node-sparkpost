'use strict';

module.exports.isObject = (val) => {

    return val !== null && typeof val === 'object' && Array.isArray(val) === false;
};

module.exports.parseParams = (options, parameters) => {

    Object.keys(parameters).forEach((paramname) => {

        if (Array.isArray(parameters[paramname])) {
            options.qs[paramname] = parameters[paramname].join(',');

        }
        else {

            options.qs[paramname] = parameters[paramname];
        }
    });

    return options;
};
