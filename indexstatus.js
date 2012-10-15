var brand = ''
   ,brandUrl = ''
   ,siteUrl = 'https://accounts.google.com/ServiceLogin?service=sitemaps&passive=1209600&continue=https://www.google.com/webmasters/tools/?hl%3Dde&followup=https://www.google.com/webmasters/tools/?hl%3Dde&hl=en'
   ,username = ''
   ,password = ''
   ,result = {};


var dump = require('utils').dump;
var x = require('casper').selectXPath;
var casper = require('casper').create({
    verbose: true,
    logLevel: 'warning',
    viewportSize:{
        width: 1440,
        height: 900
    }
});

casper.on('http.status.404', function(resource) {
    this.echo('wait, this url is 404: ' + resource.url);
});

casper.start(siteUrl, function fillLoginForm() {
	this.fill('#gaia_loginform', {
        'Email': username,
        'Passwd': password,
    }, true);
});

// http://casperjs.org/api.html#casper.clickLabel
casper.wait(3000, function navToSitemaps(){
    this.clickLabel(brandUrl, 'a');
});

casper.then(function navToSitemaps(){
    this.clickLabel('Sitemaps', 'a');
});

// this would reduce the a tag to the only, real sitemap index 
// according to type "Sitemap index" (but the xpath doesnt work)
// casper.then(function navToSitemapIndex(){
//     this.click(x('.//tr[./td/div[contains(text(), "Sitemap index")]]/td/div/a'));
// });
// this solution is hacky, bc it just takes an a tag with  the text value
// containing "sitemaps.xml"

casper.waitForSelector('#footer', function navToSitemapIndex(){
    this.click(x('.//a[contains(text(), "sitemaps.xml")]'));
});

casper.then(function getIndexRatio() {
   this.wait(1000, function(){
        result.submitted = this.fetchText('.gwt-TabBar.wmxCardTabBar  .gwt-TabBarItem-wrapper:nth-last-child(2) tr:nth-last-child(2) div:nth-last-child(2)');
        result.indexed = this.fetchText('.gwt-TabBar.wmxCardTabBar  .gwt-TabBarItem-wrapper:nth-last-child(2) tr:nth-last-child(1) div:nth-last-child(2)');
        dump(result);
    })

});

casper.run();