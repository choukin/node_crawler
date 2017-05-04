var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var request = require('request')

var i = 0;
var url = 'http://www.pingfandeshijie.net/di-yi-bu-01.html'

function fetchPage(x){
  starRequest(x)
}

function starRequest( x ) {
  http.get(x, function (res){
    var html = ''
    var titles = []
    res.setEncoding('utf-8')
    res.on('data',function(chunk){
      html += chunk;
    })
    res.on('end',function(){
      var $ = cheerio.load(html)

      var news_item = {
        title:$('div.main h1').text().trim(),
        
        i:i=i+1
      }
      console.log(news_item);
      var news_title = news_item.title
      saveContent($,news_title)

      var nextLink =  $("div.content p a").attr('href')

      if(i <= 500){
        console.log(nextLink)
        fetchPage(nextLink)
      }
    })
  }).on('error', function (err) {
    console.log(err);
  })
}

function saveContent($, news_title) {
  $('div.main div.content p').each(function(index,item){
    var x = $(this).text().trim()
    var y = x.substring(0,2).trim()
    console.log(x.indexOf('下一章：') +" 123 " +x)
    if(x.indexOf('下一章：')!=-1){
     console.log('x' + x);
      return false
    }
    if(y !== ''   ){
      console.log("p  "+x)
      x = x + '\n';
      fs.appendFile('./book/'+ news_title +'.txt',x,'utf-8',function(err){
        if(err){
          console.log(err)
        }
      })
    }
  })
}

function savedImg($, news_title){
  $('.article-content img').each(function(index,item){
    var img_title = $(this).parent().next().text().trim()
    if(img_title.length > 35 || img_title == ""){
      img_title = "Null"
    }
    var img_filename = img_title +'.jpg'
    var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src')
    request.head(img_src,function(err,res,body){
      if(err){
      console.log(err);
      }
    });
    request(img_src).pipe(fs.createWriteStream('./image/' + news_title + '---'+ img_filename))
  })
}

fetchPage(url)
