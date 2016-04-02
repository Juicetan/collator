#!/usr/bin/env node

var cmd = require('commander');
var cfgMan = require('./lib/utils/configManager');

cmd
  .version('0.0.1')
  .description('An application for collating files into predefined folders')
  .option('-i, --initconfig', 'Initialize custom config file')
  .parse(process.argv);

if(cmd.initconfig){
  cfgMan.createConfig('.');
  console.log('> Custom configuration file created');
} else{

}