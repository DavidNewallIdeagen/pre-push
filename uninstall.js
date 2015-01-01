'use strict';

var path = require('path')
  , fs = require('fs');

//
// Compatibility with older node.js.
//
var existsSync = fs.existsSync || path.existsSync;

//
// The location of the pre-push hook.
//
var prepush = path.resolve(__dirname, '../..', '.git', 'hooks', 'pre-push');

//
// Bail out if we don't have pre-push file, it might be removed manually.
//
if (!existsSync(prepush)) return;

//
// If we don't have an old file, we should just remove the pre-push hook. But
// if we do have an old prepush file we want to restore that.
//
if (!existsSync(prepush +'.old')) {
  fs.unlinkSync(prepush);
} else {
  fs.writeFileSync(prepush, fs.readFileSync(prepush +'.old'));
  fs.chmodSync(prepush, '755');
  fs.unlinkSync(prepush +'.old');
}
