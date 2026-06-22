import express from 'express';
import notebookRoutes from './routes/routes.js';
import categoryRoutes from './routes/category.routes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running!' });
});

app.use('/notebooks', notebookRoutes);
app.use('/categories', categoryRoutes);

export default app;
