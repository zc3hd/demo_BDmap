'use strict';

const gulp = require('gulp');

// 热刷
const fs = require('fs');
const path = require('path');
const broswer = require('browser-sync');
var target = path.join(__dirname,'./webapp/html/monitor_main.html');
var footname = path.resolve(__dirname,'./webapp');
var basename = path.basename(target);


gulp.task('test',()=>{
	broswer({
		notify:false,
		server:footname,
		index:basename
	});
	gulp.watch('webapp/**/*',['reload']);
});

gulp.task('reload',()=>{
	broswer.reload();	
});
