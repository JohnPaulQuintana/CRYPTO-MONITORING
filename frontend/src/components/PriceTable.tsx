import { usePrices } from "../hooks/usePrices";

export default function PriceTable() {
  const { prices, loading } = usePrices();

  console.log(prices)
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Crypto Monitor</h1>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Brand</th>

            <th>Crypto</th>

            <th>Currency</th>

            <th>USD</th>

            <th>Binance</th>

            <th>Rate</th>

            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {prices.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.brand}</td>

              <td>{item.crypto}</td>

              <td>{item.currency}</td>

              <td>{item.usd_price}</td>

              <td>{item.binance_rate}</td>

              <td>{item.exchange_rate}</td>

              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
