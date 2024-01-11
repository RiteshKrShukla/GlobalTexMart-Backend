const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB connection URI)
mongoose.connect('mongodb+srv://riteshshukla:riteshshukla@cluster0.fo6fefn.mongodb.net/GlobalTexMart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a simple Email schema
const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

const Email = mongoose.model('Email', emailSchema);

// Save email route
app.post('/api/saveEmail', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email cannot be empty.' });
        }

        // Check if the email already exists
        const existingEmail = await Email.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }

        // Save the email
        const newEmail = new Email({ email });
        await newEmail.save();

        return res.status(200).json({ success: true, message: 'Email saved successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Get all emails route
app.get('/api/getAllEmails', async (req, res) => {
    try {
        const allEmails = await Email.find({}, 'email');
        return res.status(200).json({ success: true, emails: allEmails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
