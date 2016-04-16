var cfgMan = require('./configManager');
var fs = require('fs');
var fsUtil = require('fs-utils');

var collateManager = {
  junkFolderPath: '',
  run: function(startPath){
    if(!fsUtil.isDir(startPath)){
      throw new Error('Specified path is not a directory: ' + startPath);
    }

    
  },
};

module.exports = collateManager;
