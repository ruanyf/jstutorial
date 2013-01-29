---
title: 排序算法
date: 2012-12-02
category: algorithm
layout: page
modifiedOn: 2013-01-28
---

## 冒泡排序

冒泡排序（Bubble Sort）是最易懂的排序算法，但是效率较低，生产环境中很少使用。

它的基本思想是，依次比较相邻的两个数，如果不符合排序规则，则调换两个数的位置。这样一遍比较下来，能够保证最大（或最小）的数排在最后一位。然后，再对最后一位以外的数组，重复前面的过程，直至全部排序完成。由于每进行一遍这个过程，在最后一个位置上，正确的数会自己冒出来，就好像“冒泡”一样，这种算法因此得名。

以对数组[3, 2, 4, 5, 1] 进行从小到大排序为例，步骤如下：

1. 第一位的“3”与第二位的“2”进行比较，3大于2，所以互换位置，数组变成[2, 3, 4, 5, 1] 。
2. 第二位的“3”与第三位的“4”进行比较，3小于4，数组不变。
3. 第三位的“4”与第四位的“5”进行比较，4小于5，数组不变。
4. 第四位的“5”与第五位的“1”进行比较，5大于1,所以互换位置，数组变成[2, 3, 4, 1, 5] 。

第一轮排序完成，可以看到最后一位上的5，已经是正确的数了。然后，再对剩下的数[2, 3, 4, 1] 重复这个过程，每一轮都会在本轮最后一位上出现正确的数。直至剩下最后一个位置，所有排序结束。

下面是实现的代码。先定义一个交换函数，作用是交换两个位置的值。

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

## 选择排序

选择排序（Selection Sort）与冒泡排序类似，也是依次对相邻的数进行两两比较。不同之处在于，它不是每比较一次就调换位置，而是一轮比较完毕，找到最大值（或最小值）之后，将其放在正确的位置，其他数的位置不变。

以对数组[3, 2, 4, 5, 1] 进行从小到大排序为例，步骤如下：

1. 假定第一位的“3”是最小值。
2. 最小值“3”与第二位的“2”进行比较，2小于3，所以新的最小值是第二位的“2”。
3. 最小值“2”与第三位的“4”进行比较，2小于4，最小值不变。
4. 最小值“2”与第四位的“5”进行比较，2小于5，最小值不变。
5. 最小值“2”与第五位的“1”进行比较，1大于2，所以新的最小值是第五位的“1”。
6. 第五位的“1”与第一位的“3”互换位置，数组变为[1, 2, 4, 5, 3]。

这一轮比较结束后，最小值“1”已经排到正确的位置了，然后对剩下的[2, 4, 5, 3]重复上面的过程。每一轮排序都会将该轮的最小值排到正确的位置，直至剩下最后一个位置，所有排序结束。

算法实现也是先定义一个交换函数。

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

        //set minimum to this position
        min = i;

        //check the rest of the array to see if anything is smaller
        for (j=i+1; j < len; j++){
            if (myArray[j] < myArray[min]){
                min = j;
            }
        }

        //if the minimum isn't in the position, swap it
        if (i != min){
            swap(myArray, i, min);
        }
    }

    return myArray;
}

{% endhighlight %}

## 插入排序

插入排序（Selection sort）比前面两种排序方法都更有效率。它将数组分成“已排序”和“未排序”两部分，一开始的时候，“已排序”的部分只有一个元素，然后将它后面一个元素从“未排序”部分插入“已排序”部分，从而“已排序”部分增加一个元素，“未排序”部分减少一个元素。以此类推，完成全部排序。

以对数组[3, 2, 4, 5, 1] 进行从小到大排序为例，步骤如下：

1. 将数组分成[3]和[2, 4, 5, 1]两部分，前者是已排序的，后者是未排序的。
2. 取出未排序部分的第一个元素“2”，与已排序部分最后一个元素“3”比较，因为2小于3，所以2排在3前面，整个数组变成[2, 3]和[4, 5, 1]两部分。
3. 取出未排序部分的第一个元素“4”，与已排序部分最后一个元素“3”比较，因为4大于3，所以4排在3后面，整个数组变成[2, 3, 4]和[5, 1]两部分。
4. 取出未排序部分的第一个元素“5”，与已排序部分最后一个元素“4”比较，因为5大于4，所以4排在5后面，整个数组变成[2, 3, 4, 5]和[1]两部分。
5. 取出未排序部分的第一个元素“1”，与已排序部分最后一个元素“5”比较，因为1小于5，所以再与前一个元素“4”比较；因为1小于4，再与前一个元素“3”比较；因为1小于3，再与前一个元素“2”比较；因为小于1小于2，所以“1”排在2的前面，整个数组变成[1, 2, 3, 4, 5]。

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
	
## 参考链接

* Nicholas C. Zakas, [Computer science in JavaScript: Bubble sort](http://www.nczonline.net/blog/2009/05/26/computer-science-in-javascript-bubble-sort/) 
- Nicholas C. Zakas, [Computer science in JavaScript: Selection sort](http://www.nczonline.net/blog/2012/09/17/computer-science-in-javascript-insertion-sort/)
- Nicholas C. Zakas, [Computer science in JavaScript: Insertion sort](http://www.nczonline.net/blog/2012/09/17/computer-science-in-javascript-insertion-sort/)
