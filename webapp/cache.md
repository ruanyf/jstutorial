# Cache API

Cache API 用来控制浏览器缓存。

下面的代码用来检查浏览器是否支持这个API。

```javascript
if('caches' in window) {
  // Has support!
}
```

下面代码打开一个指定名称的 Cache。

```javascript
caches.open('test-cache').then(function(cache) {
  // Cache is created and accessible
});
```

`caches.open`方法返回一个Promise对象。当这个Promise对象`resolve`的时候，会返回新生成或已存在的Cache对象。

Cache 对象可以看作是`Request`对象的数组，代表向浏览器发出的请求。`add`和`addAll`方法用于向缓存对象添加文件，它们的参数是一个URL。

```javascript
caches.open('test-cache').then(function(cache) {
  cache.addAll(['/', '/images/logo.png'])
    .then(function() {
      // Cached!
    });
});
```

`cache.addAll`方法接受一个代表URL的数组作为参数，`cache.add`方法则是接受单个URL作为参数。

```javascript
caches.open('test-cache').then(function(cache) {
  cache.add('/page/1');  // "/page/1" URL will be fetched and cached!
});
```

这两个方法也可以接受`Request`对象作为参数。

```javascript
caches.open('test-cache').then(function(cache) {
  cache.add(new Request('/page/1', { /* request options */ }));
});
```

`cache.put`方法用于将URL和对应的`Response`对象放入Cache对象。

```javascript
fetch('/page/1').then(function(response) {
  return caches.open('test-cache').then(function(cache) {
    return cache.put('/page/1', response);
  });
});
```

`cache.keys`方法可以遍历Cache对象里面的request请求。

```javascript
caches.open('test-cache').then(function(cache) { 
  cache.keys().then(function(cachedRequests) { 
    console.log(cachedRequests); // [Request, Request]
  });
});

/*
Request {
  bodyUsed: false
  credentials: "omit"
  headers: Headers
  integrity: ""
  method: "GET"
  mode: "no-cors"
  redirect: "follow"
  referrer: ""
  url: "https://fullhost.tld/images/logo.png"
}
*/
```

`cache.match`和`cache.matchAll`方法用于查看Cache对象里面某一个`Request`对象对应的`Response`。

```javascript
caches.open('test-cache').then(function(cache) {
  cache.match('/page/1').then(function(matchedResponse) {
    console.log(matchedResponse);
  });
});

/*
Response {
  body: (...),
  bodyUsed: false,
  headers: Headers,
  ok: true,
  status: 200,
  statusText: "OK",
  type: "basic",
  url: "https://davidwalsh.name/page/1"
}
*/
```

`caches.delete`方法用于从Cache对象中移除一个`Request`对象。

```javascript
caches.open('test-cache').then(function(cache) {
  cache.delete('/page/1');
});
```


