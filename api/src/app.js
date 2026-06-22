import express from 'express';
import notebookRoutes from './routes/routes.js';
import categoryRoutes from './routes/category.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();
app.use(express.json());
app.use('/uploads', express.static('/data/uploads'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running!' });
});

app.use('/notebooks', notebookRoutes);
app.use('/categories', categoryRoutes);
app.use('/uploads', uploadRoutes);

export default app;
