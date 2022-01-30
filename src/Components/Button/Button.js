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
          padding: props.padding || '10px 25px',
          margin: props.margin,
          color: props.color || 'aliceblue',
          borderRadius: props.borderRadius || '5px',
          border: props.border || 'solid 1px white',
          fontWeight: props.fontWeight || '400',
        }}
      >
        {props.name}
      </button>
    </div>
  );
};

export default Button;
