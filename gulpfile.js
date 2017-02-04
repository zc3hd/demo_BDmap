'use strict';

const gulp = require('gulp');

// 热刷
const fs = require('fs');
const path = require('path');
const broswer = require('browser-sync');
var target = path.join(__dirname,'./webapp/html/monitor_main.html');
var footname = path.resolve(__dirname,'./webapp');

// 实时监控的测试
var ms = null;
gulp.task('default', () => {
  ms = broswer.create('My Server');
  ms.init({
    notify: false,
    server: footname,
    index: './html/monitor_main.html',
    // index: './main.html',
    port:1234,
    // tunnel: "myprivatesitecccccccccccc",
    logConnections: true
  });

  gulp.watch('webapp/**/*', ['reload']);
});

gulp.task('reload', () => {
  ms.reload();
});


// 围栏设置的测试
var ms_Fence = null;
gulp.task('wl', () => {
  ms_Fence = broswer.create('My Server');
  ms_Fence.init({
    notify: false,
    server: footname,
    index: './html/monitor_fence_set.html',
    // index: './main.html',
    port:1235,
    // tunnel: "myprivatesitecccccccccccc",
    logConnections: true
  });

  gulp.watch('webapp/**/*', ['reload_Fence']);
});

gulp.task('reload_Fence', () => {
  ms_Fence.reload();
});
