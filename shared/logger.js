
//Set these for desired result
var CONSOLE_LOGGING = false;
var REMOTE_LOGGING = true;

class Logger {

  constructor() {
    this.console_logging = CONSOLE_LOGGING;
    this.remote_logging = REMOTE_LOGGING;

  }

  log(text, object){

    if (!object){
      object = ''
    }

    if (this.console_logging){
      console.log(text, object);
    }

    if (this.remote_logging){
      //log with loggly or something,
    }

  }

  warn(text, object){

    if (!object){
      object = ''
    }

    if (this.console_logging){
      console.warn(text, object);
    }

    if (this.remote_logging){
      //log with loggly or something,
    }

  }

  error(text, object){

    if (!object){
      object = ''
    }

    if (this.console_logging){
      console.error(text, object);
    }

    if (this.remote_logging){
      //log with loggly or something,
    }

  }

}

module.exports = new Logger(true, false);
