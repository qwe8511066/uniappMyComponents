/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 迭代设置全局对象
 * obj 对象
 */
export function forSetPrototype(obj) {
  Object.keys(obj).forEach((key, value) => {
    setProto(key, obj[key]);
  });
}

/**
 * 迭代设置全局对象
 * obj 对象
 */
export function setFromResult(form, result) {
  Object.keys(result).forEach((key, value) => {
    form[key] = result[key]
  });
  return form;
}

/**
 * 迭代设置全局对象
 * obj 对象
 */
export function setFromResultFilte(form, result) {
  Object.keys(result).forEach((key, value) => {
    if (!form[key]) {
      form[key] = result[key]
    }
  });
  return form;
}


/**
 * 根据enum转换成对象 少写一个select 维护2份数据
 */
export function enumSelect(array) {
  const value = {}
  if (checkArray(array)) {
    array.forEach((item) => {
      // item["'"+item.value+"'"] = {
      //   text:item.label
      // };
      value[item.value.toString()] = {
        text: item.label
      }
    })
  }
  console.log(array);
  return value
}

export function setTreeParamsData(array) {
  const list = []
  list.push({
    name: '无父级',
    testId: '0'
  })
  if (checkArray(array)) {
    array.forEach(item => {
      list.push({
        name: item.title,
        testId: item.key
      });
    })
  }
  return list;
}


/**
 * 数组中单独判断
 * @param array 数组
 * @param checkAttribute  判断的属性
 * @param typeString 校验的属性
 * @param return  boolean
 */
export function checkArrayString(array, arrayType, typeString) {
  let index = -1;
  // console.log(arrayType);
  // console.log()
  if (Array.isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      const type = arrayType.split('.').length < 2 ? (arrayType && array[i][arrayType] == typeString) || (!arrayType && array[i] == typeString) : getMultistage(array[i], arrayType) == typeString
      // if(arrayType.split('.').length<2){
      //   if ((arrayType && array[i][arrayType] == typeString) || (!arrayType && array[i] == typeString)) {        
      //     index = i;
      //     break;
      //   }
      // }else{
      //   if (getMultistage(array[i],arrayType) == typeString) {        
      //     index = i;
      //     break;
      //   }
      // } 
      if (type) {
        index = i;
        break;
      }
    }
  } else {
    throw new Error('传入的类型错误');
  }
  return index;
}

export function checkArray(array) {
  return array && array.length > 0;
}

/**
 * 判断数据类型
 * @param {*} data 传入需判断数据类型的参数
 * @return {String} 数据类型(全小写字符串)
 */
export const judgeDataType = (data) => {
  const dataProto = Object.prototype.toString.call(data)
  if (dataProto === '[object String]') return 'string'
  if (dataProto === '[object Number]') return 'number'
  if (dataProto === '[object Symbol]') return 'symbol'
  if (dataProto === '[object Boolean]') return 'boolean'
  if (dataProto === '[object Undefined]') return 'undefined'
  if (dataProto === '[object Null]') return 'null'
  if (dataProto === '[object Array]') return 'array'
  if (dataProto === '[object Function]') return 'function'
  if (dataProto === '[object Date]') return 'date'
  if (dataProto === '[object RegExp]') return 'regexp'
  if (dataProto === '[object HTMLDocument]') return 'document'
  if (dataProto === '[object Window]') return 'window'
}


/**
 * 关闭当前路由(关闭当前tag)
 * @param  {...any} keys 保留原本做法上支持0-3个参数，
 * 如果只传1个，则只需传跳转路由名称
 * 如果传3个(原做法)，则跳转路由名称为第三个参数
 */
export function closeCurTag(...keys) {
  this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
    if (keys.length === 1 && judgeDataType(keys[0]) === 'string') {
      this.$router.replace({ name: keys[0] })
      this.$store.dispatch('tagsView/updateVisitedIsRefesh', { name: keys[0] })
    } else if (keys.length === 3 && judgeDataType(keys[2]) === 'string') {
      this.$router.replace({ name: keys[2] })
      this.$store.dispatch('tagsView/updateVisitedIsRefesh', { name: keys[2] })
    } else {
      toLastView(visitedViews, this)
    }
  })
}

