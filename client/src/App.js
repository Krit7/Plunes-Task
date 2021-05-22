import Routes from './routes/Routes'
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import AppBar from './Components/AppBar'
function App() {
  return (
    <div>
      <AppBar />
      <Router>
        <Switch>
          <Routes />
        </Switch>
      </Router>
    </div>

  );
}

export default App;
