---
title: 概述
category: htmlapi
layout: page
date: 2014-07-08
modifiedOn: 2014-07-08
---

## 元素与变量名

### id属性

由于历史原因，HTML元素的`id`属性的名字，会自动成为全局变量，指向该HTML元素。

```javascript
// HTML元素为
// <div id="example"></div>

example // [object HTMLDivElement]
```

上面代码中，有一个`id`属性等于`example`的`div`元素，结果就自动生成了全局变量`example`，指向这个`div`元素。

如果已有同名全局变量，则`id`元素不会自动生成全局变量。

```html
<script>
var example = 1;
</script>

<div id="example"></div>

<script>
console.log(example) // 1
</script>
```

上面代码中，已有全局变量`example`，这时`id`属性就不会自动变成全局变量。另一情况是，DOM生成以后，再对全局变量`example`赋值，这时也会覆盖`example`原来的值。

由于这种原因，默认的全局变量名（比如，`history`、`location`、`navigator`等），最好不要设为`id`属性的名字。

另外，由于原则上，网页之中不应该有同名`id`属性的HTML元素，所以，这种机制产生的全局变量不会重名。

### name属性

由于历史原因，以下HTML元素的`name`属性，也会成为全局变量。

- `<applet>`
- `<area>`
- `<embed>`
- `<form>`
- `<frame>`
- `<frameset>`
- `<iframe>`
- `<img>`
- `<object>`

```javascript
// HTML代码为
// <form name="myForm" />

myForm // [object HTMLFormElement]
```

上面代码中，`form`元素的`name`属性名`myForm`，自动成为全局变量`myForm`。

如果`name`属性同名的HTML元素不止一个，或者某个元素的`id`属性与另一个元素的`name`属性同名，这时全局变量会指向一个类似数组的对象。

```javascript
// HTML代码为
// <div id="myForm" />
// <form name="myForm" />

myForm[0] // [object HTMLDivElement]
myForm[1] // [object HTMLFormElement]
```

上面代码中，全局变量`myForm`的第一个成员指向`div`元素，第二个成员指向`form`元素。

这些元素的`name`属性名，也会成为`document`对象的属性。

```javascript
// HTML代码为<img name="xx" />
document.xx === xx // true
```

上面代码中，`name`属性为`xx`的`img`元素，自动生成了全局变量`xx`和`document`对象的属性`xx`。

如果有多个`name`属性相同的元素，那么`document`对象的该属性指向一个类似数组的对象（NodeList对象的实例）。

这样设计的原意是，通过引用`document.elementName`就可以获得该元素。但是，由于这些属性是自动生成的，既不规范，也不利于除错，所以建议不要使用它们。

另外，如果`iframe`元素有`name`属性或`id`属性，那么生成的全局变量，不是指向`iframe`元素节点，而是指向这个`iframe`代表的子页面`window`对象。

除了自动成为`window`和`document`的属性，带有`id`或`name`属性的HTML元素，还会自动成为集合对象的属性。举例来说，如果有一个表单元素`<form>`。

```html
<form name="myform">
```

它会自动成为集合对象`document.forms`的属性。

```javascript
document.forms.myforms;
```

## Form 元素（表单）

表单主要用于收集用户的输入，送到服务器或者在前端处理。

### 选中表单元素

如果`<form>`元素带有`name`或者`id`属性，这个元素节点会自动成为`window`和`document`的属性，并且可以从`document.forms`上取到。`<form name="myForm">`节点用下面几种方法可以拿到。

```javascript
window.myForm
document.myForm
document.forms.myForm
document.forms[n]
```

`document.forms`返回一个类似数组的对象（`HTMLCollection`的实例），包含了当前页面中所有表单（`<form>`元素）。`HTMLCollection`的实例都可以使用某个节点的`id`和`name`属性，取到该节点。

表单对象本身也是一个`HTMLCollection`对象的实例，它里面的各个子节点也可以用`id`属性、`name`属性或者索引值取到。举例来说，`myForm`表单的第一个子节点是`<input type="text" name="address">`，它可以用下面的方法取到。