const toLastView = (visitedViews, _this) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    _this.$router.push(latestView)
    _this.$store.dispatch('tagsView/updateVisitedIsRefesh', latestView)
  } else {
    if (_this.$route.name === 'Dashboard') {
      _this.$router.replace({ path: '/redirect' + _this.$route.fullPath })
    } else {
      _this.$router.push('/')
    }
  }
}

/**
 * @param object Array (obj1, obj2)
 * 对比两个对象是否相同
 * 先判断俩者是不是对象
 * 是对象后俩者长度是否一致
 * 判断俩个对象的所有key值是否相等相同
 * 判断俩个对象的相应的key对应的值是否相同
 * 递归判断里面的对象循环1-4步骤
 * */
export function objectsDiff(obj1, obj2) {
  var o1 = obj1 instanceof Object;
  var o2 = obj2 instanceof Object;
  // 判断对象
  if (!o1 || !o2) {
    return obj1 === obj2;
  }
  // Object.keys() 返回一个有对象的自身可枚举属性（key值）组成的数组
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object;
    var t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return objectsDiff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
}

/**
 * 获取对象过滤器
 * @param type 键值
 * @param arr 校验的数组
 * @param replace 校验的键名
 */
export function getObjByValue(type, arr, replace) {
  arr = arr || [];
  replace = replace || 'value';
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][replace] == type) {
      obj = arr[i];
      obj.index = i;
      break;
    }
  }
  return obj;
}

export let menus = {}

//剔除多余的按钮权限
export function checkMenusButton(array) {
  array.forEach(item => {
    if (item.component != 'true') {
      if (checkArray(item.menus)) {
        menus[item.path] = {}
        item.menus.forEach(box => {
          menus[item.path][box.type] = {
            value: box.value
          }
        })
      }
    }
    if (checkArray(item.children)) {
      checkMenusButton(item.children);
    }
  });
  return menus
}

//校验动态根路由
export function checkMenu(data) {
  const list = []
  if (checkArray(data)) {
    data.forEach(item => {
      if (item.component === 'true') {
      } else if (item.component && !checkArray(item.children)) {
        const cobyItem = JSON.parse(JSON.stringify(item))
        item = {
          path: cobyItem.path,
          component: 'true',
          children: [{
            path: cobyItem.path,
            component: cobyItem.component,
            meta: {
              title: cobyItem.meta.title,
              icon: cobyItem.meta.icon
            },
            isOpen: cobyItem.isOpen,
            isLeaf: cobyItem.isLeaf
          }]
        }
      }
      list.push(item)
    })
  }
  return list
}


export function getMultistage(data, index) {
  let temp = data;
  let path = index.split('.');
  if (path.length < 2) {
    return data[index]
  }
  for (let index = 0; index < path.length; index++) {
    if (temp[path[index]]) {
      temp = temp[path[index]]
    }
  }
  return temp
}

/**
 * 判断文件格式
 * @param file 文件名字
 * @returns {string}
 */
export function getFileType(file) {
  var count = 1;
  for (var i = file.length - 1; i > -1; i--) {
    var last = file.substr(i, count);
    count++;
    var dot = last.substr(0, 1);
    if (dot == '.') {
      return last;
    }
  }
}

/**
 * 校验obj的对象
 * @param {*} obj 
 */
export function checkObjectString(obj, name) {
  let item = getMultistage(obj, name);
  const value = item && typeof (item) == 'object' ? null : item;
  return value;
}


/**
 * 计算24小时内时间差
 * @param {string} t1 时间1(HH:mm)
 * @param {string} t2 时间2(HH:mm)
 * @returns {number} 时间差换算的10进制小时数
 */
