#!/usr/bin/env node

var cmd = require('commander');
var cfgMan = require('./lib/utils/configManager');
var fs = require('fs');

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
    var filePath = cmd.filepath?cmd.filepath:'.';
    filePath = filePath.charAt(filePath.length - 1) === '/'?filePath:filePath+'/';
    var customConfigPath = filePath + cfgMan.cfg.CONFIGNAME;

    fs.stat(customConfigPath,function(err,stat){
      if(!err){
        cfgMan.initConfig(customConfigPath);
      } else if(err.code === "ENOENT"){
        console.log('> no custom configuration found');
      }
    });
  }
};


App.run();