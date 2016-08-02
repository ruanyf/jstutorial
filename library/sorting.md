---
title: 排序算法
date: 2012-12-02
category: library
layout: page
modifiedOn: 2013-01-30
---

排序算法是将一系列的值按照顺序进行排列的方法。

## 冒泡排序

### 简介

冒泡排序（Bubble Sort）是最易懂的排序算法，但是效率较低，生产环境中很少使用。

它的基本思想是：

1. 依次比较相邻的两个数，如果不符合排序规则，则调换两个数的位置。这样一遍比较下来，能够保证最大（或最小）的数排在最后一位。

2. 再对最后一位以外的数组，重复前面的过程，直至全部排序完成。

由于每进行一次这个过程，在该次比较的最后一个位置上，正确的数会自己冒出来，就好像“冒泡”一样，这种算法因此得名。

以对数组`[3, 2, 4, 5, 1]`进行从小到大排序为例，步骤如下：

1. 第一位的“3”与第二位的“2”进行比较，3大于2，互换位置，数组变成`[2, 3, 4, 5, 1]`。

2. 第二位的“3”与第三位的“4”进行比较，3小于4，数组不变。

3. 第三位的“4”与第四位的“5”进行比较，4小于5，数组不变。

4. 第四位的“5”与第五位的“1”进行比较，5大于1，互换位置，数组变成`[2, 3, 4, 1, 5]`。

第一轮排序完成，可以看到最后一位的5，已经是正确的数了。然后，再对剩下的数`[2, 3, 4, 1]`重复这个过程，每一轮都会在本轮最后一位上出现正确的数。直至剩下最后一个位置，所有排序结束。

### 算法实现

先定义一个交换函数，作用是交换两个位置的值。

```javascript
function swap(myArray, p1, p2){
  var temp = myArray[p1];
  myArray[p1] = myArray[p2];
  myArray[p2] = temp;
}
```

然后定义主函数。

```javascript
function bubbleSort(myArray){
  var len = myArray.length;
  var i;
  var j;
  var stop;

  for (i = 0; i < len - 1; i++){
    for (j = 0, stop = len - 1 - i; j < stop; j++){
      if (myArray[j] > myArray[j + 1]){
        swap(myArray, j, j + 1);
      }
    }
  }

  return myArray;
}
```

## 选择排序

### 简介

选择排序（Selection Sort）与冒泡排序类似，也是依次对相邻的数进行两两比较。不同之处在于，它不是每比较一次就调换位置，而是一轮比较完毕，找到最大值（或最小值）之后，将其放在正确的位置，其他数的位置不变。

以对数组[3, 2, 4, 5, 1] 进行从小到大排序为例，步骤如下：

1. 假定第一位的“3”是最小值。

2. 最小值“3”与第二位的“2”进行比较，2小于3，所以新的最小值是第二位的“2”。

3. 最小值“2”与第三位的“4”进行比较，2小于4，最小值不变。

4. 最小值“2”与第四位的“5”进行比较，2小于5，最小值不变。

5. 最小值“2”与第五位的“1”进行比较，1小于2，所以新的最小值是第五位的“1”。

6. 第五位的“1”与第一位的“3”互换位置，数组变为[1, 2, 4, 5, 3]。

这一轮比较结束后，最小值“1”已经排到正确的位置了，然后对剩下的[2, 4, 5, 3]重复上面的过程。每一轮排序都会将该轮的最小值排到正确的位置，直至剩下最后一个位置，所有排序结束。

### 算法实现

先定义一个交换函数。

{% highlight javascript %}

function swap(myArray, p1, p2){
    var temp = myArray[p1];
    myArray[p1] = myArray[p2];
    myArray[p2] = temp;
}

{% endhighlight %}

然后定义主函数。

{% highlight javascript %}

function selectionSort(myArray){

    var len = myArray.length,
        min;

    for (i=0; i < len; i++){

        // 将当前位置设为最小值
        min = i;

        // 检查数组其余部分是否更小
        for (j=i+1; j < len; j++){
            if (myArray[j] < myArray[min]){
                min = j;
            }
        }

        // 如果当前位置不是最小值，将其换为最小值
        if (i != min){
            swap(myArray, i, min);
        }
    }

    return myArray;
}

{% endhighlight %}

## 插入排序

### 简介

插入排序（insertion sort）比前面两种排序方法都更有效率。它将数组分成“已排序”和“未排序”两部分，一开始的时候，“已排序”的部分只有一个元素，然后将它后面一个元素从“未排序”部分插入“已排序”部分，从而“已排序”部分增加一个元素，“未排序”部分减少一个元素。以此类推，完成全部排序。

以对数组[3, 2, 4, 5, 1] 进行从小到大排序为例，步骤如下：

