import { useState } from "react";

export function useApi(apiFunc) {
  const [loading, setLoading] = useState(false);

  const callApi = async (...args) => {
    setLoading(true);
    try {
      const res = await apiFunc(...args);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading };
}