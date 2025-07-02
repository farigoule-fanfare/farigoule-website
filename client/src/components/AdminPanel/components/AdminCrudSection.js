import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';
import { axiosWrapper } from '@services/axiosUtils';
import { useCrudList } from '@hooks/useCrudList';
import CrudTable from './CrudTable';
import CrudForm from './CrudForm';

/**
 * AdminCrudSection – bloc réutilisable liste + pagination + (optionnel) formulaire.
 */
export default function AdminCrudSection({
  /* Requis */
  listUrl,
  tableCols,
  /* CRUD : save / update / delete uniquement si formulaire ou actions */
  saveUrl,
  updateUrl,
  deleteUrl,
  /* Options */
  title,
  formFields,
  sortFn,
  itemsPerPage = 10,
  rowActions,
  prepareData,
  canDelete, // (row) => bool
}) {
  /* ---------------- Liste + pagination ---------------- */
  const { current: rows, page, totalPages, setPage, refetch } = useCrudList({
    url: listUrl,
    sortFn,
    itemsPerPage,
  });

  /* ---------------- Formulaire (facultatif) ---------------- */
  const emptyForm = useMemo(() => {
    if (!formFields) return {};
    const fieldsArr = typeof formFields === 'function' ? formFields(rows) : formFields;
    return Object.fromEntries(fieldsArr.map((f) => [f.name, '']));
  }, [formFields, rows]);

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!saveUrl || !updateUrl) return;

    let payload = form;
    let multipart = false;
    if (prepareData) {
      const res = prepareData(form) || {};
      payload = res.data ?? form;
      multipart = Boolean(res.isMultipart);
    }

    const method = editId ? 'put' : 'post';
    const url = editId ? updateUrl(editId) : saveUrl;

    await axiosWrapper({ method, url, data: payload, isMultipart: multipart });

    setForm(emptyForm);
    setEditId(null);
    document.querySelector('input[type="file"]')?.setAttribute('value', '');
    refetch();
  };

   /* ---------------- Actions par défaut ---------------- */
  const defaultRowActions = (row) => {
    const acts = [];

    // Edit
    if (formFields) {
      acts.push({
        icon: '✎',
        label: '',
        className: 'contentPage-button--edit',
        onClick: () => {
          setForm({ ...row });
          if (form.photoFanfaron !== undefined) form.photoFanfaron = '';
          setEditId(row.id);
        },
      });
    }

    // Delete
    const allowDel = typeof canDelete === 'function' ? canDelete(row) : true;
    if (allowDel && deleteUrl) {
      acts.push({
        icon: '🗑',
        label: '',
        className: 'contentPage-button--delete',
        onClick: async () => {
          if (window.confirm('Supprimer ?')) {
            await axiosWrapper({ method: 'delete', url: deleteUrl(row.id) });
            refetch();
          }
        },
      });
    }

    return acts;
  };

  const actions = rowActions || defaultRowActions;

  /* ---------------- Rendu ---------------- */
  return (
    <section className="adminPanel-section">
      {title && <h2>{title}</h2>}

      <CrudTable
        rows={rows}
        cols={tableCols}
        rowActions={(r) =>(actions(r, refetch) || []).map((a) => ({...a, className: `contentPage-button ${a.className || ''}`,}))
        }
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {formFields && (
        <CrudForm
          fields={typeof formFields === 'function' ? formFields(rows) : formFields}
          values={form}
          onChange={setForm}
          onSubmit={handleSubmit}
        >
          <div className="contentPage-buttons">
            <button
              className="contentPage-button contentPage-button--submit"
              type="submit"
            >
              {editId ? 'Mettre à jour' : 'Envoyer'}
            </button>
            {editId && (
              <button
                className="contentPage-button contentPage-button--cancel"
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setEditId(null);
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </CrudForm>
      )}
    </section>
  );
}