1. 将数组分成[3]和[2, 4, 5, 1]两部分，前者是已排序的，后者是未排序的。

2. 取出未排序部分的第一个元素“2”，与已排序部分最后一个元素“3”比较，因为2小于3，所以2排在3前面，整个数组变成[2, 3]和[4, 5, 1]两部分。

3. 取出未排序部分的第一个元素“4”，与已排序部分最后一个元素“3”比较，因为4大于3，所以4排在3后面，整个数组变成[2, 3, 4]和[5, 1]两部分。

4. 取出未排序部分的第一个元素“5”，与已排序部分最后一个元素“4”比较，因为5大于4，所以5排在4后面，整个数组变成[2, 3, 4, 5]和[1]两部分。

5. 取出未排序部分的第一个元素“1”，与已排序部分最后一个元素“5”比较，因为1小于5，所以再与前一个元素“4”比较；因为1小于4，再与前一个元素“3”比较；因为1小于3，再与前一个元素“2”比较；因为小于1小于2，所以“1”排在2的前面，整个数组变成[1, 2, 3, 4, 5]。

### 算法实现

算法的实现如下：

{% highlight javascript %}

function insertionSort(myArray) {

    var len     = myArray.length,     // 数组的长度
        value,                      // 当前比较的值
        i,                          // 未排序部分的当前位置
        j;                          // 已排序部分的当前位置
    
    for (i=0; i < len; i++) {
    
        // 储存当前位置的值
        value = myArray[i];
        
        /*
         * 当已排序部分的当前元素大于value，
         * 就将当前元素向后移一位，再将前一位与value比较
         */
        for (j=i-1; j > -1 && myArray[j] > value; j--) {
            myArray[j+1] = myArray[j];
        }

        myArray[j+1] = value;
    }
    
    return myArray;
}

{% endhighlight %}
	
## 合并排序

### 简介

前面三种排序算法只有教学价值，因为效率低，很少实际使用。合并排序（Merge sort）则是一种被广泛使用的排序方法。

它的基本思想是，将两个已经排序的数组合并，要比从头开始排序所有元素来得快。因此，可以将数组拆开，分成n个只有一个元素的数组，然后不断地两两合并，直到全部排序完成。

以对数组[3, 2, 4, 5, 1] 进行从小到大排序为例，步骤如下：

1. 将数组分成[3, 2, 4]和[5, 1]两部分。

2. 将[3, 2, 4]分成[3, 2]和[4]两部分。

3. 将[3, 2]分成[3]和[2]两部分，然后合并成[2, 3]。

4. 将[2, 3]和[4]合并成[2, 3, 4]。

5. 将[5, 1]分成[5]和[1]两部分，然后合并成[1, 5]。

6. 将[2, 3, 4]和[1, 5]合并成[1, 2, 3, 4, 5]。

### 算法实现

这里的关键是如何合并两个已经排序的数组。具体实现请看下面的函数。

{% highlight javascript %}

function merge(left, right){
    var result  = [],
        il      = 0,
        ir      = 0;

    while (il < left.length && ir < right.length){
        if (left[il] < right[ir]){
            result.push(left[il++]);
        } else {
            result.push(right[ir++]);
        }
    }

    return result.concat(left.slice(il)).concat(right.slice(ir));
}

{% endhighlight %}

上面的merge函数，合并两个已经按升序排好序的数组。首先，比较两个数组的第一个元素，将其中较小的一个放入result数组；然后，将其中较大的一个与另一个数组的第二个元素进行比较，再将其中较小的一个放入result数组的第二个位置。以此类推，直到一个数组的所有元素都进入result数组为止，再将另一个数组剩下的元素接着result数组后面返回（使用concat方法）。

有了merge函数，就可以对任意数组排序了。基本方法是将数组不断地拆成两半，直到每一半只包含零个元素或一个元素为止，然后就用merge函数，将拆成两半的数组不断合并，直到合并成一整个排序完成的数组。

{% highlight javascript %}

function mergeSort(myArray){

    if (myArray.length < 2) {
        return myArray;
    }

    var middle = Math.floor(myArray.length / 2),
        left    = myArray.slice(0, middle),
        right   = myArray.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
}

{% endhighlight %}

上面的代码有一个问题，就是返回的是一个全新的数组，会多占用空间。因此，修改上面的函数，使之在原地排序，不多占用空间。

{% highlight javascript %}

function mergeSort(myArray){

    if (myArray.length < 2) {
        return myArray;
    }

    var middle = Math.floor(myArray.length / 2),
        left    = myArray.slice(0, middle),
        right   = myArray.slice(middle),
        params = merge(mergeSort(left), mergeSort(right));
    
    // 在返回的数组头部，添加两个元素，第一个是0，第二个是返回的数组长度
    params.unshift(0, myArray.length);

	// splice用来替换数组元素，它接受多个参数，
	// 第一个是开始替换的位置，第二个是需要替换的个数，后面就是所有新加入的元素。
	// 因为splice不接受数组作为参数，所以采用apply的写法。
	// 这一句的意思就是原来的myArray数组替换成排序后的myArray
    myArray.splice.apply(myArray, params);

	// 返回排序后的数组
    return myArray;
}

