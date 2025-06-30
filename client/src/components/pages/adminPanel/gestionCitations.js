import { useCrudList } from './helpers/useCrudList';
import AdminPageLayout from '../../layout/AdminPageLayout';
import AdminCrudSection   from './helpers/AdminCrudSection';

export default function GestionCitations() {
  // juste pour alimenter le <select> Fanfaron
  const { list: fanfarons } = useCrudList({ url: 'api/fanfarons', itemsPerPage: 500 });

  return (
    <AdminPageLayout title ="Gestion des citations">
      <AdminCrudSection
        title="Gestion des citations"
        listUrl="api/citations/ordered"
        saveUrl="api/citations"
        updateUrl={id => `api/citations/${id}`}
        deleteUrl={id => `api/citations/${id}`}
        tableCols={[
          { key: 'auteurCitation', header: 'Fanfaron' },
          { key: 'citation',       header: 'Citation' },
        ]}
        formFields={() => [
          {
            name: 'auteur_id',
            label: 'Fanfaron',
            type: 'select',
            required: true,
            options: [
              { value: '', label: 'Sélectionner' },
              ...fanfarons.map(f => ({ value: f.id, label: f.surnom })),
            ],
          },
          { name: 'citation', label: 'Citation', type: 'text', required: true },
        ]}
      />
    </AdminPageLayout>
  );
}
