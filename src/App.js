import React, { useEffect, useRef, useState } from 'react';
import queryKLine from './utils/query-k-line';
import stocks from './utils/stocks.json';
import * as echarts from 'echarts';

import './App.css';

const params = new URLSearchParams(window.location.search);
const { index, code, name } = Object.fromEntries(params.entries());

let i = Number(index) - 1 || 0;
let _cycle = 'week';

stocks.unshift({
  SECUCODE: code,
  SECURITY_NAME_ABBR: name,
});

function App() {
  const [startIndex, setStartIndex] = useState(i);
  const [cycle, setCycle] = useState('week'); // week or dayF

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const { SECUCODE: code, SECURITY_NAME_ABBR: name } = stocks[startIndex];

  const generateOption = (klines) => {
    const option = {
      animation: false,
      backgroundColor: 'black',
      legend: { textStyle: { color: 'white' } },
      tooltip: {
        trigger: 'axis',
        showContent: false,
        axisPointer: {
          type: 'cross',
        },
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all',
          },
        ],
        label: {
          backgroundColor: '#777',
        },
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          startValue: klines.length - (cycle === 'week' ? 260 : 200),
        },
      ],
      grid: [
        {
          top: '4%',
          left: '2%',
          right: '1%',
          bottom: '30%',
        },
        {
          top: '74%',
          left: '2%',
          right: '1%',
          bottom: '0.2%',
        },
      ],
      yAxis: [
        {
          gridIndex: 0,
          min: 'dataMin',
          max: 'dataMax',
          splitLine: {
            show: false,
          },
        },
        {
          gridIndex: 1,
          max: 'dataMax',
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
      ],
      xAxis: [
        { gridIndex: 0, data: klines.map((item) => item.date) },
        {
          gridIndex: 1,
          data: klines.map((item) => item.date),
          axisLabel: {
            show: false,
          },
        },
      ],
      series: [
        {
          xAxisIndex: 0,
          yAxisIndex: 0,
          name: 'kline',
          type: 'candlestick',
          data: klines.map((item) => [
            item.open,
            item.close,
            item.low,
            item.high,
          ]),
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: { show: true, position: 'start', color: 'white' },
            lineStyle: { color: 'white', width: 0.5, type: 'dashed' },
            data: [
              {
                yAxis: klines.at(-1).close,
              },
            ],
          },
        },
        {
          xAxisIndex: 0,
          yAxisIndex: 0,
          name: 'ma10',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: klines.map((item) => item.ma10),
          lineStyle: {
            width: 0.8,
            color: 'white', // 橙红色
          },
        },
        {
          xAxisIndex: 0,
          yAxisIndex: 0,
          name: 'ma20',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: klines.map((item) => item.ma20),
          lineStyle: {
            width: 0.8,
            color: '#0000FF', // 纯蓝色
          },
        },
        {
          xAxisIndex: 0,
          yAxisIndex: 0,
          name: 'ma30',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: klines.map((item) => item.ma30),
          lineStyle: {
            width: 0.8,
            color: '#4169E1', // 皇家蓝
          },
        },
        {
          xAxisIndex: 0,
          yAxisIndex: 0,
          name: 'ma40',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: klines.map((item) => item.ma40),
          lineStyle: {
            width: 0.8,
            color: '#008000', // 纯绿色
          },
        },
        {
          xAxisIndex: 0,
          yAxisIndex: 0,
          name: 'ma50',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: klines.map((item) => item.ma50),
          lineStyle: {
            width: 0.8,
            color: '#FF0000', // 红色
          },
        },
        {
          xAxisIndex: 0,
          yAxisIndex: 0,
          name: 'ma60',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: klines.map((item) => item.ma60),
          lineStyle: {
            width: 0.8,
            color: '#00FF00', // 亮绿色
          },
        },
        {
          xAxisIndex: 1,
          yAxisIndex: 1,
          name: 'vol',
          type: 'bar',
          data: klines.map((item) => item.vol),
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: { color: 'white', width: 1, type: 'solid' },
            data: [
              {
                yAxis: klines.at(-1).vol,
              },
            ],
          },
          itemStyle: {
            color: (params) => {
              const close = klines[params.dataIndex]?.close;
              const preClose = klines[params.dataIndex - 1]?.close;
              if (close > preClose) {
                return '#eb5454';
              } else {
                return '#47b262';
              }
            },
          },
        },
      ],
      graphic: {
        elements: [
          {
            type: 'text',
            top: '1%',
            left: '2%',
            z: 10,
            style: {
              text: `${name}(${startIndex + 1}/${stocks.length})(${
                cycle === 'week' ? '周' : '日'
              })`,
              fontSize: 16,
              fill: 'white',
            },
            onclick: () => {
              window.open(`https://wangchaotv.github.io/stock/?code=${code}`);
            },
          },
        ],
      },
    };
    chartInstanceRef.current.setOption(option, { notMerge: true });
  };

  useEffect(() => {
    queryKLine(code, cycle).then((data) => {
      generateOption(data.klines);
    });
    // eslint-disable-next-line
  }, [code, cycle]);

  const handleKeyboard = (e) => {
    const max = stocks.length - 1;
    if (e.key === 'ArrowLeft') {
      if (i <= 0) {
        setStartIndex(max);
        i = max;
      } else {
        setStartIndex(i - 1);
        i = i - 1;
      }
      setCycle('week');
      _cycle = 'week';
    } else if (e.key === 'ArrowRight') {
      if (i >= max) {
        setStartIndex(0);
        i = 0;
      } else {
        setStartIndex(i + 1);
        i = i + 1;
      }
      setCycle('week');
      _cycle = 'week';
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setCycle(_cycle === 'week' ? 'day' : 'week');
      _cycle = _cycle === 'week' ? 'day' : 'week';
    } else if (e.key === 'Enter') {
    }
  };

  const handleResize = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resize();
    }
  };

  useEffect(() => {
    chartInstanceRef.current = echarts.init(chartRef?.current, null, {
      renderer: 'svg',
    });

    window.addEventListener('keydown', handleKeyboard);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div style={{ width: '100vw', height: '100vh' }} ref={chartRef}></div>;
}

export default App;
