---
title: Service Worker
layout: page
category: webapp
date: 2016-08-14
modifiedOn: 2016-08-14
---

## register

```javascript
window.addEventListener('load', function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(initialiseState);
  } else {
    console.warn('Service workers aren\'t supported in this browser.');
  }
}
```
