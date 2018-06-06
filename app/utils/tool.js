
export function urlByAppendingParams(url: string, params: Object) {
  let result = url
  if (result.substr(result.length - 1) != '?') {
    result = result + `?`
  }

  for (let key in params) {
    let value = params[key]
    result += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
  }

  result = result.substring(0, result.length - 1);
  return result;
};

export function toThousands(num) {
  num = (num || 0) + '';
  let x = num.split('.');
  let integer = x[0];
  let decimal = x[1];
  let result = '';

  if (integer.length > 3) {
    while (integer.length > 3) {
      result = ',' + integer.slice(-3) + result;
      integer = integer.slice(0, integer.length - 3);
    }

    result = integer + result;
    if (decimal) {
      result = result + '.' + decimal;
    }
  } else {
    return num;
  }

  return result;
}