```javascript
document.forms.myForm[0]
document.forms.myForm.address
document.myForm.address
```

表单节点都有一个`elements`属性，包含了当前表单的所有子元素，所以也可以用下面的方法取到`address`子节点。

```javascript
document.forms.myForm.elements[0]
document.forms.myForm.elements.address
```

表单之中，会有多个元素共用同一个`name`属性的情况。

```html
<form name="myForm">
  <label><input type="radio" name="method" value="1">1</label>
  <label><input type="radio" name="method" value="2">2</label>
  <label><input type="radio" name="method" value="3">3</label>
</form>
```

上面代码中，三个单选框元素共用同一个`name`属性，这时如果使用这个`name`属性去引用子节点，返回的将是一个类似数组的对象。

```javascript
document.forms.myForm.elements.method.length // 3
```

如果想知道，用户到底选中了哪一个子节点，就必须遍历所有的同名节点。

```javascript
var methods = document.forms.myForm.elements.method;
var result;

for (var i = 0; i < methods.length; i++) {
  if (methods[i].checked) value = methods[i].value;
}
```

### Form 对象

`<form>`元素对应的DOM节点是一个Form对象。这个对象除了上一小节提到的`elements`属性，还有以下属性，分别对应元素标签中的同名属性。

- `action`
- `encoding`
- `method`
- `target`

Form对象还有两个属性，可以指定事件的回调函数。

- `onsubmit`：提交表单前调用，只要返回`false`，就会取消提交。可以在这个函数里面，校验用户的输入。该函数只会在用户提交表单时调用，脚本调用`submit()`方法是不会触发这个函数的。
- `onreset`：重置表单前调用，只要返回`false`，就会取消表单重置。该函数只能由真实的reset按钮触发，脚本调用`reset()`方法并不会触发这个函数。

```javascript
<form onreset="return confirm('你要重置表单吗？')">
  <!-- ... -->
  <button type="reset">重置</button>
</form>
```

Form对象的方法主要是下面两个。

- `submit()`：将表单数据提交到服务器
- `reset()`：重置表单数据

### 表单控件对象

表单包含了各种控件，每个控件都是一个对象。它们都包含了以下四个属性。

- `type`：表示控件的类型，对于`<input>`元素、`<button>`元素等于这些标签的`type`属性，对于其他控件，`<select>`为`select-one`，`<select multiple>`为`select-multiple`，`<textarea>`为`textarea`。该属性只读。
- `form`：指向包含该控件的表单对象，如果该控件不包含在表单之中，则返回`null`。该属性只读。
- `name`：返回控件标签的`name`属性。该属性只读。
- `value`：返回或设置该控件的值，这个值会被表单提交到服务器。该属性可读写。
才会
`form`属性有一个特别的应用，就是在控件的事件回调函数里面，`this`指向事件所在的控件对象，所以`this.form`就指向控件所在的表单，`this.form.x`就指向其他控件元素，里面的`x`就是该控件的`name`属性或`id`属性的值。

表单控件之中，只要是按钮，都有`onclick`属性，用来指定用户点击按钮时的回调函数；其他的控件一般都有`onchange`属性，控件值发生变化，并且该控件失去焦点时调用。单选框（Radio控件）和多选框（Checkbox控件）可以同时设置`onchange`和`onclick`属性。

表单控件还有以下两个事件。

- `focus`：得到焦点时触发
- `blur`：失去焦点时触发

### Select元素

`<select>`元素用来生成下拉列表。默认情况下，浏览器只显示一条选项，其他选项需要点击下拉按钮才会显示。`size`选项如果大于1，那么浏览器就会默认显示多个选项。

```html
<select size="3">
```

上面代码指定默认显示三个选项，更多的选项需要点击下拉按钮才会显示。

`<select>`元素默认只能选中一个选项，如果想选中多个选项，必须指定`multiple`属性。

```html
<select multiple>
```

