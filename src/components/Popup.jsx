import React from 'react';
import App from '../App';

const Popup = () => {
  // This component can be expanded to manage more complex popup states
  return <App getProductInfo={window.getProductInfo} />;
};

export default Popup;
