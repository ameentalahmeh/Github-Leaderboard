import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

// Import Home Page 
import HomePage from './Views/HomePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={HomePage} />
      </Router>
    </div>
  );
}

export default App;
