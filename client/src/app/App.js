import { BrowserRouter } from 'react-router-dom';

import './App.css';

import { RoutesComponent } from './RoutesComponent';
import { AuthProvider } from '@context/AuthContext';

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
