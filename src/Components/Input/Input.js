import React from 'react';

const Input = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: props.margin,
      }}
    >
      <label style={{ color: props.labelColor }} htmlFor={props.name}>
        {props.label}
      </label>
      <input
        value={props.value}
        type={props.type}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        onChange={(event) => props.callback(event, props.id)}
        style={{
          margin: props.margin || '0 15px 0 0',
          padding: props.padding || '5px',
          border: 'solid 1px white',
          borderRadius: '5px',
        }}
      />
    </div>
  );
};

export default Input;
