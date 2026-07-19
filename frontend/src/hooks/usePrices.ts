import { useEffect, useState } from "react";

import { getPrices } from "../api/priceApi";

import type { Price } from "../types/price";

export function usePrices() {
  const [prices, setPrices] = useState<Price[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPrices();

        console.log(data)
        setPrices(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    prices,
    loading,
  };
}
