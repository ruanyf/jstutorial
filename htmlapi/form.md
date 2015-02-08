---
title: 表单
category: htmlapi
layout: page
date: 2014-05-29
modifiedOn: 2014-05-29
---

## 表单的验证

### HTML 5表单验证

所谓“表单验证”，指的是检查用户提供的数据是否符合要求，比如Email地址的格式。HTML 5原生支持表单验证，不需要JavaScript。

```html

<input type="date" >

```

上面代码指定该input输入框只能填入日期，否则浏览器会报错。

但有时，原生的表单验证不完全符合需要，而且出错信息无法指定样式。这时，可能需要使用表单对象的noValidate属性，将原生的表单验证关闭。

```javascript

var form = document.getElementById("myform");
form.noValidate = true;
 
form.onsubmit = validateForm;

```

上面代码先关闭原生的表单验证，然后指定submit事件时，让JavaScript接管表单验证。

此外，还可以只针对单个的input输入框，关闭表单验证。

```javascript

form.field.willValidate = false;

```

每个input输入框都有willValidate属性，表示是否开启表单验证。对于那些不支持的浏览器（比如IE8），该属性等于undefined。

麻烦的地方在于，即使willValidate属性为true，也不足以表示浏览器支持所有种类的表单验证。比如，Firefox 29不支持date类型的输入框，会自动将其改为text类型，而此时它的willValidate属性为true。为了解决这个问题，必须确认input输入框的类型（type）未被浏览器改变。

```javascript

if (field.nodeName === "INPUT" && field.type !== field.getAttribute("type")) {
    // 浏览器不支持该种表单验证，需自行部署JavaScript验证
}

```

### checkValidity方法，setCustomValidity方法，validity对象

checkValidity方法表示执行原生的表单验证，如果验证通过返回true。如果验证失败，则会触发一个invalid事件。使用该方法以后，会设置validity对象的值。

每一个表单元素都有一个validity对象，它有以下属性。

- valid：如果该元素通过验证，则返回true。
- valueMissing：如果用户没填必填项，则返回true。
- typeMismatch：如果填入的格式不正确（比如Email地址），则返回true。
- patternMismatch：如果不匹配指定的正则表达式，则返回true。
- tooLong：如果超过最大长度，则返回true。
- tooShort：如果小于最短长度，则返回true。
- rangeUnderFlow：如果小于最小值，则返回true。
- rangeOverflow：如果大于最大值，则返回true。
- stepMismatch：如果不匹配步长（step），则返回true。
- badInput：如果不能转为值，则返回true。
- customError：如果该栏有自定义错误，则返回true。

setCustomValidity方法用于自定义错误信息，该提示信息也反映在该输入框的validationMessage属性中。如果将setCustomValidity设为空字符串，则意味该项目验证通过。

## 参考链接

- Craig Buckler, [HTML5 Forms: JavaScript and the Constraint Validation API](http://www.sitepoint.com/html5-forms-javascript-constraint-validation-api/)









