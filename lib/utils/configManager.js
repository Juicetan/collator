var fs = require('fs');
var _ = require('lodash');

var initConfig = function(filePath){
  var uri = filePath? filePath: configManager.cfg.DEFAULTCFGPATH;
  if(!filePath){
    console.log('> config file path not provided: using defaults');
  }

  try{
    var data = fs.readFileSync(uri);
  } catch(e){
    throw new Error("Config file read failed: "+uri);
  }
  try{
    _.extend(configManager.cfg,JSON.parse(data));
    console.log('> config file successfully parsed: '+uri);
  } catch(e){
    throw new Error("Malformed Config file: "+uri);
  }
};

var configManager = {
  cfg: {
    DEFAULTCFGPATH: __dirname+'/../../res/defaults.json',
  },
  initConfig: function(filePath){
    var cfgObj = this.cfg;
    var uri = filePath? filePath: cfgObj.DEFAULTCFGPATH;
    if(!filePath){
      console.log('> config file path not provided: using defaults');
    }

    try{
      var data = fs.readFileSync(uri);
    } catch(e){
      throw new Error("Config file read failed: "+uri);
    }
    try{
      _.extend(cfgObj,JSON.parse(data));
      console.log('> config file successfully parsed: '+uri);
    } catch(e){
      throw new Error("Malformed Config file: "+uri);
    }
  }
};

module.exports = configManager;