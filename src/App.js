import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Details from './components/Details';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/detail/:movieId' element={<Details/>}/>
    </Routes>
    </BrowserRouter>
  //   <div className="App">
  //  <Dashboard/>
  //   </div>
  );
}

export default App;
