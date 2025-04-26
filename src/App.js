import React, { useEffect, useRef } from 'react';
import queryKLine from './utils/query-k-line';
import stocks from './utils/stocks.json';

import './App.css';

let i = 0;

function App() {
  const [index, setIndex] = React.useState(0);
  const [klines, setKlines] = React.useState([]);
  const chartInstanceRef = useRef(null);

  const { SECUCODE: code, SECURITY_NAME_ABBR: name } = stocks[index];

  useEffect(() => {
    queryKLine(code).then((data) => {
      setKlines(data.klines);
    });
  }, [code]);

  const handleKeyboard = (e) => {
    const max = stocks.length - 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (i <= 0) {
        setIndex(max);
        i = max;
      } else {
        setIndex(i - 1);
        i = i - 1;
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (i >= max) {
        setIndex(0);
        i = 0;
      } else {
        setIndex(i + 1);
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
    window.addEventListener('keydown', handleKeyboard);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {name}: {klines?.length}
    </div>
  );
}

export default App;
