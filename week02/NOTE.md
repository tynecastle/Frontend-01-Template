# 第2周学习总结

## 4月16日

### 1. 语言按语法分类
非形式语言：中文，英文
形式语言（乔姆斯基谱系）
乔姆斯基谱系：是计算机科学中刻画形式文法表达能力的一个分类谱系，是由诺姆·乔姆斯基于1956年提出的。它包括四个层次：
- 0型文法（无限制文法或短语结构文法）包括所有的文法。
- 1型文法（上下文相关文法）生成上下文相关语言。
- 2型文法（上下文无关文法）生成上下文无关语言。
- 3型文法（正则文法）生成正则语言。

### 2. 产生式（BNF）
巴科斯诺尔范式：即巴科斯范式（Backus Normal Form，缩写为BNF）是一种用于表示上下文无关文法的语言。上下文无关文法描述了一类形式语言，它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集。  
在计算机中指Tiger编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（BNF）的语句。
- 用尖括号括起来的名称来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合结构
  - 基础结构称终结符
  - 复合结构称非终结符
- 引号和中间的字符表示终结符
  -  number
  -  \+ - * /
- 非终结符
  - MultiplicativeExpression
  - AdditiveExpression
- 可以有括号
- *表示重复多次
- |表示或
- +表示至少一次
应用举例：用BNF描述十进制数&四则运算&逻辑运算  
\<Number> = "0" | "1" | "2" | ...... | "9"  
\<DecimalNumber> = "0" | (("1" | "2" | ...... | "9") \<Number>* )  
\<AdditiveExpression> = \<DecimalNumer> | \<AdditiveExpression> "+" \<DecimalNumber>  
\<PrimaryExpression> = \<DecimalNumer> |  
	"(" \<LogicalExpression> ")"  
\<MultiplicativeExpression> = \<PrimaryExpression> |  
	\<MultiplicativeExpression> "*" \<PrimaryExpression> |  
	\<MultiplicativeExpression> "/" \<PrimaryExpression>  
\<AdditiveExpression> = \<MultiplicativeExpression> |  
	\<AdditiveExpression> "+" \<MultiplicativeExpression> |  
	\<AdditiveExpression> "-" \<MultiplicativeExpression>  
\<LogicalExpression> = \<AdditiveExpression> |  
	\<LogicalExpression> "||" \<AdditiveExpression> |  
	\<LogicalExpression> "&&" \<AdditiveExpression>  

### 3. 通过产生式理解乔姆斯基谱系
- 0型无限制文法：等号两边可以有多个非终结符  
  \<a> \<b> ::= "c" \<d>  
- 1型上下文相关文法  
  ? \<A> ? ::= ? \<B> ?  
  "a" \<b> "c" ::= "a" "x" "c"
- 2型上下文无关文法  
  \<A> ::= ?
- 3型正则文法（只允许左递归）  
  \<A> ::= \<A> ?  
  \<DecimalNumber> = /0|[1-9][0-9]*/

### 4. 现代语言的特例
- C++中，*可能表示乘号或者指针，具体是哪个取决于星号前面的标识符是否被声明为类型。也就是说，语法依赖于语义，所以从严格意义上讲，C++应该属于非形式化语言。
- VB中，<可能是小于号，也可能是XML直接量的开始，取决于当前位置是否可以接受XML直接量。这属于2型文法。
- Python中，行首的tab符合和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符indent或者dedent。
- JavaScript中，/可能是除号，也可能是正则表达式开头，处理方式类似于VB，字符串模板中也需要特殊处理}，还有自动插入分号规则。

### 5. 图灵完备性
图灵机：凡是可计算的东西都能计算出来。图灵本人还从数学角度证明了并不是世界上所有的问题都能用计算机解决。  
在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。这个词源于引入图灵机概念的数学家艾伦·图灵。虽然图灵机会受到储存能力的物理限制，图灵完全性通常指“具有无限存储能力的通用物理机器或编程语言”。
- 命令式————图灵机
  - goto
  - if和while
- 声明式————lambda
  - 递归

### 6. 动态与静态
- 动态：
  - 在用户的设备/在线服务器上
  - 产品实际运行时
  - Runtime
- 静态：
  - 在程序员的设备上
  - 产品开发时
  - Compiletime

### 7. 类型系统
- 动态类型系统与静态类型系统
- 强类型与弱类型
  - 强类型：无隐式类型转换
  - 弱类型：有隐式类型转换
- 复合类型
  - 结构体：对象都是结构体
  - 函数签名：由参数类型列表和返回值类型组成
- 子类型
  - 协变：凡是能用Array<Parent>的地方，都能用Array<Child>
  - 逆变：凡是能用Funtion<Child>的地方，都能用Function<Parent>


## 4月18日笔记

### InputElement
- WhiteSpace
  - \<TAB>
  - \<VT>
  - \<FF>
  - \<SP>
  - \<NBSP>
  - \<ZWNBSP>
  - \<USP>
- LineTerminator
  - \<LF> LINE FEED
  - \<CR> CARRIAGE RETURN
- Comment
  - 单行注释：//
  - 多行注释：/* ... */ （不支持嵌套）
- Token
  - IdentifierName
    - 变量名：不能使用keywords
    - 属性名：可以使用keywords
    - 保留关键字
    - 起始字符：UnicodeIDStart，$，_，\
  - Literal
    - Number: IEEE 754
      - DecimalLiteral
      - BinaryIntegerLiteral: 0b111
      - OctalIntegerLiteral: 0o10
      - HexIntegerLiteral: 0xFF
    - String
      - Character
      - Code Point
      - Encoding：JavaScript只使用Unicode标准，以utf16在内存中存储
    - Boolean
    - Undefined：全局变量名
  - Punctuator
  - Keywords
