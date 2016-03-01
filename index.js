#!/usr/bin/env node
var program = require('commander');
var appInfo = require('./package.json');
var createPng = require('./bin/createPng');
var fs=require("fs");
global.config={
	pngPath:"E:/newsvn/tem-frontend-mathjaxPng/mathjax.png"
};

program
	.version(appInfo.version)
	.usage('输入mathjax字符串，生成png，返回文件路径。[options] <package>');

//像git风格一样的子命令
program
	//子命令
	.command('mathjax <mathjax>')
	//短命令 - 简写方式
	.alias('rs')
	//说明
	.description('输入mathjax字符串，生成png，返回文件路径。！')
	//resume的子命令
	//.option("-n, --name <mode>", "然并卵")
	//注册一个callback函数
	.action(function(mathjax, options){
		fs.unlink(global.config.pngPath,callback);
		function callback(){
			createPng.init(mathjax);
		}
	}).on('--help', function() {
		//这里输出子命令的帮助
		console.log('  Examples:');
		console.log('    运行方法：');
		console.log('    $ ./index.js mathajx YiArIHkgPSBcc3FydHtmfSA9IFxzdW1fbl41IHt4fQ==');
		console.log();
	});

program.parse(process.argv);





