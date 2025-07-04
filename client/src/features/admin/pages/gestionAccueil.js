import React from 'react';
import AdminPageLayout from '../layouts/AdminPageLayout';
import AdminCrudSection from '../components/crud/AdminCrudSection';

export default function GestionAccueil() {
  return (
    <AdminPageLayout title="Gestion de la page d'accueil">
      {/* -------- Diaporama -------- */}
      <AdminCrudSection
        title="Diaporama"
        listUrl="api/diapos/ordered"
        saveUrl="api/diapos"
        updateUrl={id => `api/diapos/${id}`}
        deleteUrl={id => `api/diapos/${id}`}
        itemsPerPage={5}    
        tableCols={[
          {
            key: 'imageUrl',
            header: 'Aperçu',
            render: (v, d) => (
              <img src={d.imageUrl} alt={d.description} className="apercuAdminDiapo" />
            ),
          },
          { key: 'description', header: 'Texte' },
        ]}
        formFields={[
          { name: 'file', label: 'Image', type: 'file', required: true },
          { name: 'description', label: 'Texte', type: 'text', required: true },
        ]}
        prepareData={(form) => {
          const fd = new FormData();
          fd.append('description', form.description);
          if (form.file) fd.append('file', form.file);
          return { data: fd, isMultipart: true };
        }}
      />

      {/* -------- Prochaines dates -------- */}
      <AdminCrudSection
        title="Prochaines dates"
        listUrl="api/contrats"
        saveUrl="api/contrats"
        updateUrl={id => `api/contrats/${id}`}
        deleteUrl={id => `api/contrats/${id}`}
        tableCols={[
          {
            key: 'date',
            header: 'Date',
            render: (v) =>
              new Date(v).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }),
          },
          { key: 'lieu', header: 'Lieu' },
          { key: 'description', header: 'Description' },
        ]}
        formFields={[
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'lieu', label: 'Lieu', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'text', required: true },
        ]}
      />
    </AdminPageLayout>
  );
}
