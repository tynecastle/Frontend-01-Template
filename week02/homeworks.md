### 1. 写一个正则表达式 匹配所有 Number 直接量

`/^[-\+]?(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/`

### 2. 写一个 UTF-8 Encoding 的函数
```js
function encodingUtf8(string) {
    let code = encodeURIComponent(s);
      let bytes = [];
      for (let i = 0; i < code.length; i++) {
          let c = code.charAt(i);
          if (c === '%') {
              bytes.push(parseInt(code.charAt(i + 1) + code.charAt(i + 2), 16) );
              i += 2;
          } 
          else {
              bytes.push(c.charCodeAt(0));
          }
      }
      return bytes;
  }
```
### 3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

`/^['"\\bfnrtv/dxu]$|^u[0-9a-fA-F]{4}$|^u(10|0?[0-9a-fA-F])[0-9a-fA-F]{0,4}$/`
