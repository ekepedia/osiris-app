const winston = require('winston');

winston.remove(winston.transports.Console);

winston.add(new winston.transports.Console({
    format: winston.format.simple()
}));