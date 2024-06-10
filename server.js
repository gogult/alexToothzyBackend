const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://gogulthanika:C9iG2iLTfyA17YwJ@cluster0.xo6ihiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define a simple schema and model
// Define a Mongoose schema for your data
const itemSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  phone: String,
  date: Date
});

// Define a Mongoose model based on the schema
const Item = mongoose.model('Item', itemSchema);


// CRUD Endpoints
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/items', async (req, res) => {
  console.log('Request Body:', req.body);

  const { fname, lname, email, phone, date } = req.body;

  try {
    const newItem = new Item({
      fname,
      lname,
      email,
      phone,
      date: new Date(date) // Convert string date to Date object if needed
    });

    console.log('New Item:', newItem);

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
