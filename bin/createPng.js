var base64 = require("./base64");
var mathjax = require("./mathjax");
var fs=require("fs");
var path=require("path");

/*var en = base64.base64encode("b + y = \\sqrt{f} = \\sum_n^5 {x}");
var de = base64.base64decode("YiArIHkgPSBcc3FydHtmfSA9IFxzdW1fbl41IHt4fQ==");*/

function createPng(data) {
	var base64Data = data.replace(/^data:image\/png;base64,/, ""),
		binaryData = new Buffer(base64Data, 'base64').toString('binary');
	fs.writeFile(path.join(__dirname, 'mathjax.png'), binaryData, "binary", function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("succeed:path"+path.join(__dirname, 'mathjax.png'));
		}
	});
}

function init(str) {
	mathjax.creatPng(base64.base64decode(str), createPng);

}

exports.init = init;