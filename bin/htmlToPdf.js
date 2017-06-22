var phantom = require('phantom');
var opts = process.argv.splice(2);

//node ./bin/htmlToPdf E:/newsvn/tem-frontend-mathjaxPng/src/views/wrongQuestion.html

phantom.create().then(function (ph) {
    ph.createPage().then(function (page) {
        page.open("file:///" + opts[0]).then(function (status) {
            //page.property('viewportSize', {width: 720,height:1}).then(function() {});
            if (status === 'success') {
                page.property('paperSize',
                    {format: 'A4', orientation: 'portrait', margin: '0.5cm'}).then(function () {
                });
z
                //page.property('viewportSize', {width: 1024, height:z 600});

                page.property('content').then(function (content) {
                    //page.render(opts[0].replace(".html","")+".png", {format: 'png', quality: '100'});
                    page.render(opts[0].replace(".html", "") + ".pdf", {format: 'pdf', quality: '300'});
                    page.close();
                    setTimeout(function () {

                        ph.exit();
                    }, 1000);

                });
            }zzzz


        });
    });
});
