var fs = require('fs');
var mjAPI = require("mathjax-node/lib/mj-single.js");
var opts = process.argv.splice(2);
mjAPI.config({
	MathJax: {
		/*SVG: {
		 font: "STIX-Web"
		 },
		 tex2jax: {
		 preview: ["[math]"],
		 processEscapes: true,
		 processClass: ['math'],
		 //                inlineMath: [ ['$','$'], ["\\(","\\)"] ],
		 //                displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
		 skipTags: ["script", "noscript", "style", "textarea", "pre", "code"]
		 },
		 TeX: {
		 noUndefined: {disabled: true},
		 Macros: {
		 mbox: ['{\\text{#1}}', 1],
		 mb: ['{\\mathbf{#1}}', 1],
		 mc: ['{\\mathcal{#1}}', 1],
		 mi: ['{\\mathit{#1}}', 1],
		 mr: ['{\\mathrm{#1}}', 1],
		 ms: ['{\\mathsf{#1}}', 1],
		 mt: ['{\\mathtt{#1}}', 1]
		 }
		 }*/
	}
});
mjAPI.start();
//node ./bin/mathjaxToPng E:/newsvn/tem-frontend-mathjaxPng/src/views/wrongQuestion.html

var replaceArr=[
	/*{
		reqExp:/≤/g,
		replaced:"\\leq"
	}*/
];

fs.readFile(opts[0],{encoding:'utf8',flag:'r'},function (err, data) {
	if (err) {
		console.log("error readFile be defeated");
	}else{
		for(var i=0;i<replaceArr.length;i++){
			data = data.replace(replaceArr[i].reqExp, replaceArr[i].replaced);
		}
		mathjaxInit(data);
	}
});

function mathjaxInit(str){

	mjAPI.typeset({math: str, format: "TeX", png: true}, function (data) {
		if (!data.errors) {
			createPng(data.png)
		} else {
			console.log("error mathJax to png be defeated");
		}
	});
}
function createPng(data) {
	var base64Data = data.replace(/^data:image\/png;base64,/, ""),
		binaryData = new Buffer(base64Data, 'base64').toString('binary');
	fs.writeFile(opts[0].replace(".txt","")+".png", binaryData, "binary", function (err) {
		if (!err) {
			console.log("succeed");
		} else {
			console.log("error writeFile be defeated");
			//console.log(opts[0].replace(".txt","")+".png");
		}
	});
}



