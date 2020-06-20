import spinner from './Spinner.gif';
import React from 'react';

const Spinner = () => {
  return (
    <img
      src={spinner}
      alt='Loading Spinner'
      style={{
        height: '100px',
        width: '100px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginTop: '-100px',
        marginLeft: '-100px',
      }}
    />
  );
};
export default Spinner;
