import React from 'react';

const Select = (props) => {
  return (
    <>
      <label htmlFor={props.name}>{props.actions}</label>

      <select
        name={props.name}
        id={props.name}
        onChange={(event) => props.callback(event)}
        style={{
          display: 'block',
          width: props.width,
          padding: props.padding || '10px 25px',
          margin: props.margin,
          background: props.color || 'aliceblue',
          borderRadius: props.borderRadius || '5px',
          border: props.border || 'solid 1px white',
          fontWeight: props.fontWeight || '400',
        }}
      >
        <option value=''>--{props.item}--</option>
        {props.values &&
          props.values.map((value, index) => {
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
      </select>
    </>
  );
};

export default Select;
