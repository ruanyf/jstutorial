---
title: url 模块
layout: page
category: nodejs
data: 2015-12-17
modifiedOn: 2015-12-17
---

`url`模块用于生成和解析URL。该模块使用前，必须加载。

```javascript
var url = require('url');
```

## url.resolve(from, to)

`url.resolve`方法用于生成URL。它的第一个参数是基准URL，其余参数依次根据基准URL，生成对应的位置。

```javascript
url.resolve('/one/two/three', 'four')
// '/one/two/four'

url.resolve('http://example.com/', '/one')
// 'http://example.com/one'

url.resolve('http://example.com/one/', 'two')
// 'http://example.com/one/two'

url.resolve('http://example.com/one', '/two')
// 'http://example.com/two'
```
