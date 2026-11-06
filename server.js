const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DB_FILE = path.join(__dirname, 'bookings.json');

function loadBookings() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveBookings(bookings) {
  fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'medicourier-secret-key-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

function generateBookingId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `MSC-${date}-${random}`;
}

app.post('/api/bookings', (req, res) => {
  const data = req.body;
  const bookings = loadBookings();
  const id = generateBookingId();

  const booking = {
    id,
    created_at: new Date().toISOString(),
    status: 'Pending',
    name: data.name,
    email: data.email,
    phone: data.phone,
    organization: data.organization || '',
    pickup_address: data.pickupAddress,
    pickup_contact: data.pickupContact || '',
    pickup_date: data.pickupDate,
    pickup_time: data.pickupTime || '',
    delivery_address: data.deliveryAddress,
    delivery_contact: data.deliveryContact || '',
    delivery_time: data.deliveryTime || '',
    package_type: data.packageType,
    quantity: data.quantity || '1',
    handling: Array.isArray(data.handling) ? data.handling.join(', ') : (data.handling || ''),
    urgency: data.urgency,
    notes: data.notes || '',
    admin_notes: ''
  };

  bookings.unshift(booking);
  saveBookings(bookings);
  res.json({ success: true, id });
});

app.post('/api/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

function requireAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  res.json(loadBookings());
});

app.put('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  const bookings = loadBookings();
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  if (req.body.status) bookings[index].status = req.body.status;
  if (req.body.admin_notes !== undefined) bookings[index].admin_notes = req.body.admin_notes;
  saveBookings(bookings);
  res.json({ success: true });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