export const timeSubtract = (t1, t2) => {
  if (t1 === t2 || t1 === '' || t2 === '') return 0
  t1 = new Date(`2077/01/01 ${t1}:00`)
  t2 = new Date(`2077/01/01 ${t2}:00`)
  t1 = t1.getTime()
  t2 = t2.getTime()
  const time1 = t1 > t2 ? t1 : t2
  const time2 = t1 < t2 ? t1 : t2
  const afterSub = (time1 - time2) / 1000
  const hour = Number(afterSub) / 3600
  return hour
}

/**
 * 数组融合并去重
 * @param {array} arr1 数组1
 * @param {array} arr2 数组2
 * @param {string} property 需要比对的属性
 */
export const setArrMerge = (arr1, arr2, property) => {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (property) {
        if (arr1[i][property] === arr2[j][property]) arr2.splice(j, 1)
      } else {
        if (arr1[i] === arr2[j]) arr2.splice(j, 1)
      }
    }
  }
  const arr = [...arr1, ...arr2]
  return arr
}

export function formatJson(txt, compress) {
  var indentChar = '    ';
  if (/^\s*$/.test(txt)) {
    console.log('数据为空,无法格式化! ');
    return;
  }
  try {
    var data = eval('(' + txt + ')');
  } catch (e) {
    console.log('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
    return;
  }
  var draw = [],
    last = false,
    This = this,
    line = compress ? '' : '\n',
    nodeCount = 0,
    maxDepth = 0;

  var notify = function (name, value, isLast, indent, formObj) {
    nodeCount++; /*节点计数*/
    for (var i = 0, tab = ''; i < indent; i++)
      tab += indentChar; /* 缩进HTML */
    tab = compress ? '' : tab; /*压缩模式忽略缩进*/
    maxDepth = ++indent; /*缩进递增并记录*/
    if (value && value.constructor == Array) {
      /*处理数组*/
      draw.push(
        tab + (formObj ? '"' + name + '":' : '') + '[' + line
      ); /*缩进'[' 然后换行*/
      for (var i = 0; i < value.length; i++)
        notify(i, value[i], i == value.length - 1, indent, false);
      draw.push(
        tab + ']' + (isLast ? line : ',' + line)
      ); /*缩进']'换行,若非尾元素则添加逗号*/
    } else if (value && typeof value == 'object') {
      /*处理对象*/
      draw.push(
        tab + (formObj ? '"' + name + '":' : '') + '{' + line
      ); /*缩进'{' 然后换行*/
      var len = 0,
        i = 0;
      for (var key in value)
        len++;
      for (var key in value)
        notify(key, value[key], ++i == len, indent, true);
      draw.push(
        tab + '}' + (isLast ? line : ',' + line)
      ); /*缩进'}'换行,若非尾元素则添加逗号*/
    } else {
      if (typeof value == 'string') value = '"' + value + '"';
      draw.push(
        tab +
        (formObj ? '"' + name + '":' : '') +
        value +
        (isLast ? '' : ',') +
        line
      );
    }
  };
  var isLast = true,
    indent = 0;
  notify('', data, isLast, indent, false);
  return draw.join('');
}

export function lowestArray(routes) {
  const arr = [];
  const expanded = datas => {
    if (datas && datas.length > 0) {
      arr.push(datas[0]);
      expanded(datas[0].children);
    }
  };
  expanded(routes.children);
  return checkArray(arr) ? arr[arr.length - 1] : undefined;
}

export function arrayRoutesActive(routes) {
  let list = []
  routes.forEach((item, index) => {
    list.push({ path: item.path, index: index, name: item.name })
    if (item.children) {
      list = list.concat(arrayChildrenRoutesActive(item.children, index))
    }
  })
  return list
}

export function arrayChildrenRoutesActive(routes, index) {
  let arr = [];
  const expanded = datas => {
    if (datas && datas.length > 0) {
      datas.forEach(e => {
        arr.push({ path: e.path, index: index, name: e.name });
        expanded(e.children);
      })
    }
  };
  expanded(routes);
  return arr;
}
