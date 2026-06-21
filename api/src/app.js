import express from 'express';
import routes from './routes/routes.js';
import categoriesRouter from './routes/category.routes.js';
import productsRouter from './routes/product.routes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running!' });
});

app.use('/notebooks', routes);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);

export default app;