import React from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import AdminCrudSection from '../components/AdminCrudSection';
import { useAuth } from '@features/auth';
import { axiosWrapper } from '@services/axiosUtils';

export default function GestionUtilisateurs() {
  const { currentUser } = useAuth();
  const selfId = currentUser ? String(currentUser.id) : null;
  const isMe = (u) => selfId && String(u.id) === selfId;

  /* -------- Helpers -------- */
  const sortFn = (a, b) => {
    const pa = Number(a.promo);
    const pb = Number(b.promo);
    if (pb !== pa) return pb - pa;
    return a.surnom.localeCompare(b.surnom, 'fr');
  };

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
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Nouveau mot de passe</title></head><body style="font-family:Arial;text-align:center;padding:2rem;">
        <h3>Mot de passe généré</h3>
        <pre style="font-size:1.3rem;margin:1rem 0;">${pass}</pre>
        <button id="copyBtn" style="padding:0.5rem 1rem;border:1px solid #444;border-radius:4px;cursor:pointer;">Copier</button>
        <script>document.getElementById('copyBtn').addEventListener('click',()=>{navigator.clipboard.writeText('${pass}').then(()=>alert('Mot de passe copié !'));});</script>
      </body></html>`);
    w.document.close();
  };

  /* -------- Actions -------- */
  const handleResetPassword = async (u) => {
    if (isMe(u)) return;
    if (!window.confirm(`Réinitialiser le mot de passe de ${u.surnom} ?`)) return;
    const newPass = generateRandomPassword();
    try {
      await axiosWrapper({ method: 'post', url: 'api/auth/admin-set-password', data: { userId: u.id, newPassword: newPass } });
      showPasswordPopup(newPass);
    } catch (err) {
      console.error('RESET PASSWORD ERROR', err);
    }
  };

  const handleToggleAdmin = async (u) => {
    if (isMe(u)) return;
    const currentRole = getHighestRole(u.roles);
    const confirmMsg = currentRole === 'admin'
      ? `Retirer le rôle admin de ${u.surnom} ?`
      : `Ajouter le rôle admin à ${u.surnom} ?`;
    if (!window.confirm(confirmMsg)) return;
    const action = currentRole === 'admin' ? 'removeAdminRole' : 'addAdminRole';
    try {
      await axiosWrapper({ method: 'post', url: `api/users/${u.id}/${action}` });
    } catch (err) {
      console.error('TOGGLE ADMIN ERROR', err);
    }
  };

  /* -------- Colonnes -------- */
  const tableCols = [
    { key: 'id',      header: 'ID' },
    { key: 'surnom',  header: 'Surnom' },
    { key: 'promo',   header: 'Promo' },
    { key: 'roles',   header: 'Rôle', render: (_, u) => getHighestRole(u.roles) },
  ];

  /* -------- Row actions -------- */
  const rowActions = (u, refetch) => {
    if (isMe(u)) return [];
    return [
      {
        icon: '🔑',
        label: 'Reset MP',
        className: 'contentPage-button--edit',
        onClick: () => handleResetPassword(u),
      },
      {
        icon: getHighestRole(u.roles) === 'admin' ? '⬇' : '⬆',
        label: getHighestRole(u.roles) === 'admin' ? 'Retirer admin' : 'Ajouter admin',
        className: 'contentPage-button--delete',
        onClick: async () => {
          await handleToggleAdmin(u);
          refetch();
        },
      },
    ];
  };

  return (
    <AdminPageLayout title="Gestion des utilisateurs">
      <AdminCrudSection
        listUrl="api/users/roles"
        tableCols={tableCols}
        formFields={null}
        sortFn={sortFn}
        itemsPerPage={10}
        rowActions={rowActions}
      />
    </AdminPageLayout>
  );
}
