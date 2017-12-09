---
title: 表单
category: htmlapi
layout: page
date: 2014-05-29
modifiedOn: 2014-05-29
---

## 表单元素

`input`、`textarea`、`password`、`select`等元素都可以通过`value`属性取到它们的值。

### select

`select`是下拉列表元素。

```html
<div>
<label for="os">Operating System</label>
<select name="os" id="os">
    <option>Choose</option>
    <optgroup label="Windows">
        <option value="7 Home Basic">7 Home Basic</option>
        <option value="7 Home Premium">7 Home Premium</option>
        <option value="7 Professional">7 Professional</option>
        <option value="7 Ultimate">7 Ultimate</option>
        <option value="Vista">Vista</option>
        <option value="XP">XP</option>
    </optgroup>
<select>
</div>
```

可以通过`value`属性取到用户选择的值。

```javascript
var data = document.getElementById('selectMenu').value;
```

`selectedIndex`可以设置选中的项目（从0开始）。如果用户没有选中任何一项，`selectedIndex`等于`-1`。

```javascript
document.getElementById('selectMenu').selectedIndex = 1;
```

`select`元素也可以设置为多选。

```html
<select name="categories" id="categories" multiple>
```

设为多选时，`value`只返回选中的第一个选项。要取出所有选中的值，就必须遍历`select`的所有选项，检查每一项的`selected`属性。

```javascript
var selected = [];
for (var i = 0, count = elem.options.length; i < count; i++) {
  if (elem.options[i].selected) {
    selected.push(elem.options[i].value);
  }
}
```

### checkbox

`checkbox`是多选框控件，每个选择框只有选中和不选中两种状态。

```html
<input type="checkbox" name="toggle" id="toggle" value="toggle">
```

`checked`属性返回一个布尔值，表示用户是否选中。

```javascript
var which = document.getElementById('someCheckbox').checked;
```

`checked`属性是可写的。

```javascript
which.checked = true;
```

`value`属性可以获取单选框的值。

```javascript
if (which.checked) {
  var value = document.getElementById('someCheckbox').value;
}
```

### radio

radio是单选框控件，同一组选择框同时只能选中一个，选中元素的`checked`属性为`true`。由于同一组选择框的`name`属性都相同，所以只有通过遍历，才能获得用户选中的那个选择框的`value`。

```html
<input type="radio" name="gender" value="Male"> Male </input>
<input type="radio" name="gender" value="Female"> Female </input>
<script>
var radios = document.getElementsByName('gender');
var selected;
for (var i = 0; i < radios.length; i++) {
  if (radios[i].checked) {
    selected = radios[i].value;
    break;
  }
}
if (selected) {
  // 用户选中了某个选项
}
</script>
```

上面代码中，要求用户选择“性别”。通过遍历所有选项，获取用户选中的项。如果用户未做任何选择，则`selected`就为`undefined`。

## 表单的验证

### HTML 5表单验证

所谓“表单验证”，指的是检查用户提供的数据是否符合要求，比如Email地址的格式。

检查用户是否在`input`输入框之中填入值。

```javascript
if (inputElem.value === inputElem.defaultValue) {
  // 用户没有填入内容
}
```

HTML 5原生支持表单验证，不需要JavaScript。

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

### checkValidity()，setCustomValidity方法，validity对象

提交表单之前（即`submit`事件发生之前），浏览器会执行`form.checkValidity()`，检查是否所有输入项都能通过验证。那些不能通过验证的输入项，会触发该输入项元素的`invalid`事件。因此，可以定义`invalid`事件的监听函数，一旦通不过验证，就显示报错提示。

```javascript
// CSS 样式如下：
// input.error {
//   border-color: red;
// }
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
  input.addEventListener('invalid', event => {
    input.classList.add('error');
  }, false);
});
```

注意，一旦发生`invalid`事件，表单的`submit`事件就不会触发，即被取消了。

单个输入项也有`checkValidity`方法，可以手动触发。

```javascript
input.addEventListener('blur', function () {
  input.checkValidity();
});
```

`checkValidity`方法表示执行原生的表单验证，即 HTML5 代码中为输入项指定的验证条件。如果验证通过返回`true`。如果验证失败，除了触发`invalid`事件，还会设置`validity`对象的值。

每一个表单元素都有一个`validity`对象，具有以下属性。

- `valid`：如果该元素通过验证，则为`true`。
- `valueMissing`：如果用户没填必填项，则为`true`。
- `typeMismatch`：如果填入的格式不正确（比如 Email 地址），则为`true`。
- `patternMismatch`：如果不匹配指定的正则表达式，则为`true`。
- `tooLong`：如果超过最大长度，则为`true`。
- `tooShort`：如果小于最短长度，则为`true`。
- `rangeUnderFlow`：如果小于最小值，则为`true`。
- `rangeOverflow`：如果大于最大值，则为`true`。
- `stepMismatch`：如果不匹配步长（step），则返回`true`。
- `badInput`：如果不能转为值，则为`true`。
- `customError`：如果该栏有自定义错误，则为`true`。

`setCustomValidity`方法用于自定义错误信息，该提示信息也反映在输入框的`validationMessage`属性中。如果将`setCustomValidity`设为空字符串，则意味该项目验证通过。

```javascript
var passcode_input = document.querySelector('#passcode');
if (passcode_input.value !== '123') {
  passcode_input.setCustomValidity('Wrong. It should be 123.');
} else {
  passcode_input.setCustomValidity('');
}
```

## 参考链接

- Dave Rupert, [Happier HTML5 Form Validation](https://daverupert.com/2017/11/happier-html5-forms/)
- Craig Buckler, [HTML5 Forms: JavaScript and the Constraint Validation API](http://www.sitepoint.com/html5-forms-javascript-constraint-validation-api/)









