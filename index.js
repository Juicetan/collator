#!/usr/bin/env node

var cmd = require('commander');
var cfgMan = require('./lib/utils/configManager');
var collateMan = require('./lib/utils/collateManager');
var fs = require('fs');
var q = require('q');

cmd
  .version('0.0.1')
  .description('A NodeJS command line utility to collate files into user defined folders based on user defined regular expressions.')
  .option('-i, --initconfig', 'Initialize a custom configuration file')
  .option('-p, --filepath [value]','Optional filepath modifier to specify where the newly created custom configuration file will be placed')
  .option('-c, --collatepath [value]','Optional override that will specify the path to begin recursive collation.  Overrides `ROOT_SEARCH_DIR`.')
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
      var filePath = '.';
      if(cmd.collatepath){
        filePath = cmd.collatepath;
      } else if(cfgMan.ROOT_SEARCH_DIR){
        filePath = cfgMan.ROOT_SEARCH_DIR;
      }
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
