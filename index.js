#!/usr/bin/env node

var cmd = require('commander');
var cfgMan = require('./lib/utils/configManager');
var collateMan = require('./lib/utils/collateManager');
var fs = require('fs');
var q = require('q');

cmd
  .version('0.0.1')
  .description('An application for collating files into predefined folders')
  .option('-i, --initconfig', 'Initialize custom config file')
  .option('-p, --filepath [value]','Optional filepath modifier for configuration file')
  .option('-c, --collatepath [value]','Optional filepath modifier to start collating')
  .parse(process.argv);


var App = {
  run: function(){
    if(cmd.initconfig){
      var filePath = cmd.filepath?cmd.filepath:'.';
      cfgMan.createConfig(filePath);
      console.log('> Custom configuration file created:',filePath);
      return true;
    }

    this.initConfig().done(function(){
      var filePath = cmd.collatepath?cmd.collatepath:'.';
      collateMan.run(filePath);
    },function(e){
      throw e;
    });
  },
  initConfig: function(){
    var def = q.defer();
    cfgMan.initConfig();
    var filePath = cmd.filepath?cmd.filepath:'.';
    filePath = filePath.charAt(filePath.length - 1) === '/'?filePath:filePath+'/';
    var customConfigPath = filePath + cfgMan.cfg.CONFIGNAME;

    fs.stat(customConfigPath,function(err,stat){
      if(!err){
        console.log('> custom configuration found');
        cfgMan.initConfig(customConfigPath);
        def.resolve();
      } else if(err.code === "ENOENT"){
        console.log('> no custom configuration found');
        def.resolve();
      }
      def.reject("Unexpected error: custom configuration file read error");
    });


    return def.promise;
  }
};


App.run();
