import React, { useEffect, useRef, useState } from 'react';
import queryKLine from './utils/query-k-line';
import stocks from './utils/stocks.json';
import * as echarts from 'echarts';

import './App.css';

const params = new URLSearchParams(window.location.search);
const { index } = Object.fromEntries(params.entries());

let i = 0;

function App() {
  const [startIndex, setStartIndex] = useState(index || 0);

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
          startValue: klines.length - 200,
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
              text: `${name}(${startIndex + 1}/${stocks.length})`,
              fontSize: 16,
              fill: 'white',
            },
            onclick: () => {
              const [codeNumber, ex] = code.split('.');
              // 东财 url 上 code 格式
              const code_for_dongcai = `${ex}${codeNumber}`;
              window.open(
                `https://emweb.securities.eastmoney.com/pc_hsf10/pages/index.html?type=web&code=${code_for_dongcai}&color=b#/gsgk`
              );
            },
          },
        ],
      },
    };
    chartInstanceRef.current.setOption(option, { notMerge: true });
  };

  useEffect(() => {
    queryKLine(code).then((data) => {
      generateOption(data.klines);
    });
    // eslint-disable-next-line
  }, [code]);

  const handleKeyboard = (e) => {
    const max = stocks.length - 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (i <= 0) {
        setStartIndex(max);
        i = max;
      } else {
        setStartIndex(i - 1);
        i = i - 1;
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (i >= max) {
        setStartIndex(0);
        i = 0;
      } else {
        setStartIndex(i + 1);
        i = i + 1;
      }
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
