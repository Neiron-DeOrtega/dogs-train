import { useNavigate } from 'react-router-dom';
import { AdminRoute } from '../ProtectedRoute';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/login')
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <AdminRoute type="element">
            <button onClick={() => navigate('/admin')} className="default-btn default-btn--margin-right">
              Админ-панель
            </button>
          </AdminRoute>
          <button onClick={handleLogout} className="default-btn reverse">
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
