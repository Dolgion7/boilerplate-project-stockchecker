const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { hashIp } = require('../utils'); // Utility function to anonymize IPs

// Function to fetch stock price
const fetchStockPrice = async (symbol) => {
  const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/stock/${symbol}`);
  const data = await response.json();
  return data;
};

// Endpoint to view stock price
router.get('/api/stock-prices/', async (req, res) => {
  const { stock, like } = req.query;

  if (!stock) {
    return res.status(400).send('Stock symbol is required');
  }

  const stockSymbols = Array.isArray(stock) ? stock : [stock];
  const stockData = await Promise.all(stockSymbols.map(symbol => fetchStockPrice(symbol)));

  if (stockSymbols.length === 2) {
    // Process data for two stocks
    const combinedData = {
      stockData: stockData.map(data => ({ ...data, price: data.price })),
      likes: [0, 0], // Placeholder for like counts
    };

    if (like) {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const hashedIp = hashIp(ip);
      // Handle like logic here (e.g., update database)
      // combinedData.likes[0] += 1; // Example increment
    }

    return res.json(combinedData);
  }

  // Process data for a single stock
  if (like) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const hashedIp = hashIp(ip);
    // Handle like logic here (e.g., update database)
    // stockData[0].likes += 1; // Example increment
  }

  res.json({
    stockData: stockData[0],
    likes: 0, // Placeholder for like count
  });
});

module.exports = router;

