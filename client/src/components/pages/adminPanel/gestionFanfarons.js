import React from 'react';
import AdminPageLayout from '../../layout/AdminPageLayout';
import AdminCrudSection from './helpers/AdminCrudSection';
import { useAuth } from '../../../context/AuthContext';

export default function GestionFanfarons() {
  const { currentUser } = useAuth();
  const selfId = currentUser ? String(currentUser.id) : null;
  const isMe = (row) => selfId && String(row.id) === selfId;

  /* ---- Tri promo desc puis surnom ---- */
  const sortFn = (a, b) => {
    const pa = Number(a.promo);
    const pb = Number(b.promo);
    if (pb !== pa) return pb - pa;
    return a.surnom.localeCompare(b.surnom, 'fr');
  };

  /* ---- Colonnes tableau ---- */
  const tableCols = [
    { key: 'surnom',     header: 'Surnom' },
    { key: 'nom',        header: 'Nom' },
    { key: 'prenom',     header: 'Prénom' },
    { key: 'instrument', header: 'Instrument' },
    { key: 'promo',      header: 'Promo' },
    { key: 'bureau',     header: 'Bureau' },
    { key: 'tel',        header: 'Téléphone' },
    { key: 'email',      header: 'Email' },
    {
      key: 'photoUrl',
      header: 'Photo',
      render: (v, row) =>
        v ? (
          <img src={v} alt={row.surnom} className="apercuDiapo" />
        ) : (
          <span className="gestionFanfarons-noPhoto">Aucune photo</span>
        ),
    },
  ];

  /* ---- Schéma formulaire ---- */
  const formFields = [
    { name: 'surnom',     label: 'Surnom',     type: 'text',     required: true },
    { name: 'nom',        label: 'Nom',        type: 'text' },
    { name: 'prenom',     label: 'Prénom',     type: 'text' },
    { name: 'instrument', label: 'Instrument', type: 'text',     required: true },
    { name: 'promo',      label: 'Promo',      type: 'number',   required: true },
    { name: 'bureau',     label: 'Bureau',     type: 'text' },
    { name: 'email',      label: 'Mail',       type: 'mail' },
    { name: 'tel',        label: 'Téléphone',  type: 'text' },
    { name: 'description',label: 'Description',type: 'textarea' },
    { name: 'photoFanfaron', label: 'Photo',   type: 'file' },
  ];

  /* ---- Payload FormData ---- */
  const prepareData = (form) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'photoFanfaron') {
        if (v) fd.append('photoFanfaron', v);
      } else {
        fd.append(k, v);
      }
    });
    return { data: fd, isMultipart: true };
  };

  return (
    <AdminPageLayout title="Gestion des fanfarons">
      <AdminCrudSection 
        title="Les fanfarons"
        listUrl="api/fanfarons/annuaire/"
        saveUrl="api/fanfarons"
        updateUrl={(id) => `api/fanfarons/${id}`}
        deleteUrl={(id) => `api/fanfarons/${id}`}
        tableCols={tableCols}
        formFields={formFields}
        sortFn={sortFn}
        itemsPerPage={10}
        prepareData={prepareData}
        canDelete={(row) => !isMe(row)}
      />
    </AdminPageLayout>
  );
}
