function formatTime(date) {
  date = new Date(date);
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  
  var date = new Date();
  var msg = "";
  if (date.getDate() - day == 1) {
    return '昨天 ' + [hour, minute].map(formatNumber).join(":");
  } else if (date.getDate() - day == 2) {
    return '前天 ' + [hour, minute].map(formatNumber).join(":");
  } else if (date.getDate() - day > 2) {
    var time = [hour, minute].map(formatNumber).join(":");
    return [month, day].map(formatNumber).join("-") + " " + time;
  } else if (date.getMonth() + 1 - month > 0) {
    return [month, day].map(formatNumber).join("-");
  } else {
    return [hour, minute].map(formatNumber).join(":");
  }
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function trim(mystr) {
  while ((mystr.indexOf(" ") == 0) && (mystr.length > 1)) {
    mystr = mystr.substring(1, mystr.length);
  }//去除前面空格
  while ((mystr.lastIndexOf(" ") == mystr.length - 1) && (mystr.length > 1)) {
    mystr = mystr.substring(0, mystr.length - 1);
  }//去除后面空格
  if (mystr == " ") {
    mystr = "";
  }
  return mystr;
}

function reg(pattern,value){
  // console.log(pattern+"---------"+value)
  if (pattern == null || pattern == "") {
    return true;
  }
  if(value==null || value==""){
    return true;
  }
  var patrn = new RegExp(pattern);
  if (patrn.exec(value))
    return true
  return false
}
function getSuccessTime(date){
  date = new Date(date);
  //数据库的时间
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

//现在的时间
  var date = new Date();
  if ((month - (date.getMonth()+1) ) > 0 ) {
    return month - date.getMonth() + "月内"
  }else if (day - date.getDate() > 0) {
    return day - date.getDate() + "天内";
  }else{
     return hour - date.getHours() + "小时内";
  }
  // if (year - date.getFullYear()>0)
}
function formatNumber(n) {
  var t = n > 9 ? n : '0' + n;
  return t;
}

module.exports = {
  formatTime: formatTime,
  trim:trim,
  reg:reg,
  getSuccessTime:getSuccessTime
}
