import Vue from 'vue'
/**
 * 将时间戳改为时间格式
 * @param  {[number || string]} time [时间戳]
 * @param  {[string]} format [时间格式 yyyy-MM-dd hh:mm:ss]
 * @return {[string]}      [需要的时间]
 */
function formatTime(time, format) {
  var date = new Date(time) // 获取一个时间对象  注意：如果是uinx时间戳记得乘于1000。比如php函数time()获得的时间戳就要乘于1000
  // 定义一个数组接收时间格式所有数据
  var formatArr = [
    // txt: 所属字段 -- index: 当前所处索引位置
    { yyyy: '', txt: 'yyyy', index: 0 }, // 年
    { MM: '', txt: 'MM', index: 1 }, // 月
    { dd: '', txt: 'dd', index: 2 }, // 日
    { hh: '', txt: 'hh', index: 3 }, // 时
    { mm: '', txt: 'mm', index: 4 }, // 分
    { ss: '', txt: 'ss', index: 5 } // 秒
  ]
  // 如果含有当前字段 做响应处理
  if (format.indexOf(formatArr[0].txt) !== -1) {
    formatArr[0].yyyy = date.getFullYear() + ''
  }

  if (format.indexOf(formatArr[1].txt) !== -1) {
    formatArr[1].MM =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + ''
  }

  if (format.indexOf(formatArr[2].txt) !== -1) {
    formatArr[2].dd =
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ''
  }

  if (format.indexOf(formatArr[3].txt) !== -1) {
    formatArr[3].hh =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ''
  }

  if (format.indexOf(formatArr[4].txt) !== -1) {
    formatArr[4].mm =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ''
  }

  if (format.indexOf(formatArr[5].txt) !== -1) {
    formatArr[5].ss =
      (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) +
      ''
  }

  // 获取中间格式
  var splitArr = format.split(/yyyy|MM|dd|hh|mm|ss/)
  for (let i = 0; i < formatArr.length; i++) {
    // 给索引赋值
    formatArr[i].index = format.indexOf(formatArr[i].txt)
    if (format.indexOf(formatArr[i].txt) !== -1) {
      // 如果不存在当前项则跳过
      continue
    } else {
      // 否则插入当前项
      splitArr.splice(i, 0, '')
    }
  }
  // 排序数组
  for (let i = 0; i < formatArr.length - 1; i++) {
    for (let j = 0; j < formatArr.length - 1 - i; j++) {
      if (formatArr[j + 1].index < 0) continue
      if (formatArr[j].index > formatArr[j + 1].index) {
        const temp = formatArr[j]
        formatArr[j] = formatArr[j + 1]
        formatArr[j + 1] = temp
      }
    }
  }
  // console.log(formatArr)
  // console.log(splitArr)
  // 拼接字符串得到结果
  var result = ''
  for (let i = 0; i < formatArr.length; i++) {
    result += splitArr[i] + formatArr[i][formatArr[i].txt]
  }
  return result
}
// 挂载到原型

Vue.prototype.$format = formatTime
