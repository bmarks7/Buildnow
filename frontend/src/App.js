import './App.scss';
import Navbar from './Navbar'
import Home from './Home'
import Find from './Find'
import Updates from './Updates'
import FindVideo from './FindVideo'
import Repo from './Repo'
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/find' component={Find}/>
          <Route exact path='/findvideo' component={FindVideo}/>
          <Route exact path='/updates' component={Updates}/>
          <Route exact path='/repo' component={Repo}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
