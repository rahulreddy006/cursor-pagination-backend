const express = require('express');
const cors = require('cors');
const ProductController = require('./controllers/ProductController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());


app.get('/api/products', ProductController.list);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});