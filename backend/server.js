import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'RESTful API SIM-EKSKUL SMKN 5 Telkom Banda Aceh aktif'
  });
});

app.listen(PORT, () => {
  console.log(`Server Back-End berjalan di http://localhost:${PORT}`);
});
