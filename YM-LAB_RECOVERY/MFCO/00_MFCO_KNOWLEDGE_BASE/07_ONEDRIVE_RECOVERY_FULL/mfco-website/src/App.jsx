import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Consumer from './pages/Consumer';
import Professional from './pages/Professional';
import Shop from './pages/Shop';
import Saas from './pages/Saas';
import Franchise from './pages/Franchise';
import Forum from './pages/Forum';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/consumer" element={<Consumer />} />
              <Route path="/professional" element={<Professional />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/saas" element={<Saas />} />
              <Route path="/franchise" element={<Franchise />} />
              <Route path="/forum" element={<Forum />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
