import React, { useState, useEffect } from 'react';
import { axiosWrapper } from '@api/axiosUtils';
export default function GestionFanfarons() {
  
    // 🍺 États
  const [fanfarons, setFanfarons] = useState([]);
  const [form, setForm] = useState({
    surnom: '',
    instrument: '',
    promo: '',
    bureau: '',
    mail: '',
    tel: '',
    description: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // ⚙️ Récupère la liste au montage et après chaque écriture
  useEffect(() => {
    fetchList();
  }, []);

    const fetchList = async () => {
  const fullUrl = `${process.env.REACT_APP_RESTAPI_SERVER_URI}/${'admin'}`;
  console.log('➡️ URL appelée :', fullUrl);
  const res = await axiosWrapper({ method: 'get', url: 'admin' });
  console.log('❗ fetchList res =', res);
  // …
};


  // ✏️ Soumission du formulaire (création ou mise à jour)
  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, value);
    });
    if (photoFile) {
      fd.append('photoFanfaron', photoFile);
    }

    const method = editingId ? 'put' : 'post';
    const url    = editingId ? `admin/${editingId}` : 'admin';

    const res = await axiosWrapper({ method, url, data: fd });
    if (res.success) {
      await fetchList();
      setForm({
        surnom: '',
        instrument: '',
        promo: '',
        bureau: '',
        mail: '',
        tel: '',
        description: ''
      });
      setPhotoFile(null);
      setEditingId(null);
    }
  };

  // 🗑 Suppression d’un fanfaron
  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce fanfaron ?')) return;
    const res = await axiosWrapper({ method: 'delete', url: `admin/${id}` });
    if (res.success) fetchList();
  };

  // 🔄 Mise à jour de l’état du formulaire
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Gestion des fanfarons</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <label>Surnom:</label>
          <input
            name="surnom"
            value={form.surnom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Instrument:</label>
          <input
            name="instrument"
            value={form.instrument}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Promo:</label>
          <input
            name="promo"
            type="number"
            value={form.promo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Bureau:</label>
          <input
            name="bureau"
            value={form.bureau}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mail:</label>
          <input
            name="mail"
            type="email"
            value={form.mail}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Téléphone:</label>
          <input
            name="tel"
            value={form.tel}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Photo (JPEG/PNG):</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setPhotoFile(e.target.files[0])}
          />
        </div>
        <button type="submit">
          {editingId ? 'Mettre à jour' : 'Créer'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                surnom: '',
                instrument: '',
                promo: '',
                bureau: '',
                mail: '',
                tel: '',
                description: ''
              });
              setPhotoFile(null);
            }}
            style={{ marginLeft: '1rem' }}
          >
            Annuler
          </button>
        )}
      </form>

      <table border="1" cellPadding="4" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Surnom</th>
            <th>Instrument</th>
            <th>Promo</th>
            <th>Bureau</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fanfarons.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.surnom}</td>
              <td>{f.instrument}</td>
              <td>{f.promo}</td>
              <td>{f.bureau}</td>
              <td>
                <button
                  onClick={() => {
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
                  }}
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
