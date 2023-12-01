import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css';

interface StockData {
  'Meta Data': {
    '2. Symbol': string;
    '3. Last Refreshed': string;
  };
  'Time Series (5min)': {
    [timestamp: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
}

const StockDataComponent: React.FC = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<StockData>(
          'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo'
        );
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData();
  }, []);

  const itemsPerPage = 10; // You can adjust this value based on your preference

  const offset = currentPage * itemsPerPage;

  const currentItems = Object.entries(stockData?.['Time Series (5min)'] || {})
    .slice(offset, offset + itemsPerPage)
    .map(([timestamp, data]) => (
      <tr key={timestamp}>
        <td className="py-2 px-4 border-b">{timestamp}</td>
        <td className="py-2 px-4 border-b">{data['1. open']}</td>
        <td className="py-2 px-4 border-b">{data['2. high']}</td>
        <td className="py-2 px-4 border-b">{data['3. low']}</td>
        <td className="py-2 px-4 border-b">{data['4. close']}</td>
        <td className="py-2 px-4 border-b">{data['5. volume']}</td>
      </tr>
    ));

  const pageCount = Math.ceil(
    Object.keys(stockData?.['Time Series (5min)'] || {}).length / itemsPerPage
  );

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      {stockData ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Most recent 100 intraday </h2>
          <p>
            Symbol: <strong>{stockData['Meta Data']['2. Symbol']}</strong>
          </p>
          <p>
            Last Refreshed:{' '}
            <strong>{stockData['Meta Data']['3. Last Refreshed']}</strong>
          </p>
          <table className="min-w-full border-collapse border border-slate-500">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Timestamp</th>
                <th className="py-2 px-4 border-b text-left">Open</th>
                <th className="py-2 px-4 border-b text-left">High</th>
                <th className="py-2 px-4 border-b text-left">Low</th>
                <th className="py-2 px-4 border-b text-left">Close</th>
                <th className="py-2 px-4 border-b text-left">Volume</th>
              </tr>
            </thead>
            <tbody>{currentItems}</tbody>
          </table>
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'flex justify-center mt-4'}
            pageClassName={'mx-2 px-3 py-2 rounded-lg bg-gray-200 cursor-pointer'}
            activeClassName={'bg-blue-500 text-white'}
            previousClassName={'mx-2 px-3 py-2 rounded-lg bg-gray-200 cursor-pointer'}
            nextClassName={'mx-2 px-3 py-2 rounded-lg bg-gray-200 cursor-pointer'}
            disabledClassName={'text-gray-400 cursor-not-allowed'}
          />
        </div>
      ) : (
        <p>Loading stock data...</p>
      )}
    </div>
  );
};

export default StockDataComponent;
