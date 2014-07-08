---
title: HTML网页元素
category: htmlapi
layout: page
date: 2014-07-08
modifiedOn: 2014-07-08
---

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
