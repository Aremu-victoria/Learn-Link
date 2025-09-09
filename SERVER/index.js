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
const Notification = require('./models/NotificationModel');

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
  const { name, email, password, role } = req.body;
  try {
    const existing = await accounts.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = new accounts({ name, email, password: hashedPassword });
    const newUser = new accounts({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Sign In
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await accounts.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password', status: 401 });
    }
    // Compare password (supports both hashed and legacy plaintext once)
    const isMatch = await bcrypt.compare(password, user.password) || password === user.password;
    if (!isMatch) {
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
        ,
        role: user.role
      };
    res.status(200).json({
      message: 'Login successful',
      status: 200,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // To serve uploaded files reliably

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
    // Create upload-success notification for the user
    try {
      await Notification.create({
        userId: decoded.id,
        title: 'Upload successful',
        message: `Your material "${title}" was uploaded successfully`,
        type: 'upload_success'
      });
    } catch (notifyErr) {
      console.error('Failed to create notification:', notifyErr);
    }
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
        let materials = [];
        let statistics = {};
        if (user.role === 'teacher') {
          // Teacher: show only their own materials
          materials = await Material.find({ userId }).sort({ uploadDate: -1 });
        } else {
          // Student: show all materials uploaded by teachers, with teacher name
          const teacherUsers = await accounts.find({ role: 'teacher' });
          const teacherIds = teacherUsers.map(t => t._id);
          materials = await Material.find({ userId: { $in: teacherIds } }).sort({ uploadDate: -1 }).lean();
          // Attach teacher name to each material
          const teacherMap = {};
          teacherUsers.forEach(t => { teacherMap[t._id] = t.name; });
          materials.forEach(mat => { mat.teacherName = teacherMap[mat.userId] || 'Unknown'; });
        }

        // Calculate statistics
        const totalMaterials = materials.length;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const materialsThisWeek = materials.filter(material => new Date(material.uploadDate) >= oneWeekAgo).length;
        const totalDownloads = totalMaterials;
        const activeStudents = totalMaterials > 0 ? 1 : 0;
        const recentActivity = materials.slice(0, 3);
        const storageUsed = totalMaterials;
        const subjectCounts = {};
        materials.forEach(material => {
          subjectCounts[material.subject] = (subjectCounts[material.subject] || 0) + 1;
        });
        const mostPopularSubject = Object.keys(subjectCounts).length > 0 
          ? Object.keys(subjectCounts).reduce((a, b) => subjectCounts[a] > subjectCounts[b] ? a : b)
          : 'None';
        const accountAge = Math.floor((new Date() - new Date(user.createdAt || user._id.getTimestamp())) / (1000 * 60 * 60 * 24));

        statistics = {
          materialsUploaded: totalMaterials,
          newThisWeek: materialsThisWeek,
          totalDownloads: totalDownloads,
          activeStudents: activeStudents,
          recentActivity: recentActivity,
          storageUsed: storageUsed,
          mostPopularSubject: mostPopularSubject,
          accountAge: accountAge
        };

        const dashboardData = {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          statistics,
          materials
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

// ================= NOTIFICATIONS =================
// Get current user's notifications
app.get('/notifications', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, secret);
    const items = await Notification.find({ userId: decoded.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark a notification as read
app.patch('/notifications/:id/read', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, secret);
    const { id } = req.params;
    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId: decoded.id },
      { $set: { isRead: true } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Notification not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Mark all notifications as read
app.patch('/notifications/read-all', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, secret);
    await Notification.updateMany({ userId: decoded.id, isRead: false }, { $set: { isRead: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating notifications' });
  }
});

// ============ PROFILE ROUTES ============
// Get current user profile and basic stats
app.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, secret);
    const user = await accounts.findById(decoded.id).select('_id name email avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const totalMaterials = await Material.countDocuments({ userId: decoded.id });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      stats: { totalMaterials }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update name
app.patch('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, secret);
    const { name } = req.body;
    const updated = await accounts.findByIdAndUpdate(
      decoded.id,
      { $set: { name } },
      { new: true, select: '_id name email avatar' }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ id: updated._id, name: updated.name, email: updated.email, avatar: updated.avatar || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Change password
app.patch('/me/password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, secret);
    const { currentPassword, newPassword } = req.body;
    const user = await accounts.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(currentPassword, user.password) || currentPassword === user.password;
    if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating password' });
  }
});

// Upload avatar
const avatarUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.post('/me/avatar', avatarUpload.single('avatar'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, secret);
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const updated = await accounts.findByIdAndUpdate(
      decoded.id,
      { $set: { avatar: fileUrl } },
      { new: true, select: '_id name email avatar' }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ id: updated._id, name: updated.name, email: updated.email, avatar: updated.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading avatar' });
  }
});
// ============ START SERVER ============
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
