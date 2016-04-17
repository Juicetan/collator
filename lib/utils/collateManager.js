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
    this.junkFolderPath = this.junkKey?cfgMan.DESTINATION_DIRS[this.junkKey]:null;

    this.excludePaths = cfgMan.PATH_EXCLUSIONS;
    var destKeys = Object.keys(cfgMan.DESTINATION_DIRS);
    this.excludePaths = this.excludePaths.concat(destKeys.map(function(key){
      return cfgMan.DESTINATION_DIRS[key];
    }));

    console.log("> verifying destination paths");
    this.initDestinations();

    console.log('> collation started');
    this.walk(startPath);
    console.log('> collation complete');
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
  collateFile: function(fileName,filePath){
    var man = this;
    var filterKeys = Object.keys(cfgMan.FILTERS);
    var filterKey = _.find(filterKeys,function(key){
      if(key === man.junkKey){
        return false;
      }
      var regex = new RegExp(cfgMan.FILTERS[key],'ig');
      return regex.test(fileName);
    });

    var destination = man.junkFolderPath;
    if(filterKey){
      destination = cfgMan.DESTINATION_DIRS[filterKey];
    }

    fs.renameSync(filePath,pathUtil.join(destination,fileName));
  },
  walk: function(path){
    var man = this;
    var lsElems = fs.readdirSync(path);
    for(var i = 0; i < lsElems.length; i++){
      var elem = lsElems[i];
      var fullPathElem = pathUtil.join(path,elem);
      if(fsUtil.isDir(fullPathElem)){
        if(!man.excludeFolder(fullPathElem)){
          man.walk(fullPathElem);
        }
      } else if(!man.excludeFile(elem)){
        man.collateFile(elem,fullPathElem);
      }
    }
  }
};

module.exports = collateManager;
