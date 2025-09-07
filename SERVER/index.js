const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Models
const accounts = require('./models/UsersModel');
const Material = require('./models/MaterialModel');

// Constants
const port = process.env.port || 5000;
const URI = process.env.uri;
const secret = process.env.JWT_SECRET || 'your_default_secret_key';

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error:", err));

// Root route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// ============ AUTH ROUTES ============

// Sign Up
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new accounts({ name, email, password });
    await newUser.save();
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Sign In
app.post('/signin', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await accounts.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password', status: 401 });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      secret,
      { expiresIn: '1h' }
    );
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name
    };
    res.status(200).json({
      message: 'Login successful',
      status: 200,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error   );
    res.status(500).json({ message: 'Error logging in', status: 500 });
  }
});

// Verify Token
app.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided', status: false });
    }
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token expired or invalid', status: false });
      }
      res.json({ message: "Authenticated user", status: true, user: decoded });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ MULTER CONFIGURATION ============

app.use('/uploads', express.static('uploads')); // To serve uploaded files

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'image/jpeg',
    'image/png',
    'video/mp4',
    'video/mpeg',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

// ============ MATERIAL ROUTES ============

// Upload Material
app.post('/upload-material', upload.single('file'), async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);

  const { title, subject, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Verify user authentication
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const fileUrl = `/uploads/${req.file.filename}`;

    const newMaterial = new Material({
      title,
      subject,
      description,
      fileUrl,
      userId: decoded.id
    });
    await newMaterial.save();
    res.status(200).json({
      message: 'Material uploaded successfully!',
      file: fileUrl,
      title,
      subject,
      description,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error uploading material' });
  }
});

// Get All Materials
app.get('/materials', async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadDate: -1 });
    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching materials' });
  }
});

// Dashboard route
app.get('/dashboard', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token expired or invalid' });
      }

      try {
        const userId = decoded.id;
        
        // Get user info
        const user = await accounts.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Get user's materials
        const userMaterials = await Material.find({ userId }).sort({ uploadDate: -1 });
        
        // Calculate statistics
        const totalMaterials = userMaterials.length;
        
        // Calculate materials uploaded this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const materialsThisWeek = userMaterials.filter(material => 
          new Date(material.uploadDate) >= oneWeekAgo
        ).length;

        // Get all materials for total downloads (assuming each view is a download)
        const allMaterials = await Material.find();
        const totalDownloads = allMaterials.length; // This could be enhanced with actual download tracking

        // Get active students (users who have uploaded materials in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = await Material.distinct('userId', {
          uploadDate: { $gte: thirtyDaysAgo }
        });
        const activeStudents = activeUsers.length;

        const dashboardData = {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          statistics: {
            materialsUploaded: totalMaterials,
            newThisWeek: materialsThisWeek,
            totalDownloads: totalDownloads,
            activeStudents: activeStudents
          },
          materials: userMaterials
        };

        res.status(200).json(dashboardData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching dashboard' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ START SERVER ============
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
