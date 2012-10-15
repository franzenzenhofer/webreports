var brand = 'bellaflora';
var siteUrl = 'http://www.bellaflora.at/';
var landingPageUrl = 'http://www.bellaflora.at/de/516/produktdetail/produkte/zimmerpflanzen/1/show_detail/alpenveilchen.html';
var robotsUrl = siteUrl + 'robots.txt';
var startPageHeaderData;
var landingPageHeaderData;

var dump = require('utils').dump;
var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    viewportSize:{
        width: 1440,
        height: 900
    }
});


casper.on('http.status.404', function(resource) {
    this.echo('wait, this url is 404: ' + resource.url);
});

function getHeaderData(){
    var canonical = document.querySelector('link[rel="canonical"]');
    var robots = document.querySelector('meta[name="robots"]');
    var description = document.querySelector('meta[name="DESCRIPTION"]');
    canonical = canonical ? canonical.getAttribute('href') : 'none';
    robots = robots ? robots.getAttribute('content') : 'none';
    description = description ? description.getAttribute('content') : 'none';
    return {
        'canonical': canonical,
        'robots': robots,
        'description': description
    }
    
}

casper.start(siteUrl);

// startpage processing
// Q: Does the start page have a canonical tag?
// Q: Does the start page have a meta robots tag?
// Q: Does the start page have a title? (If yes, what?)
// Q: Does the start page have a meta description?
casper.then(function getStartPageHeaderData(){
    this.echo(this.getTitle());
    headerData = this.evaluate(getHeaderData);
    dump(headerData);
});
// Q: Get a screenshot of the startpage
casper.then(function getStartPageScreenshot(){
    this.wait(3000, function(){
        this.echo(this.getCurrentUrl());
        this.captureSelector(brand + '_startpageview.png', 'body');
    });
});

// landing page processing
// Q: Does the landing page have a canonical tag?
// Q: Does the landing page have a meta robots tag?
// Q: Does the landing page have a title? (If yes, what?)
// Q: Does the landing page have a meta description?
casper.thenOpen(landingPageUrl function getLandingPageHeaderData() {
    this.echo(this.getTitle());
    landingPageHeaderData = this.evaluate(getHeaderData);
    dump(landingPageHeaderData);
});
// Q: Get a screenshot of the landingpage
casper.thenOpen(landingPageUrl, function getLandingPageScreenshot() {
    this.wait(3000, function(){
        this.captureSelector(brand + '_landingpageview.png', 'body');
    });
});

// Q: Get the contents of robots.txt
casper.thenOpen(robotsUrl, function() {
    this.echo(this.getCurrentUrl());
  if(this.currentHTTPStatus != '404'){
    this.echo('robots.txt found', 'INFO');
    this.download(robotsUrl, brand+'_robots.txt')
  } else {
    this.echo('no robots.txt found', 'WARNING');
  }
});



// google-bot view
// casper.then(function() {
//     var a = this.evaluate(function(){
//         __utils__.removeElementsByXpath('//img');
//         //__utils__.removeElementsByXpath('//body');
//     });
//     this.echo(this.getCurrentUrl());
//     this.captureSelector('startpageview_googlebot.png', 'body');
// });



casper.run();