用户选中或者取消一个下拉选项时，会触发`Select`对象的`change`事件，从而自动执行`onchange`监听函数。

`<select>`元素有一个`options`属性，返回一个类似数组的对象，包含了所有的`<option>`元素。

```html
// HTML 代码为
// <select id="example">
//   <option>1</option>
//   <option>2</option>
//   <option>3</option>
// </select>

var element = document.querySelector('#example');
element.options.length
// 3
```

上面代码中，`<select>`元素的`options`属性包含了三个`<option>`元素。

`options`属性可读写，可以通过设置`options.length`，控制向用户显示的下拉选项的值。将`options.length`设为0，可以不再显示任何下拉属性。将`options`里面某个位置的`Option`对象设为`null`，将等于移除这个选项，后面的`Option`对象会自动递补这个位置。

`Select`对象的`selectedIndex`属性，返回用户选中的第一个下拉选项的位置（从0开始）。如果返回`-1`，则表示用户没有选中任何选项。该属性可读写。对于单选的下拉列表，这个属性就可以得知用户的选择；对于多选的下拉列表，这个属性还不够，必须逐个轮询`options`属性，判断每个`Option`对象的`selected`属性是否为`true`。

### Option元素

`<option>`元素用于在下拉列表（`<select>`）中生成下拉选项。每个下拉选项就是一个`Option`对象，它有以下属性。

- `selected`：返回一个布尔值，表示用户是否选中该选项。
- `text`：返回该下拉选项的显示的文本。该属性可读写，可用来显示向用户显示的文本。
- `value`：返回该下拉选项的值，即向服务器发送的那个值。该属性可读写。
- `defaultSelected`：返回一个布尔值，表示这个下拉选项是否默认选中。

浏览器提供`Option`构造函数，用来生成下拉列表的选项对象。利用这个函数，可以用脚本生成下拉选项，然后放入`Select.options`对象里面，从而自动生成下拉列表。

```javascript
var item = new Option(
  'Hello World',  // 显示的文本，即 text 属性
  'myValue',  // 向服务器发送的值，即 value 属性
  false,    // 是否为默认选项，即 defaultSelected 属性
  false   // 是否已经选中，即 selected 属性
);

// 获取 Selector 对象
var mySelector = document.forms.myForm.mySelector;
mySelector.options[mySelector.options.length] = item;
```

上面代码在下拉列表的末尾添加了一个选项。从中可以看到，`Option`构造函数可以接受四个选项，对应`<Option>`对象的四个属性。

注意，用脚本插入下拉选项完全可以用标准的DOM操作方法实现，比如`Document.create Element()`、`Node.insertBefore()`和`Node.removeChild()`等等。

## image元素

### alt属性，src属性

`alt`属性返回`image`元素的HTML标签的`alt`属性值，`src`属性返回`image`元素的HTML标签的`src`属性值。

```javascript
// 方法一：HTML5构造函数Image
var img1 = new Image();
img1.src = 'image1.png';
img1.alt = 'alt';
document.body.appendChild(img1);

// 方法二：DOM HTMLImageElement
var img2 = document.createElement('img');
img2.src = 'image2.jpg';
img2.alt = 'alt text';
document.body.appendChild(img2);

document.images[0].src
// image1.png
```

### complete属性

complete属性返回一个布尔值，true表示当前图像属于浏览器支持的图形类型，并且加载完成，解码过程没有出错，否则就返回false。

### height属性，width属性

这两个属性返回image元素被浏览器渲染后的高度和宽度。

### naturalWidth属性，naturalHeight属性

这两个属性只读，表示image对象真实的宽度和高度。

```javascript

myImage.addEventListener('onload', function() {
	console.log('My width is: ', this.naturalWidth);
	console.log('My height is: ', this.naturalHeight);
});

```

## table元素

表格有一些特殊的DOM操作方法。

