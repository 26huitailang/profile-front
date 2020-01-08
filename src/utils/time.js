// 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
export function nowDate() {
  // 获取当前日期
  var date = new Date();

  // 获取当前月份
  var nowMonth = date.getMonth() + 1;

  // 获取当前是几号
  var strDate = date.getDate();

  // 添加分隔符“-”
  var seperator = "-";

  // 对月份进行处理，1-9月在前面添加一个“0”
  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = "0" + nowMonth;
  }

  // 对月份进行处理，1-9号在前面添加一个“0”
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }

  var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;

  return nowDate;
}

export function nowTimestamp() {
  var date = new Date();
  var ts = date.getTime() + date.getTimezoneOffset() * 60000;
  return ts;
}

// export function formatDate(ts, fmt = "yyyy-MM-dd HH:mm:SS") {
//   var date = new Date(ts);
//   date = date.format(fmt);
//   return date;
// }

export function formatTimeStamp(stamp, format) {
  if (!stamp) return "无";

  stamp = new Date(stamp);
  format = format || "YY-MM-DD hh:mm:ss";

  const year = stamp.getFullYear();
  const month = stamp.getMonth() + 1;
  const day = stamp.getDate();
  const hour = stamp.getHours();
  const minutes = stamp.getMinutes();
  const seconds = stamp.getSeconds();

  return format
    .replace("YY", year)
    .replace("MM", month < 10 ? "0" + month : month)
    .replace("DD", day < 10 ? "0" + day : day)
    .replace("hh", hour < 10 ? "0" + hour : hour)
    .replace("mm", minutes < 10 ? "0" + minutes : minutes)
    .replace("ss", seconds < 10 ? "0" + seconds : seconds);
}
