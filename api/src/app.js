import express from 'express';
import routes from './routes/routes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running!' });
});

app.use('/notebooks', routes); 

export default app;