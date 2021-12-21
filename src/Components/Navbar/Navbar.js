import React from 'react';

const Navbar = () => {
  return (
    <nav
      style={{
        textAlign: 'left',
        padding: '40px 0 80px 40px',
        color: 'white',
      }}
    >
      <h1>Welcome to the Roop Verma Digital Archive</h1>
      <div style={{ marginTop: '10px' }}>
        <a href='#' style={{ marginRight: '20px' }}>
          About Roopji
        </a>
        <a href='#' style={{ marginRight: '20px' }}>
          About the Archive
        </a>
        <a href='#' style={{ marginRight: '20px' }}>
          Support the Project
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
