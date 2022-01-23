import React from 'react';

const Select = (props) => {
  return (
    <>
      <label htmlFor={props.name}>{props.actions}</label>

      <select
        name={props.name}
        id={props.name}
        onChange={(event) => props.callback(event)}
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
