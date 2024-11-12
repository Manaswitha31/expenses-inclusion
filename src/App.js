import './App.css';
import './components/Home';
import Home from './components/Home';
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import AddExpense from './components/AddExpense/AddExpense';
import Charts from './components/Charts/Charts';
import Pdf from './components/Pdf/Pdf';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Dashboard></Dashboard>}></Route>
          <Route path='/home' element={<Home></Home>}></Route>
          <Route path='/header' element={<Header></Header>}></Route>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
          <Route path='/add-expense' element={<AddExpense></AddExpense>}></Route>
          <Route path='/charts' element={<Charts></Charts>}></Route>
          <Route path='/pdf' element={<Pdf></Pdf>}></Route>
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
