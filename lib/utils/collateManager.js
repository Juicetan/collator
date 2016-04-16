var cfgMan = require('./configManager').cfg;
var fs = require('fs');
var _ = require('lodash');
var fsUtil = require('fs-utils');
var pathUtil = require('path');

var collateManager = {
  junkKey: null,
  junkFolderPath: null,
  run: function(startPath){
    if(!fsUtil.isDir(startPath)){
      throw new Error('Specified path is not a directory: ' + startPath);
    }

    var filterKeys = Object.keys(cfgMan.FILTERS);
    this.junkKey = _.find(filterKeys,function(key){
      return cfgMan.FILTERS[key] === "*";
    });
    this.junkFolderPath = this.junkKey?cfgMan.FILTERS[this.junkKey]:null;

    this.walk(startPath);
  },
  walk: function(path){
    var man = this;
    var lsElems = fs.readdirSync(path);
    for(var i = 0; i < lsElems.length; i++){
      var elem = lsElems[i];
      var fullPathElem = pathUtil.join(path,elem);
      if(fsUtil.isDir(fullPathElem)){
        console.log('dir:',fullPathElem);
        man.walk(fullPathElem);
      } else{
        console.log('file:',fullPathElem);
      }
    }
  }
};

module.exports = collateManager;
