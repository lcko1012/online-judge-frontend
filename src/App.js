import { BrowserRouter as Router } from "react-router-dom";
import Routes from './routes/index'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes />
    </Router>
  );
}

export default App;
