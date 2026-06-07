import { useCallback, useEffect, useState } from 'react';

import { getBills } from 'services/billService';

export default function useBills(filters) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBills = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getBills(filters);
      setBills(Array.isArray(data) ? data : data?.bills || []);
    } catch (err) {
      setBills([]);
      setError(err.response?.data?.message || 'Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  return {
    bills,
    loading,
    error,
    reload: loadBills
  };
}
