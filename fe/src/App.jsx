import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import Authentication from './Components/skeleton/skeleton.auth';
import './App.css';



function App() {
  return (
    <>
    <Router>
      <Routes>
      <Route path= "/homepage" element={<></>}/>
      <Route path= "/auth" element={<><Authentication/></>}/>
      <Route path= "/broadcasting_to_own_organisation" element={<></>}/>
      <Route path= "/dms_to_other_organisations" element={<></>}/>
      <Route path= "/explore" element={<></>}/>
      <Route path= "/feed" element={<></>}/>
      <Route path= "/post" element={<></>}/>
      <Route path= "/user:id" element={<></>}/>
      <Route path= "" element={<></>}/>
      <Route path= "" element={<></>}/>
      <Route path= "" element={<></>}/>
      <Route path= "" element={<></>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
