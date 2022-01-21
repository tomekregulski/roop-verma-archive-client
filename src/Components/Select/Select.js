import React from 'react';

const Select = (props) => {
  return (
    <>
      <label for={props.name}>{props.actions}</label>

      <select
        name={props.name}
        id={props.name}
        onChange={(event) => props.callback(event)}
      >
        <option value=''>--{props.item}--</option>
        {props.values &&
          props.values.map((value) => {
            return <option value={value}>{value}</option>;
          })}
      </select>
    </>
  );
};

export default Select;
