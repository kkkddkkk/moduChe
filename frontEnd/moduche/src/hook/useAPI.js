import { useState, useCallback } from "react";

export function useApi(apiFunc) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const callApi = useCallback(
    async (...args) => {
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
    },
    [apiFunc] // apiFunc이 바뀌지 않으면 callApi도 재생성 안됨
  );

  return { callApi, loading, done, setDone };
}
