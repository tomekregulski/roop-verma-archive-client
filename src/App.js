import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('https://roop-verma-archive.herokuapp.com/api/raags')
      .then((response) => {
        const res = response.data;
        setData(res);
      });
  }, []);

  const dataMap = () => {
    console.log('mapping data');
    data.map((item, index) => {
      console.log(item.name);
      return <li key={index}>{item.name}</li>;
    });
  };

  return (
    <div>
      <h1>Welcome to the Roop Verma Digital Archive</h1>
      <p>Some names of raags:</p>
      <ul>
        {data.map((item, index) => {
          console.log(item.name);
          return <li key={index}>{item.name}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
