var cfgMan = require('./configManager').cfg;
var fs = require('fs');
var _ = require('lodash');
var fsUtil = require('fs-utils');
var pathUtil = require('path');

var collateManager = {
  junkKey: null,
  junkFolderPath: null,
  excludePaths: [],
  run: function(startPath){
    if(!fsUtil.isDir(startPath)){
      throw new Error('Specified path is not a directory: ' + startPath);
    }

    var filterKeys = Object.keys(cfgMan.FILTERS);
    this.junkKey = _.find(filterKeys,function(key){
      return cfgMan.FILTERS[key] === "*";
    });
    this.junkFolderPath = this.junkKey?cfgMan.FILTERS[this.junkKey]:null;

    this.excludePaths = cfgMan.PATH_EXCLUSIONS;
    var destKeys = Object.keys(cfgMan.DESTINATION_DIRS);
    this.excludePaths = this.excludePaths.concat(destKeys.map(function(key){
      return cfgMan.DESTINATION_DIRS[key];
    }));

    this.initDestinations();

    this.walk(startPath);
  },
  initDestinations: function(){
    var destKeys = Object.keys(cfgMan.DESTINATION_DIRS);
    for(var i = 0; i < destKeys.length; i++){
      (function(index){
        var destKey = destKeys[index];
        var destinationPath = cfgMan.DESTINATION_DIRS[destKey];
        try{
          var statObj = fs.statSync(destinationPath);
        } catch(e){
          fs.mkdir(destinationPath);
        }
      })(i);
    }
  },
  excludeFolder: function(folderPath){
    return _.find(this.excludePaths,function(value,index){
      return fsUtil.equivalent(folderPath,value);
    });
  },
  excludeFile: function(fileName){
    return fileName === cfgMan.CONFIGNAME;
  },
  walk: function(path){
    var man = this;
    var lsElems = fs.readdirSync(path);
    for(var i = 0; i < lsElems.length; i++){
      var elem = lsElems[i];
      var fullPathElem = pathUtil.join(path,elem);
      if(fsUtil.isDir(fullPathElem)){
        if(!man.excludeFolder(fullPathElem)){
          console.log('dir:',fullPathElem);
          man.walk(fullPathElem);
        }
      } else if(!man.excludeFile(elem)){
        console.log('file:',elem);
      }
    }
  }
};

module.exports = collateManager;
