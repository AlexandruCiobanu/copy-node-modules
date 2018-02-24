#!/usr/bin/env node
var path = require('path');
var copyNodeModules = require('../');
var args = process.argv.slice(2);

if (args.length < 2)
{
    console.error('Usage: copy-node-module src_dir dest_dir [--dev] [-v|--verbose] [--include <comma_separated_package_list>] ');
    process.exit(1);
}

var srcDir = args[0].trim(),
    dstDir = args[1].trim(),
    devDeps = false,
    verbose = false,
    packageList = [];

// parse input arguments
if (args.indexOf('--dev') !== -1)
    devDeps = true;
if (args.indexOf('-v') !== -1 || args.indexOf('--verbose') !== -1)
    verbose = true;

if (args.indexOf("--include") !== -1){
    var packages = args[args.indexOf("--include") + 1];
    if(!packages){
        console.error('No included packages provided');
        process.exit(1);
    }
    packageList = packages.split(",");
}

if (!path.isAbsolute(srcDir))
    srcDir = path.resolve(process.cwd(), srcDir);
if (!path.isAbsolute(srcDir))
    dstDir = path.resolve(process.cwd(), dstDir);


var options = {devDependencies: devDeps};
if(packageList.length > 0){
    options.include = packageList;
}
copyNodeModules(srcDir, dstDir, options, function(err, packages) {
    if (err)
    {
        console.error('Error:' + err);
        process.exit(1);
    }
    if (verbose)
    {
        console.log('Module List:');
        for (var i in packages)
            console.log(' * ' + packages[i].name);
        console.log('Total: ' + packages.length + ' modules.');
    }
});
