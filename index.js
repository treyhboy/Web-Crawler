var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Crawler = require("crawler");

function spider(url){

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var d;
            var c = new Crawler({
                rateLimit: 2000, // `maxConnections` will be forced to 1
                callback: function(err, res, done){
                    d = $('.r').children()[0].attribs.href;
                    console.log(d);
                    fs.writeFile(`data.json`,d,function (){console.log("written")});
                    done();
                }
            });

            c.queue(url);
        }
    })
}

function go(url,name){

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var d;
            var c = new Crawler({
                rateLimit: 2000, // `maxConnections` will be forced to 1
                callback: function(err, res, done){
                    //for getting href from google first link (r is th classname for every links in google)
                    d = $('.r').children()[0].attribs.href;
                    //Link in the format (/url?q=http://www) so to cut short the format to http
                    d = d.slice(7,d.length);
                    d={"name":name,"url":d};
                    console.log(d);
                    var k = JSON.parse(fs.readFileSync('data.json', 'utf8'));
                    k.push(d);
                        fs.writeFileSync(`data.json`,JSON.stringify(k),function (){console.log("written")});
                        // fs.appendFileSync(`data.json`,",",function (){console.log("written")})



                    done();
                }
            });

            c.queue(url);
        }
    })
}

//MAIN CODE START FROM HERE

var obj = JSON.parse(fs.readFileSync('colleges.json', 'utf8'));
var t = []
//READ SEARCH DATA FROM FILE
fs.writeFile(`data.json`,JSON.stringify(t),function (){console.log("written")});
//CRAWL GOOGLE FOR WEBSITE LINKS OF THAT DATA
for (var i in obj)
{
    console.log(obj[i])
    var name = obj[i]
    url = `https://www.google.co.in/search?source=hp&ei=wBGYW-v2BMjrvgTy06vgBA&q=${name}`;
    go(url,name);
}