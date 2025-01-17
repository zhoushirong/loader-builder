#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');
var builder = require('../lib/builder');
var colors = require('colors');

var argv = process.argv;

if (argv.length < 4) {
  console.log('Example: loader views_dir base_dir [--no-debug]');
  console.log('\tviews_dir: views folder');
  console.log('\tbase_dir: project root folder');
  console.log('');
  console.log('e.g. loader ./views ./');
  console.log('without debug file:');
  console.log('e.g. loader ./views ./ --no-debug');
  process.exit(1);
}

// app
var appDir = path.join(process.cwd());
// app/views
var viewsDir = path.join(process.cwd(), argv[2]);
// app/
var destDir = path.join(process.cwd(), argv[3]);
// no debug
var noDebug = argv[4] === '--no-debug';

var start = new Date();
// scan views folder, get the assets map
var scaned = builder.scanDir(viewsDir);
// check duplicate target
builder.checkTarget(scaned);
// console.log(scaned);
console.log(colors.magenta('Scaned.'), colors.cyan(scaned.length),
  colors.magenta('asset(s) will be build.'));

// combo？md5 hash
var minified = builder.minify(appDir, destDir, scaned, noDebug);
// console.log(minified);
console.log(colors.magenta(' 🏁  Compile static assets done.'),
  colors.gray('Build time'), colors.cyan(new Date() - start),
  colors.gray('ms.'));

// write the assets mapping into assets.json
var assets = path.join(destDir, 'assets.json');
console.log(colors.magenta('assets.json is here: '), colors.cyan(assets));
var map = builder.map(minified);
fs.writeFileSync(assets, JSON.stringify(map));
console.log(colors.magenta('write assets.json done. assets.json: '));
console.log(colors.gray(JSON.stringify(map, null, '  ')));
