import React from 'react';

const Button = (props) => {
  return (
    <div>
      <button
        onClick={props.callback}
        type='submit'
        style={{
          display: 'block',
          width: props.width || '80px',
          padding: props.padding || '10px 25px',
          backgroundColor: props.backgroundColor || 'white',
          margin: props.margin,
          color: props.color || 'black',
          borderRadius: props.borderRadius || '5px',
          border: props.border || 'solid 1px rgba(0, 180, 249, 0.872)',
          fontWeight: props.fontWeight || '400',
        }}
      >
        {props.name}
      </button>
    </div>
  );
};

export default Button;
