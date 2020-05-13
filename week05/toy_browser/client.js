const net = require('net');

class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.path = options.path || '/'
    this.port = options.port || 80
    this.body = options.body || {}
    this.headers = options.headers || {}
    if(!this.headers['Content-Type']){
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if(this.headers['Content-Type'] == 'application/json'){
      this.bodyText = JSON.stringify(this.body)
    }else if (this.headers['Content-Type'] = 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key =>  `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }

    this.headers['Content-Length'] = this.bodyText.length
  }
  toString(){
    var headers = Object.keys(this.headers).map(key=>`${key}:${this.headers[key]}`).join('\r\n')
    return `${this.method} ${this.path} HTTP/1.1\r\n${headers}\r\n\r\n${this.bodyText}`
  }
  send(connection){
    return new Promise((resolve, reject)=>{
      const parser = new ResponseParser()
      if(connection){
        connection.write(this.toString())
      }else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () =>  { // 'connect' listener.
            console.log('connected to server!');
            connection.write(this.toString())
        });

        connection.on('data', (data) => {
          parser.receive(data.toString())

          if(parser.isFinished){
            console.log(parser.response,'parser.response');
            resolve(parser.response);
          }
          // resolve(data.toString());
          connection.end();
        });
        connection.on('err', (err) => {
          console.log('disconnected from server');
          resolve(err);
        });
        connection.on('end', () => {
          console.log('disconnected from server');
        });
      }
    })

  }
}

class Response {
  constructor() {

  }
}
class ResponseParser {
  constructor() {
    // 状态机的状态 的定义
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_HEADER_BLOCK_END = 6
    this.WAITING_BODY = 7

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyParser = null
  }
  get isFinished(){
    return this.bodyParser && this.bodyParser.isFinished
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 (\d+) (\w+)/)
    return {
      statusCode:RegExp.$1,
      statusText:RegExp.$2,
      headers:this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  receive(string){
    for (var i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }
  receiveChar(char){
    // statusLine
    if(this.current === this.WAITING_STATUS_LINE){
      if(char === '\r'){
        this.current = this.WAITING_STATUS_LINE_END
      }else {
        this.statusLine +=char
      }
    }else if(this.current == this.WAITING_STATUS_LINE_END) {
      if(char === '\n'){
        this.current = this.WAITING_HEADER_NAME
      }
    }else if(this.current === this.WAITING_HEADER_NAME){
      if(char === ':'){
        this.current = this.WAITING_HEADER_SPACE
      }else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
        // 在这里知道潘body 用什么解析
        if(this.headers['Transfer-Encoding'] === 'chunked'){
          this.bodyParser = new TrunkedBodyParser()
        }

      }else  {
        this.headerName +=char
      }
    }else if(this.current === this.WAITING_HEADER_SPACE){
      if(char === ' '){
        this.current = this.WAITING_HEADER_VALUE
      }
    }else if(this.current === this.WAITING_HEADER_VALUE){
      // console.log('WAITING_HEADER_VALUE');
      if(char === '\r'){
        this.current = this.WAITING_HEADER_LINE_END
        // 存键值对存到 header里面
        this.headers[this.headerName] = this.headerValue
        this.headerValue = ''
        this.headerName = ''
      }else  {
        this.headerValue +=char
      }
    }else if(this.current === this.WAITING_HEADER_LINE_END){
      if(char === '\n'){
        this.current = this.WAITING_HEADER_NAME
      }
    }else if(this.current === this.WAITING_HEADER_BLOCK_END){
      if(char === '\n'){
        this.current = this.WAITING_BODY
      }
    } else if(this.current === this.WAITING_BODY){
      this.bodyParser.receiveChar(char)
    }

  }
}
// 这是 body 的解析
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_TRUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.isFinished = false

    this.length = 0
    this.content = []
    this.current = this.WAITING_LENGTH
  }
  receiveChar(char){

    if(this.current === this.WAITING_LENGTH){
      if(char === '\r'){
        if(this.length == 0){
          this.isFinished = true
        }
        this.current = this.WAITING_LENGTH_LINE_END
      }else {
        this.length *= 10
        this.length += char.charCodeAt(0) - '0'.charCodeAt(0)
      }
    }else if(this.current === this.WAITING_LENGTH_LINE_END){
      if(char === '\n'){
        this.current = this.READING_TRUNK
      }
    }else if(this.current === this.READING_TRUNK){
      this.content.push(char)
      this.length--
      if(this.length == 0){
        this.current = this.WAITING_NEW_LINE
      }
    }else if(this.current === this.WAITING_NEW_LINE){
      if(char === '\r'){
        this.current = this.WAITING_NEW_LINE_END
      }
    }else if(this.current === this.WAITING_NEW_LINE_END){
      if(char === '\n'){
        this.current = this.WAITING_LENGTH
      }
    }
  }
}

void async function(){
  let request = new Request({
    method: "POST",
    host: '127.0.0.1',
    port: '8124',
    headers: {
      ['x-foo2']: 'costom'
    },
    body: {
      name:'gengming'
    }
  });
  let response = await request.send()
}()
