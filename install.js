'use strict';

var path = require('path')
  , fs = require('fs');

//
// Compatibility with older node.js.
//
var existsSync = fs.existsSync || path.existsSync;

//
// Our own pre-push hook runner.
//
var hook = fs.readFileSync('./hook_runner');

//
// The root of repository.
//
var root = path.resolve(__dirname, '../..');

//
// The location .git and it's hooks
//
var git = path.resolve(root, '.git')
  , hooks = path.resolve(git, 'hooks')
  , prepush = path.resolve(hooks, 'pre-push');

//
// Check if we are in a git repository so we can bail out early when this is not
// the case.
//
if (!existsSync(git) || !fs.lstatSync(git).isDirectory()) return;

//
// Create a hooks directory if it's missing.
//
if (!existsSync(hooks)) fs.mkdirSync(hooks);

//
// If there's an existing `pre-push` hook we want to back it up instead of
// overriding it and losing it completely
//
if (
     existsSync(prepush)
  && fs.readFileSync(prepush).toString('utf8') !== hook.toString('utf8')
) {
  console.log('');
  console.log('pre-push: Detected an existing git pre-push hook');
  fs.writeFileSync(prepush +'.old', fs.readFileSync(prepush));
  console.log('pre-push: Old pre-push hook backuped to pre-push.old');
  console.log('');
}

//
// Everything is ready for the installation of the pre-push hook. Write it and
// make it executable.
//
fs.writeFileSync(prepush, hook);
fs.chmodSync(prepush, '755');
