---
title: dns 模块
layout: page
category: nodejs
date: 2013-01-14
modifiedOn: 2013-12-04
---

```javascript
dns.lookup(`www.myApi.com`, 4, (err, address) => {
  cacheThisForLater(address);
});
```
