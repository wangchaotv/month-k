import dayjs from 'dayjs';
import { round } from 'mathjs';

const search = new URLSearchParams(window.location.search);
const endTime = search.get('endTime');

const exMap = {
  SZ: '0',
  SH: '1',
};

const strArrToObjArr = (data) => {
  return data?.map((item) => {
    const [date, open, close, high, low, vol] = item?.split(',') || [];
    return {
      date: dayjs(date).format('YYYYMMDD'),
      open: Number(open),
      close: Number(close),
      high: Number(high),
      low: Number(low),
      vol: Number(vol),
    };
  });
};

// 计算均线
const calc_ma = (data, ma_period) => {
  if (!data?.length) {
    return data;
  }
  const period_key = `ma${ma_period}`;
  return data.map((item, index) => {
    if (index < ma_period - 1) {
      return {
        ...item,
        [period_key]: undefined,
      };
    } else {
      const sum = data
        .slice(index - ma_period + 1, index + 1)
        .reduce((sum, item) => sum + item?.close, 0);
      return {
        ...item,
        [period_key]: round(sum / ma_period, 2),
      };
    }
  });
};

export default async (ts_code) => {
  const [code, ex] = ts_code.split('.');

  try {
    const secid = `${exMap[ex]}.${code}`; // 沪A 0.xxxxxx, 深A 1.xxxxxx
    const fields1 = 'f1,f3'; // data { code、 name }
    const fields2 = 'f51,f52,f53,f54,f55,f56'; // data.klines [[日期 开盘 收盘 最高 最低 成交量], []]
    const klt = 103; // 周期: 101 日线,  102 周线,  103 月线
    const fqt = '1'; // 复权方式 - 1 前复权
    const beg = '20000101';
    const end = endTime || '20500101';
    let url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?&secid=${secid}&fields1=${fields1}&fields2=${fields2}&klt=${klt}&fqt=${fqt}&beg=${beg}&end=${end}`;
    let response = await fetch(url);
    let data = await response.json();

    let { klines, name } = data?.data;
    klines = strArrToObjArr(klines) || [];
    klines = calc_ma(klines, 10);
    klines = calc_ma(klines, 20);
    klines = calc_ma(klines, 30);
    klines = calc_ma(klines, 40);
    klines = calc_ma(klines, 50);
    klines = calc_ma(klines, 60);

    return { klines, name, ts_code };
  } catch (error) {
    alert(`query-k-line error: ${error.message}`);
    return { klines: [], name: ts_code, ts_code };
  }
};
