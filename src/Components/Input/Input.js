import React from 'react';

const Input = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        margin: props.margin,
      }}
    >
      <label htmlFor={props.name}>{props.label}</label>
      <input
        value={props.value}
        type={props.type}
        id={props.id}
        name={props.name}
        onChange={(event) => props.callback(event, props.id)}
      />
    </div>
  );
};

export default Input;
