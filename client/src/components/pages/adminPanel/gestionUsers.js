import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import { axiosWrapper } from '@api/axiosUtils';
import { useAuth } from '../../../context/AuthContext';
import Pagination from '../../utils/Pagination';

export default function GestionUtilisateurs() {
  const ITEMS_PER_PAGE = 10;
  const { currentUser } = useAuth();
  const selfId = currentUser?.id ? String(currentUser.id) : null;

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  /* ------------ FETCH USERS ------------- */
  const fetchUsers = useCallback ( async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'api/fanfarons/annuaire/' });
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : [];
        setUsers(list);
        const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
        if (page > totalPages) setPage(1);
      }
    } catch (err) {
      console.error('FETCH USERS ERROR', err);
    }
  },[ITEMS_PER_PAGE, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ------------ HELPERS ------------- */
  const isMe = (u) => selfId && String(u.id) === selfId;

  const sorted = useMemo(() => {
    return [...users].sort((a, b) => {
      const pa = Number(a.promo), pb = Number(b.promo);
      return pb - pa || a.surnom.localeCompare(b.surnom, 'fr');
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
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#()_+[]{}|;:,.<>?';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const showPasswordPopup = (pass) => {
    const w = window.open('', '', 'width=420,height=220');
    if (!w) return; // popup blocked
    w.document.write(`<!DOCTYPE html><html><head><title>Nouveau mot de passe</title></head><body style="font-family:Arial;text-align:center;padding:2rem;">
        <h3>Mot de passe généré</h3>
        <pre style="font-size:1.3rem;margin:1rem 0;">${pass}</pre>
        <button id="copyBtn" style="padding:0.5rem 1rem;border:1px solid #444;border-radius:4px;cursor:pointer;">Copier</button>
        <script>
          document.getElementById('copyBtn').addEventListener('click', () => {
            navigator.clipboard.writeText('${pass}').then(()=>alert('Mot de passe copié !')); 
          });
        </script>
      </body></html>`);
    w.document.close();
  };

  /* ------------ ACTIONS ------------- */
  const handleResetPassword = async (u) => {
    if (isMe(u)) return;
    if (!window.confirm(`Réinitialiser le mot de passe de ${u.surnom} ?`)) return;
    const newPass = generateRandomPassword();
    try {
      await axiosWrapper({ method: 'post', url: `api/users/${u.id}/setPassword`, data: { password: newPass } });
      showPasswordPopup(newPass);
    } catch (err) {
      console.error('RESET PASSWORD ERROR', err);
    }
  };

  const handleToggleAdmin = async (u) => {
    if (isMe(u)) return;
    const currentRole = getHighestRole(u.roles);
    const confirmMsg = currentRole === 'admin' ? `Retirer le rôle admin de ${u.surnom} ?` : `Ajouter le rôle admin à ${u.surnom} ?`;
    if (!window.confirm(confirmMsg)) return;
    const action = currentRole === 'admin' ? 'removeAdminRole' : 'addAdminRole';
    try {
      await axiosWrapper({ method: 'post', url: `api/users/${u.id}/${action}` });
      fetchUsers();
    } catch (err) {
      console.error('TOGGLE ADMIN ERROR', err);
    }
  };

  /* ------------ RENDER ------------- */
  return (
    <AdminPageLayout title="Gestion des utilisateurs">
      <section className="adminPanel-section">
        <table className="adminPanel-table">
          <thead>
            <tr><th>ID</th><th>Surnom</th><th>Promo</th><th>Rôle</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {paginated.map((u, idx) => (
              <tr key={u.id ?? idx}>
                <td>{u.id}</td>
                <td>{u.surnom}</td>
                <td>{u.promo}</td>
                <td>{getHighestRole(u.roles)}</td>
                <td>
                  {isMe(u) ? (
                    <span>Moi</span>
                  ) : (
                    <div className='adminPanel-buttons'>
                      <button className="adminPanel-button" type="edit" onClick={() => handleResetPassword(u)}>
                        Reset mot de passe
                      </button>
                      <button className="adminPanel-button" type="delete" onClick={() => handleToggleAdmin(u)}>
                        {getHighestRole(u.roles) === 'admin' ? 'Retirer admin' : 'Ajouter admin'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
        currentPage={page}
        totalPages={ Math.ceil(sorted.length / ITEMS_PER_PAGE)}
        onPageChange={setPage}
      />
      </section>
      
    </AdminPageLayout>
  );
}
