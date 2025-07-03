import { useState, useEffect, useCallback, useMemo } from 'react';
import { axiosWrapper } from '@services/axiosUtils';

/**
 * Gestion générique d’une liste + pagination.
 * @param {string}  url            – endpoint
 * @param {Function} [sortFn]      – fonction de tri (optionnel)
 * @param {number}  [itemsPerPage] – taille page (défaut 10)
 */
export function useCrudList({ url, sortFn, itemsPerPage = 10 }) {
  const [list, setList]   = useState([]);
  const [page, setPage]   = useState(1);

  const refetch = useCallback(async () => {
    const res  = await axiosWrapper({ method:'get', url });
    const data = Array.isArray(res.data) ? res.data : [];
    setList(sortFn ? [...data].sort(sortFn) : data);
    // reset page si dépasse
    if (page > Math.ceil(data.length / itemsPerPage)) setPage(1);
  }, [url, sortFn, page, itemsPerPage]);

  useEffect(() => { refetch(); }, [refetch]);

  const totalPages = Math.ceil(list.length / itemsPerPage);
  const current    = useMemo(
    () => list.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [list, page, itemsPerPage]
  );

  return { list, current, page, totalPages, setPage, refetch };
}
