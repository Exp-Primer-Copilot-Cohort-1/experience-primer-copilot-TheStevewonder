//create web server 
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var comments = require('./comments');

//create server
var server = http.createServer(function(req,res){
	//get url
	var url = req.url;
	//get method
	var method = req.method.toLowerCase();
	//get pathname
	var pathname = url.split('?')[0];
	//get query
	var query = url.split('?')[1];
	//get queryObj
	var queryObj = {};
	query && query.split('&').forEach(function(item){
		var arr = item.split('=');
		queryObj[arr[0]] = arr[1];
	});
	//get post data
	var str = '';
	req.on('data',function(data){
		str += data;
	});
	req.on('end',function(){
		var post = {};
		str && str.split('&').forEach(function(item){
			var arr = item.split('=');
			post[arr[0]] = arr[1];
		});
		//pathname
		if(pathname == '/'){
			//read index.html
			fs.readFile('./index.html',function(err,data){
				if(err){
					res.setHeader('Content-Type','text/plain;charset=utf-8');
					res.end('文件读取失败，请稍后重试！');
				}else{
					res.setHeader('Content-Type','text/html;charset=utf-8');
					res.end(data);
				}
			});
		}else if(pathname == '/getComments'){
			//get comments
			comments.getComments(function(err,data){
				if(err){
					res.setHeader('Content-Type','text/plain;charset=utf-8');
					res.end('文件读取失败，请稍后重试！');
				}else{
					res.setHeader('Content-Type','application/json;charset=utf-8');
					res.end(JSON.stringify(data));
				}
			});
		}else if(pathname == '/addComment'){
			//add comment
			comments.addComment(post,function(err,data){
				if(err){
					res.setHeader('Content-Type','text/plain;charset=utf-8');
					res.end('文件读取失败，请稍后重试！');
				}else{
					res.setHeader('Content-Type','application/json;charset=utf-8');
					res.end(JSON.stringify(data));
				}
			});
		}else if(pathname == '/deleteComment'){
			//delete comment