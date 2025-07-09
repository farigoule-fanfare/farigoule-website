import React, { useState, useEffect, useCallback } from 'react';
import { ContentPageLayout } from '@shell';
import { axiosWrapper } from '@services/axiosUtils';
import { Pagination } from '@shared';

export default function Annuaire() {
  const [fanfarons, setFanfarons] = useState([]);
  const [page, setPage] = useState(1);

  const fetchList = useCallback(async () => {
    try {
      const res = await axiosWrapper({ method: 'get', url: 'api/fanfarons/annuaire' });
      setFanfarons(res.data);
    } catch (err) {
      console.error('[FETCH ERROR]', err);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const sorted = [...fanfarons].sort((a, b) => {
    const pa = Number(a.promo),
      pb = Number(b.promo);
    if (pb !== pa) return pb - pa;
    return a.surnom.localeCompare(b.surnom, 'fr');
  });

  const promos = [...new Set(sorted.map((f) => Number(f.promo)))].sort(
    (a, b) => b - a
  );
  const totalPages = promos.length;

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const currentPromo = promos[page - 1];
  const current = sorted.filter((f) => Number(f.promo) === currentPromo);
  const capitalize = (str) =>
    typeof str === 'string' && str.length
      ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      : '';

  return (
    <ContentPageLayout title="Annuaire des fanfarons">
      <div className="container-annuaire-page">
        {/* Titre de la promo courante */}
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Promo {currentPromo}
        </h2>
        
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        
        <table className="adminPanel-table">
          <thead>
            <tr>
              <th>Surnom</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Instrument</th>
              <th>Téléphone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {current.map((f) => (
              <tr key={f.id}>
                <td>{f.surnom}</td>
                <td>{f.prenom}</td>
                <td>{f.nom}</td>
                <td>{capitalize(f.instrument)}</td>
                <td>{f.tel}</td>
                <td>{f.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentPageLayout>
  );
}
