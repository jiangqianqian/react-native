import axios from 'axios';
import Constants from '../../common/Constants';
const url_source = '/customer/basic/waySources';
const url_group = '/customer/basic/customerGroups';
let houseStyle = [
  {
    key: '一房',
    value: '一房'
  },
  {
    key: '二房',
    value: '二房'
  },
  {
    key: '三房',
    value: '三房'
  },
  {
    key: '四房',
    value: '四房'
  },
  {
    key: '五房及以上',
    value: '五房及以上'
  },
  {
    key: '别墅',
    value: '别墅'
  },
  {
    key: '写字楼',
    value: '写字楼'
  },
  {
    key: '商铺',
    value: '商铺'
  },
  {
    key: '其他',
    value: '其他'
  },
];
let prices = [
  {
    key: [0, 50],
    value: '0—50万'
  },
  {
    key: [50, 100],
    value: '50—100万'
  },
  {
    key: [100, 150],
    value: '100—150万'
  },
  {
    key: [150, 200],
    value: '150—200万'
  },
  {
    key: [200, 300],
    value: '200—300万'
  },
  {
    key: [300, 400],
    value: '300—400万'
  },
  {
    key: [500,],
    value: '500万以上'
  },
];
let area = [
  {
    key: [0, 50],
    value: '0—50平方'
  },
  {
    key: [50, 100],
    value: '50—100平方'
  },
  {
    key: [100, 150],
    value: '100—150平方'
  },
  {
    key: [150, 200],
    value: '150—200平方'
  },
  {
    key: [200, 300],
    value: '200—300平方'
  },
  {
    key: [300,],
    value: '300平方以上'
  },
];
function getHouseStyle(type) {
  if (type && type === 'query' && houseStyle.length === 9) {
    let queryHouseStyle = [].concat(houseStyle)
    queryHouseStyle.unshift({
      key: '',
      value: '不限'
    });
    return _makePromise(queryHouseStyle);
  }
  return _makePromise(houseStyle);
}

function getPrice(type) {
  if (type && type === 'query' && prices.length === 7) {
    let queryPrices = [].concat(prices);
    queryPrices.unshift({
      key: [],
      value: '不限'
    });
    return _makePromise(queryPrices);
  }
  return _makePromise(prices);
}
function getArea(type) {
  if (type && type === 'query' && area.length === 7) {
    let queryArea = [].concat(area);
    queryArea.unshift({
      key: [],
      value: '不限'
    });
    return _makePromise(queryArea);
  }
  return _makePromise(area);
}
function getGroup(type, userCache = false) {
  return readData(url_group, type, userCache);
}

function getSource(type, userCache = true) {
  return readData(url_source, type, userCache);
}

function _makePromise(data) {
  return new Promise.resolve(data);
}
function readData(url, type, userCache, idName = 'id', ValueName = 'name') {
  let now = Date.parse(new Date());
  if (!expireManager[url]) {
    expireManager[url] = { timestamp: now, data: null };
  }
  //获取数据,缓存5分钟
  if (userCache && expireManager[url].data && expireManager[url].timestamp < now + 1000 * 60 * 5) {
    if (!type) {
      let queryData = [].concat(expireManager[url].data)
      queryData.shift();
      return _makePromise(queryData);
    }
    return _makePromise(expireManager[url].data);
  } else {
    let promise = axios.get(url, {
      timeout: 3000,
    }).then(res => {
      if (res.data.status == 'C0000') {
        let source = type && type === 'query' ? [{ key: '', value: '不限' }] : [];
        for (let result of res.data.result) {
          source.push({ key: result[idName], value: result[ValueName] })
        }
        expireManager[url].data = source;
        expireManager[url].timestamp = now;
        return _makePromise(source);
      } else {
        expireManager[url].data = null;
        return _makePromise([]);
      }
    });
    return promise;
  }
}

const expireManager = {};


export {
  getHouseStyle,    // 房型
  getArea,          // 面积
  getPrice,         // 价格
  getGroup,         // 分组
  getSource,        // 来源
};
export default class FilterData {

}
