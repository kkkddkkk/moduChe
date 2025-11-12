import { useState } from "react";

export function useApi(apiFunc) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const callApi = async (...args) => {
    setLoading(true);
    try {
      const res = await apiFunc(...args);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
      setDone(true);
    }
  };

  return { callApi, loading, done, setDone };
}