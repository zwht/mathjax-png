var base64 = require("./base64");
var mathjax = require("./mathjax");
var fs=require("fs");

var en = base64.base64encode("\\begin{array}{c|lcr} n & \\text{Left} & \\text{Center} & \text{Right} \\\\ \\hline 1 & 0.24 & 1 & 125 \\\\ 2 & -1 & 189 & -8 \\\\ 3 & -20 & 2000 & 1+10i \\\\ \\end{array}");
var de = base64.base64decode("YiArIHkgPSBcc3FydHtmfSA9IFxzdW1fbl41IHt4fQ==");


function createPng(data) {
	var base64Data = data.replace(/^data:image\/png;base64,/, ""),
		binaryData = new Buffer(base64Data, 'base64').toString('binary');
	fs.writeFile(global.config.pngPath, binaryData, "binary", function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("succeed:path"+global.config.pngPath);
		}
	});
}

function init(str) {
	//str=en;
	mathjax.creatPng(base64.base64decode(str), createPng);
}

exports.init = init;