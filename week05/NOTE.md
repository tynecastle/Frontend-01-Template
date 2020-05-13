## Http请求组成
```
POST / HTTP/1.1
Connection: keep-alive
Content-Length: 55
Content-Type: application/json

abc=123&bcd=%3A%3B
```
### ReuqestLine
```
POST    /       HTTP/1.1
method  path   httpVersion
```
### Request Headers[POST method]
- Content-Length
- Content-Type
  - application/json
  - application/x-www-form-urlencoded
  - text/xml
  - multipart/formdata
### Body
```
application/x-www-form-urlencoded
abc=123&bcd=%3A%3B
```
```
application/json
JSON.stringify(json)
```

## HTTP 响应组成
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 798

{"code":0,"data":{"list":[...]}}
```
### StatusLine
```
HTTP/1.1        200       OK
httpVersion statusCode statusText
```
### Response Headers
```
Content-Type: application/json; charset=utf-8
Content-Length: 798
```
- Content-Type
- Content-Length
- Transfer-Encoding
### Response Body
```
Content-Type为application/json：
{"code":0,"data":{"list":[...]}}

Transfer-Encoding为chunked时：
10 // chunk长度
1234567890 //chunk内容
0 // 内容结束
```

## 处理过程
### 请求处理过程
1. 创建TCP客户端
2. 向服务端发送RequestLine、RequestHeaders、RequestBody
3. 监听服务端返回数据并处理
### 响应处理过程
1. 客户端接收到服务端返回数据
2. 利用状态机解析ResponseStatusLine、ResponseHeaders
3. 根据ResponseHeaders中Transfer-Encoding决定采用哪种方式解析ResponseBody
4. 利用状态机解析ResponseBody
