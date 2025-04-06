import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useFetch = (url, options = {}, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const result = await response.json();

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, fetchData };
};

export default useFetch;
