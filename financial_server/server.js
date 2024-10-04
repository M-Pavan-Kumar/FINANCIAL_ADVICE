const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGO_URI = "mongodb+srv://Pavan:kumar123@cluster0.pfirt1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Your MongoDB URI
mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const financialDataSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    income: { type: Number, required: true },
    savings: { type: Number, required: true },
    expenses: { type: Number, required: true },
});

const FinancialData = mongoose.model('FinancialData', financialDataSchema);

// POST /financial-data
app.post('/financial-data', async (req, res) => {
    const { userId, income, savings, expenses } = req.body;
    const financialData = new FinancialData({ userId, income, savings, expenses });

    try {
        await financialData.save();
        
        // Generate financial advice based on the input
        let advice = [];
        if (savings < 0.1 * income) {
            advice.push("Consider saving more!");
        }
        if (expenses > 0.8 * income) {
            advice.push("Cut down on discretionary spending.");
        }
        if (advice.length === 0) {
            advice.push("Your finances are in good shape!");
        }

        res.status(201).json({
            financialData,
            advice: advice.join(' ')
        });
    } catch (error) {
        console.error("Error saving financial data:", error);
        res.status(400).send(error);
    }
});

// GET /financial-data/:userId
app.get('/financial-data/:userId', async (req, res) => {
    const data = await FinancialData.findOne({ userId: req.params.userId });
    if (!data) return res.status(404).send('Data not found');
    res.send(data);
});

// Sample financial products
const products = ["Credit Card", "Personal Loan", "Savings Account"];

// GET /products
app.get('/products', (req, res) => {
    res.json(products);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
