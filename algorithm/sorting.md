---
title: 排序算法（Sorting）
date: 2012-12-02
category: algorithm
layout: page
---

## 冒泡算法（Bubble Sort）

冒泡算法是最易懂的排序算法，一直排在教科书的最前面。但是因为它的效率低，所以在生产环境中很少使用。

它的基本思想是，依次比较相邻的两个数，如果不符合排序规则，则调换两个数的位置。这样一遍比较下来，能够保证最大（或最小）的数排在最后一位。然后，再对最后一位以外的数组，重复前面的过程，直至全部排序完成。由于每进行一遍这个过程，在最后一个位置上，正确的数会自己冒出来，就好像“冒泡”一样，这种算法因此得名。

以对数组[3, 2, 4, 5, 1] 进行从小到大排序为例，步骤如下：

1. 第一位的“3”与第二位的“2”进行比较，3大于2，所以互换位置，数组变成[2, 3, 4, 5, 1] 。
2. 第二位的“3”与第三位的“4”进行比较，3小于4，数组不变。
3. 第三位的“4”与第四位的“5”进行比较，4小于5，数组不变。
4. 第四位的“5”与第五位的“1”进行比较，5大于1,所以互换位置，数组变成[2, 3, 4, 1, 5] 。

第一轮排序完成，可以看到最后一位上的5，已经是正确的数了。

然后，再对剩下的数[2, 3, 4, 1] 重复这个过程，每一轮都会在本轮最后一位上出现正确的数。直至只剩下一个位置，所有排序结束。

下面是实现的代码。

先定义一个交换函数，作用是交换两个位置的值。

{% highlight javascript %}

function swap(myArray, p1, p2){
    var temp = myArray[p1];
    myArray[p1] = myArray[p2];
    myArray[p2] = temp;
}

{% endhighlight %}

然后定义主函数。

{% highlight javascript %}

function bubbleSort(myArray){

    var len = myArray.length,
        i, j, stop;

    for (i=0; i < len; i++){
        for (j=0, stop=len-i; j < stop; j++){
            if (myArray[j] > myArray[j+1]){
                swap(myArray, j, j+1);
            }
        }
    }

    return myArray;
}

{% endhighlight %}

## 参考链接

* [Computer science in JavaScript: Bubble sort](http://www.nczonline.net/blog/2009/05/26/computer-science-in-javascript-bubble-sort/), Nicholas C. Zakas
