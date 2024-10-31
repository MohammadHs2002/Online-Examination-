import './App.css';
import LandingPage from './LandingPage';
import {BrowserRouter,Routes,Route} from 'react-router-dom'; 
import Login from './Login';
import NoPage from './NoPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './UserContext';
import AdminMain from './AdminSide/AdminMain';
import StudentMain from './StudentSide/StudentMain';
import PrivateRoutesAdmin from './PrivateRoutes';


function App() {
    return ( 
        <UserProvider>
        <ToastContainer/>
        <BrowserRouter>
            <Routes>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="admin" element={<PrivateRoutesAdmin><AdminMain /></PrivateRoutesAdmin>} />
            <Route path="student" element={<StudentMain />} />
            <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
        </UserProvider>
    );
}

export default App;