// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';

import { RoutesComponent } from './RoutesComponent';
import ContextProvider from './ContextProvider';

// import RenderOnAnonymous from './components/utils/RenderOnAnonymous';
// import RenderOnAuthenticated from 'components/utils/RenderOnAuthenticated';

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
