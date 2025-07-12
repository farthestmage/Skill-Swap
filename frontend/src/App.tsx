import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { BrowseSkillsPage } from './pages/BrowseSkillsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SwapRequestsPage } from './pages/SwapRequestsPage';
import { SkillDetailsPage } from './pages/SkillDetailsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowseSkillsPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/swaps" element={<SwapRequestsPage />} />
            <Route path="/skill/:id" element={<SkillDetailsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;