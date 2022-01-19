import React from 'react';

const Button = (props) => {
  return (
    <div>
      <button
        onClick={props.callback}
        type='submit'
        style={{
          display: 'block',
          width: props.width,
          padding: props.padding,
          margin: props.margin,
          backgroundColor: 'aliceblue',
          borderRadius: '5px',
          border: 'solid 1px grey',
        }}
      >
        {props.name}
      </button>
    </div>
  );
};

export default Button;
