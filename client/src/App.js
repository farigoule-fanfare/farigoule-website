import { BrowserRouter } from 'react-router-dom';

import './App.css';

import { RoutesComponent } from './RoutesComponent';
import { AuthProvider } from "@features/auth";

export function App(props) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesComponent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
