import React, { useEffect } from 'react';
import './App.css';

import queryKLine from './utils/query-k-line';

function App() {
  const [code, setCode] = React.useState('000001.SZ');
  const [name, setName] = React.useState('');
  const [klines, setKlines] = React.useState([]);

  useEffect(() => {
    queryKLine(code).then((data) => {
      setName(data.name);
      setKlines(data.klines);
    });
  }, [code]);

  return (
    <div>
      {name}: {klines?.length}
    </div>
  );
}

export default App;