- **insertRow()**：在指定位置插入一个新行（tr）。
- **deleteRow()**：在指定位置删除一行（tr）。
- **insertCell()**：在指定位置插入一个单元格（td）。
- **deleteCell()**：在指定位置删除一个单元格（td）。
- **createCaption()**：插入标题。
- **deleteCaption()**：删除标题。
- **createTHead()**：插入表头。
- **deleteTHead()**：删除表头。

下面是使用JavaScript生成表格的一个例子。

```javascript
var table = document.createElement('table');
var tbody = document.createElement('tbody');
table.appendChild(tbody);

for (var i = 0; i <= 9; i++) {
  var rowcount = i + 1;
  tbody.insertRow(i);
  tbody.rows[i].insertCell(0);
  tbody.rows[i].insertCell(1);
  tbody.rows[i].insertCell(2);
  tbody.rows[i].cells[0].appendChild(document.createTextNode('Row ' + rowcount + ', Cell 1'));
  tbody.rows[i].cells[1].appendChild(document.createTextNode('Row ' + rowcount + ', Cell 2'));
  tbody.rows[i].cells[2].appendChild(document.createTextNode('Row ' + rowcount + ', Cell 3'));
}

table.createCaption();
table.caption.appendChild(document.createTextNode('A DOM-Generated Table'));

document.body.appendChild(table);
```

这些代码相当易读，其中需要注意的就是`insertRow`和`insertCell`方法，接受一个表示位置的参数（从0开始的整数）。

`table`元素有以下属性：

- **caption**：标题。
- **tHead**：表头。
- **tFoot**：表尾。
- **rows**：行元素对象，该属性只读。
- **rows.cells**：每一行的单元格对象，该属性只读。
- **tBodies**：表体，该属性只读。

## audio元素，video元素

audio元素和video元素加载音频和视频时，以下事件按次序发生。

- loadstart：开始加载音频和视频。
- durationchange：音频和视频的duration属性（时长）发生变化时触发，即已经知道媒体文件的长度。如果没有指定音频和视频文件，duration属性等于NaN。如果播放流媒体文件，没有明确的结束时间，duration属性等于Inf（Infinity）。
- loadedmetadata：媒体文件的元数据加载完毕时触发，元数据包括duration（时长）、dimensions（大小，视频独有）和文字轨。
- loadeddata：媒体文件的第一帧加载完毕时触发，此时整个文件还没有加载完。
- progress：浏览器正在下载媒体文件，周期性触发。下载信息保存在元素的buffered属性中。
- canplay：浏览器准备好播放，即使只有几帧，readyState属性变为CAN_PLAY。
- canplaythrough：浏览器认为可以不缓冲（buffering）播放时触发，即当前下载速度保持不低于播放速度，readyState属性变为CAN_PLAY_THROUGH。

除了上面这些事件，audio元素和video元素还支持以下事件。

事件|触发条件
----|--------
abort|播放中断
emptied|媒体文件加载后又被清空，比如加载后又调用load方法重新加载。
ended|播放结束
error|发生错误。该元素的error属性包含更多信息。
pause|播放暂停
play|暂停后重新开始播放
playing|开始播放，包括第一次播放、暂停后播放、结束后重新播放。
ratechange|播放速率改变
seeked|搜索操作结束
seeking|搜索操作开始
stalled|浏览器开始尝试读取媒体文件，但是没有如预期那样获取数据
suspend|加载文件停止，有可能是播放结束，也有可能是其他原因的暂停
timeupdate|网页元素的currentTime属性改变时触发。
volumechange|音量改变时触发（包括静音）。
waiting|由于另一个操作（比如搜索）还没有结束，导致当前操作（比如播放）不得不等待。

## tabindex属性

`tabindex`属性用来指定，当前HTML元素节点是否被tab键遍历，以及遍历的优先级。

```javascript
var b1 = document.getElementById("button1");

b1.tabIndex = 1;
```

如果`tabindex = -1`，tab键跳过当前元素。

如果`tabindex = 0`，表示tab键将遍历当前元素。如果一个元素没有设置tabindex，默认值就是0。

如果`tabindex > 0`，表示tab键优先遍历。值越大，就表示优先级越大。
