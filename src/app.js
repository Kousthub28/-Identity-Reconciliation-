require('dotenv').config();
const express = require('express');
const identifyRoutes = require('./routes/identify');

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Identity Reconciliation Service is running.");
});

app.use('/identify', identifyRoutes); // ✅ Route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
