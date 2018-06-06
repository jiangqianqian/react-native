export function parseIntention(item) {
  let str = '';
  //请勿修改顺序(根据城市/区/街道/楼盘名称/....) eg: 北京/朝阳/奥运村/正中时代广场/1平米/12万/三房
  item.intentionCityName && (str += item.intentionCityName);
  item.intentionCountyName && (str += '/' + item.intentionCountyName);
  item.intentionAreaName && (str += '/' + item.intentionAreaName);
  item.intentionGardenName && (str += (str ? '/' : '') + item.intentionGardenName);

  if (item.minArea && item.maxArea === 0) {
    str += (str ? '/' : '') + item.minArea + '平米以上';
  } else if(item.minArea===0 && item.maxArea === 0){
    str += '';
  }else {
    str += (str ? '/' : '') + item.minArea + '-' + item.maxArea + '平米';
  }

  let minPrice = item.minPrice / 10000;
  let maxPrice = item.maxPrice / 10000;

  if (minPrice && maxPrice === 0) {
    str += (str ? '/' : '') + minPrice + '万以上';
  } else if(minPrice===0 && maxPrice === 0){
    str += '';
  }else {
    str += (str ? '/' : '') + minPrice + '-' + maxPrice + '万';
  }

  item.layout && (str += (str ? '/' : '') + item.layout);
  return str;
  }
