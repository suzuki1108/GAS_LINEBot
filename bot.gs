
//ACCESS_TOKENはGitHubに上げる都合上、スプレッドシート上から取得
function getACCESS_TOKEN(){
  const sheet = SpreadsheetApp.getActiveSheet();
  return sheet.getRange('A1').getValue();
}

function doPost(e){
  let replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  const url = 'https://api.line.me/v2/bot/message/reply';
  const ACCESS_TOKEN = getACCESS_TOKEN();

  UrlFetchApp.fetch(url, {
    'headers': {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': getMaxim(), 
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'}))
          .setMimeType(ContentService.MimeType.JSON);
}

function getMaxim(){
  //スクレイピングするURL(名言集.com)
  let url = "http://www.meigensyu.com/quotations/index/random";
  //fetchでHTMLデータを取得する
  let html = UrlFetchApp.fetch(url).getContentText();
  
  //格言をDOMから取得
  let maxim = Parser.data(html)
  .from('<div class="text">')
  .to('</div>')
  .build();
  //著者?をDOMから取得
  let author = Parser.data(html)
  .from('/page1.html">')
  .to('</a>')
  .iterate();

  /*格言と著者を返信用文章にフォーマットして返す。
  著者はWebサイトのDOMの都合上、リストで取得し、要素の２番目を返す。*/
  let retval = maxim + '\nBy ' + author[1]; 
  return retval.replace('<br/>','');
}

function getMaximTest(){
  console.log(getMaxim());
}

function getACCESS_TOKENTest(){
  console.log(getACCESS_TOKEN());
}