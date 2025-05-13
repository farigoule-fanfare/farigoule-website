import React, { useState, useEffect, useRef } from 'react';
import ContentPageLayout from "../../layout/ContentPageLayout";
import { axiosWrapper } from '@api/axiosUtils';
import './adminPanel.css';

export default function GestionFanfarons() {
  const [fanfarons, setFanfarons] = useState([]);
  const [form, setForm] = useState({ surnom: '', instrument: '', promo: '', bureau: '', mail: '', tel: '', description: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
      const res = await axiosWrapper({ method: 'get', url: 'admin/get' });
      if (res.success) {
        // selon votre wrapper, res.data est l’objet { success:true, data: […] }
        // le vrai tableau peut être dans res.data.data ou directement dans res.data
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];
        setFanfarons(arr);
      }
    };


  // // Soumission du formulaire (création ou mise à jour)
  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   const fd = new FormData();
  //   Object.entries(form).forEach(([key, value]) => {
  //     fd.append(key, value);
  //   });
  //   if (photoFile) {
  //     fd.append('photoFanfaron', photoFile);
  //   }

  //   const method = editingId ? 'put' : 'post';
  //   const url    = editingId ? `admin/${editingId}` : 'admin';

  //   const res = await axiosWrapper({ method, url, data: fd });
  //   if (res.success) {
  //     const arr = Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
  //     setFanfarons(arr);
  //   }
  // };

  

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    if (photoFile) fd.append('photoFanfaron', photoFile);
    const method = editingId ? 'put' : 'post';
    const url = editingId ? `admin/${editingId}` : 'admin';
    try{
    const fullUrl = `${process.env.REACT_APP_RESTAPI_SERVER_URI || ''}/route/${editingId ? `admin/${editingId}` : 'admin'}`.replace(/([^:]\/)\/+/g, "$1");

    const res = await axiosWrapper({
      method,
      url,
      data: fd,
      isMultipart: true
    });

      console.log('[SUBMIT RESULT]', res);
      if (res.success) {
      await fetchList();
      setForm({ surnom: '', instrument: '', promo: '', bureau: '', mail: '', tel: '', description: '' });
      setPhotoFile(null);
      setEditingId(null);
      }
    } catch (err) {
      console.error('[SUBMIT ERROR]', err);
    }

  };



  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce fanfaron ?')) return;
    const res = await axiosWrapper({ method: 'delete', url: `admin/${id}` });
    if (res.success) fetchList();
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = f => {
    setEditingId(f.id);
    setForm({
      surnom: f.surnom,
      instrument: f.instrument,
      promo: f.promo,
      bureau: f.bureau,
      mail: f.mail,
      tel: f.tel,
      description: f.description
    });
    setPhotoFile(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ContentPageLayout title="Gestion des fanfarons" hideSocialLinks>
      
        

        <div className="gestionFanfarons-form-wrapper" >
          <form onSubmit={handleSubmit} className="gestionFanfarons-form">
            {['surnom','instrument','promo','bureau','mail','tel'].map(field => (
              <div key={field} className="gestionFanfarons-form-group">
                <label htmlFor={field} className="gestionFanfarons-label">
                  {field === 'mail' ? 'Mail :' : field.charAt(0).toUpperCase() + field.slice(1) + ' :'}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === 'promo' ? 'number' : field === 'mail' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={handleChange}
                  required={['surnom','instrument','promo'].includes(field)}
                  className="gestionFanfarons-input"
                />
              </div>
            ))}

            <div className="gestionFanfarons-form-group">
              <label htmlFor="description" className="gestionFanfarons-label">Description :</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="gestionFanfarons-textarea"
              />
            </div>

            <div className="gestionFanfarons-form-group">
              <label htmlFor="photoFanfaron" className="gestionFanfarons-label">Photo (JPEG/PNG) :</label>
              <input
                id="photoFanfaron"
                type="file"
                accept="image/*"
                onChange={e => setPhotoFile(e.target.files[0])}
                className="gestionFanfarons-input"
              />
            </div>

            <div className="gestionFanfarons-buttons">
              <button type="submit" className="gestionFanfarons-button gestionFanfarons-button--submit">
                {editingId ? 'Mettre à jour' : 'Créer'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm({ surnom: '', instrument: '', promo: '', bureau: '', mail: '', tel: '', description: '' }); setPhotoFile(null); }}
                  className="gestionFanfarons-button gestionFanfarons-button--cancel"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      <div className="gestionFanfarons-container" ref={formRef}>
        <table className="gestionFanfarons-table">
          <thead>
            <tr>
              <th className="gestionFanfarons-th gestionFanfarons-th--id">ID</th>
              <th className="gestionFanfarons-th gestionFanfarons-th--surnom">Surnom</th>
              <th className="gestionFanfarons-th">Instrument</th>
              <th className="gestionFanfarons-th">Promo</th>
              <th className="gestionFanfarons-th">Bureau</th>
              <th className="gestionFanfarons-th">Téléphone</th>
              <th className="gestionFanfarons-th gestionFanfarons-th--photo">Aperçu photo</th>
              <th className="gestionFanfarons-th gestionFanfarons-th--actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fanfarons.map(f => (
              <tr key={f.id} className="gestionFanfarons-row">
                <td className="gestionFanfarons-td gestionFanfarons-td--id">{f.id}</td>
                <td className="gestionFanfarons-td gestionFanfarons-td--surnom">{f.surnom}</td>
                <td className="gestionFanfarons-td">{f.instrument}</td>
                <td className="gestionFanfarons-td">{f.promo}</td>
                <td className="gestionFanfarons-td">{f.bureau}</td>
                <td className="gestionFanfarons-td">{f.tel}</td>
                <td className="gestionFanfarons-td gestionFanfarons-td--photo">
                  {f.photoUrl ? (
                    <img
                      src={f.photoUrl}
                      alt={`Photo de ${f.surnom}`}
                      className="apercuFanfaron"
                    />
                  ) : (
                    <span className="gestionFanfarons-noPhoto">Aucune photo</span>
                  )}
                </td>
                <td className="gestionFanfarons-td gestionFanfarons-td--actions">
                  <button
                    onClick={() => handleEditClick(f)}
                    className="gestionFanfarons-button gestionFanfarons-button--edit"
                  >✎</button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="gestionFanfarons-button gestionFanfarons-button--delete"
                  >🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentPageLayout>
  );
}