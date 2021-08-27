const http = require('http'),
      fs = require('fs'),
      url = require('url');

http.createServer((request, response) => {
  let addr = request.url,
      q = url.parse(addr, true),
      filePath = '';
  //logging
  fs.appendFile('log.txt', 'URl: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  //pathname of q (URL) includes word 'documentation'
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  //readFile to grab right file (filePath refers to full pathname of URL you fetched and parsed) from server
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }
    response.writeHead(200, {'Content-Tpye': 'text/html'});
    response.write(data);
    response.end();
  });
  
}).listen(8080);

console.log('My test server is runing on Port 8080.');
