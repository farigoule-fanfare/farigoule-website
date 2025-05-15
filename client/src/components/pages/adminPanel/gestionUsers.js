import React, { useState, useEffect, useMemo } from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
import { useAuth } from '../../../context/AuthContext';
//import './gestionFanfaron.css';

export default function GestionUtilisateurs() {
  const ITEMS_PER_PAGE = 10;
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ show: false, password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'route/admin/admin/fanfarons' });
      if (res.success) {
        setUsers(Array.isArray(res.data) ? res.data : []);
        const totalPages = Math.ceil((Array.isArray(res.data) ? res.data.length : 0) / ITEMS_PER_PAGE);
        if (page > totalPages) setPage(1);
      }
    } catch (err) {
      console.error('[FETCH USERS ERROR]', err);
    }
  };

  const sorted = useMemo(() => {
    return [...users].sort((a, b) => {
      const pa = Number(a.promo);
      const pb = Number(b.promo);
      if (pb !== pa) return pb - pa;
      return a.surnom.localeCompare(b.surnom, 'fr');
    });
  }, [users]);

  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getHighestRole = (roles) => {
    try {
      const arr = Array.isArray(roles) ? roles : JSON.parse(roles);
      return arr.includes('admin') ? 'admin' : 'fanfaron';
    } catch {
      return 'fanfaron';
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleResetPassword = async (u) => {
    if (!window.confirm(`Réinitialiser le mot de passe de ${u.surnom} ?`)) return;
    const newPass = generateRandomPassword();
    try {
      await axiosWrapper({
        method: 'post',
        url: `route/admin/admin/fanfarons/${u.id}/setPassword`,
        data: { password: newPass }
      });
      setModal({ show: true, password: newPass });
    } catch (err) {
      console.error('[RESET PASSWORD ERROR]', err);
    }
  };

  const handleToggleAdmin = async (u) => {
    const isAdmin = getHighestRole(u.roles) === 'admin';
    if (isAdmin && u.id === user.id) return;
    const action = isAdmin ? 'removeAdminRole' : 'addAdminRole';
    try {
      await axiosWrapper({
        method: 'post',
        url: `route/admin/admin/fanfarons/${u.id}/${action}`
      });
      fetchUsers();
    } catch (err) {
      console.error('[TOGGLE ADMIN ERROR]', err);
    }
  };

  const closeModal = () => setModal({ show: false, password: '' });
  const copyToClipboard = () => {
    navigator.clipboard.writeText(modal.password);
  };

  return (
    <AdminPageLayout title="Gestion des utilisateurs">
      <div className="adminPanel-section">
        <table className="adminPanel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Surnom</th>
              <th>Promo</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.surnom}</td>
                <td>{u.promo}</td>
                <td>{getHighestRole(u.roles)}</td>
                <td>
                  <button
                    className="adminPanel-button"
                    onClick={() => handleResetPassword(u)}
                  >
                    Reset mot de passe
                  </button>
                  <button
                    className="adminPanel-button"
                    onClick={() => handleToggleAdmin(u)}
                    disabled={u.id === user.id && getHighestRole(u.roles) === 'admin'}
                  >
                    {getHighestRole(u.roles) === 'admin' ? 'Retirer admin' : 'Ajouter admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: Math.ceil(sorted.length / ITEMS_PER_PAGE) }, (_, i) => (
            <button
              key={i + 1}
              disabled={page === i + 1}
              onClick={() => setPage(i + 1)}
              className="adminPanel-button"
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {modal.show && (
        <div className="adminPanel-modalOverlay">
          <div className="adminPanel-modal">
            <p>
              Nouveau mot de passe généré : <code>{modal.password}</code>
            </p>
            <div className="adminPanel-buttons">
              <button
                className="adminPanel-button"
                onClick={copyToClipboard}
              >
                Copier
              </button>
              <button
                className="adminPanel-button"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
