// a simple TeX-input example
var mjAPI = require("mathjax-node/lib/mj-single.js");
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

var json = {
	math: "E = mc^2",
	format: "TeX", // "inline-TeX", "MathML"
	png: true //  svg:true,
};

function creatPng(str,callBack) {
	json.math = str;
	mjAPI.typeset(json, function (data) {
		if (!data.errors) {
			console.log(data.png);
			//callBack(data.png);
		}
	});
}

exports.creatPng = creatPng;