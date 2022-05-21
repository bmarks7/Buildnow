import './App.scss';
import Navbar from './Navbar'
import Home from './Home'
import Find from './Find'
import Check from './Check'
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/find' component={Find}/>
          <Route exact path='/check' component={Check}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
