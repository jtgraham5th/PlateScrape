import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./containers/home"
import './App.css';

function App() {
  return (
      <Router>
          <Route exact path="/" component={Home} />
          <Switch>
            {/* <Route exact path="/Bars" component={LocalBars} />
            <Route path="/Bartender" component={Bartender} />
            <Route path="/summary" component={OrderSummary} />
            <Route path="/checkin" component={Checkin} />
            <Route path="/orderDrinks" component={OrderDrinks} /> */}
          </Switch>
        </Router>
    );
  }

export default App;
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
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
