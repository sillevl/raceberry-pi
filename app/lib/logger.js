var winston = require( 'winston' );
var settings = require('../settings');

 
winston.setLevels( winston.config.npm.levels );
winston.addColors( winston.config.npm.colors );
 
logger = new( winston.Logger )( {
	transports: [
		new winston.transports.Console( {
			level: settings.logger.level, // Only write logs of warn level or higher
			colorize: 'all'
		} ),
    ]
} );
 
module.exports = logger;