import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';

import { RoutesComponent } from './RoutesComponent';
import ContextProvider from '../ContextProvider';

export function App(props) {
  return (
    <BrowserRouter>
      <ContextProvider>
        <RoutesComponent />
      </ContextProvider>
    </BrowserRouter>
  )
}

export default App;
