# 定时器

## setImmediate()

`setImmediate`方法用于在下一轮Event Loop立即执行指定的回调函数。

```javascript
setImmediate(callback[, arg][, ...])
```

它的第一个参数就是指定的回调函数，其他参数则会被传入回调函数。

`setImmediate`指定的回调函数，执行顺序是在I/O事件的回调函数之后，`setTimeout`和`setInterval`方法指定的回调函数之前。

它返回一个对象，供`clearImmediate()`使用。

如果多次执行`setImmediate`方法，则它指定的回调函数将按顺序在下一论Event Loop一次性执行。如果在回调函数之中执行`setImmediate`，它指定的回调函数将在外层回调函数执行完毕以后的下一轮Event Loop执行。

## clearImmediate()

`clearImmediate`方法用于清除`setImmediate`设置的定时器。它的参数是`setImmediate`方法返回的定时器对象。

