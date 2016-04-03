#!/usr/bin/env node

var cmd = require('commander');
var cfgMan = require('./lib/utils/configManager');

cmd
  .version('0.0.1')
  .description('An application for collating files into predefined folders')
  .option('-i, --initconfig', 'Initialize custom config file')
  .option('-p, --filepath [value]','Optional filepath modifier')
  .parse(process.argv);


var App = {
  run: function(){
    if(cmd.initconfig){
      var filePath = cmd.filepath?cmd.filepath:'.';
      cfgMan.createConfig(filePath);
      console.log('> Custom configuration file created:',filePath);
      return true;
    }

    this.initConfig();
  },
  initConfig: function(){
    cfgMan.initConfig();

  }
};


App.run();