{% endhighlight %}

## 快速排序

### 简介

快速排序（quick sort）是公认最快的排序算法之一，有着广泛的应用。

它的基本思想很简单：先确定一个“支点”（pivot），将所有小于“支点”的值都放在该点的左侧，大于“支点”的值都放在该点的右侧，然后对左右两侧不断重复这个过程，直到所有排序完成。

具体做法是：

1. 确定“支点”（pivot）。虽然数组中任意一个值都能作为“支点”，但通常是取数组的中间值。

2. 建立两端的指针。左侧的指针指向数组的第一个元素，右侧的指针指向数组的最后一个元素。

3. 左侧指针的当前值与“支点”进行比较，如果小于“支点”则指针向后移动一位，否则指针停在原地。

4. 右侧指针的当前值与“支点”进行比较，如果大于“支点”则指针向前移动一位，否则指针停在原地。

5. 左侧指针的位置与右侧指针的位置进行比较，如果前者大于等于后者，则本次排序结束；否则，左侧指针的值与右侧指针的值相交换。

6. 对左右两侧重复第2至5步。

以对数组[3, 2, 4, 5, 1] 进行从小到大排序为例，步骤如下：

1. 选择中间值“4”作为“支点”。

2. 第一个元素3小于4，左侧指针向后移动一位；第二个元素2小于4，左侧指针向后移动一位；第三个元素4等于4，左侧指针停在这个位置（数组的第2位）。

3. 倒数第一个元素1小于4，右侧指针停在这个位置（数组的第4位）。

4. 左侧指针的位置（2）小于右侧指针的位置（4），两个位置的值互换，数组变成[3, 2, 1, 5, 4]。

5. 左侧指针向后移动一位，第四个元素5大于4，左侧指针停在这个位置（数组的第3位）。

6. 右侧指针向前移动一位，第四个元素5大于4，右侧指针移动向前移动一位，第三个元素1小于4，右侧指针停在这个位置（数组的第3位）。

7. 左侧指针的位置（3）大于右侧指针的位置（2），本次排序结束。

8. 对 [3, 2, 1]和[5, 4]两部分各自不断重复上述步骤，直到排序完成。

### 算法实现

首先部署一个swap函数，用于互换两个位置的值。

{% highlight javascript %}

function swap(myArray, firstIndex, secondIndex){
    var temp = myArray[firstIndex];
    myArray[firstIndex] = myArray[secondIndex];
    myArray[secondIndex] = temp;
}

{% endhighlight %}

然后，部署一个partition函数，用于完成一轮排序。

{% highlight javascript %}

function partition(myArray, left, right) {

    var pivot   = myArray[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;


    while (i <= j) {

        while (myArray[i] < pivot) {
            i++;
        }

        while (myArray[j] > pivot) {
            j--;
        }

        if (i <= j) {
            swap(myArray, i, j);
            i++;
            j--;
        }
    }

    return i;
}

{% endhighlight %}

接下来，就是递归上面的过程，完成整个排序。

{% highlight javascript %}

function quickSort(myArray, left, right) {

	if (myArray.length < 2) return myArray;

	left = (typeof left !== "number" ? 0 : left);

	right = (typeof right !== "number" ? myArray.length - 1 : right);

	var index  = partition(myArray, left, right);

	 if (left < index - 1) {
            quickSort(myArray, left, index - 1);
     }

	 if (index < right) {
            quickSort(myArray, index, right);
      }

	 return myArray;

}

{% endhighlight %}

## 参考链接

- Nicholas C. Zakas, [Computer science in JavaScript: Bubble sort](http://www.nczonline.net/blog/2009/05/26/computer-science-in-javascript-bubble-sort/) 
- Nicholas C. Zakas, [Computer science in JavaScript: Selection sort](http://www.nczonline.net/blog/2012/09/17/computer-science-in-javascript-insertion-sort/)
- Nicholas C. Zakas, [Computer science in JavaScript: Insertion sort](http://www.nczonline.net/blog/2012/09/17/computer-science-in-javascript-insertion-sort/)
- Nicholas C. Zakas, [Computer science in JavaScript: Merge sort](http://www.nczonline.net/blog/2012/10/02/computer-science-and-javascript-merge-sort/)
- Nicholas C. Zakas, [Computer science in JavaScript: Quicksort](http://www.nczonline.net/blog/2012/11/27/computer-science-in-javascript-quicksort/)
