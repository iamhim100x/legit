# MediSwift Couriers - Medical Courier Booking Website

A clean, professional, responsive website for a medical courier service where clients can book orders for lab specimens, pharmaceuticals, medical equipment, and other healthcare materials.

## Features

- **Homepage**: Service overview, key benefits (temperature control, STAT, compliance), how it works
- **Booking Form**: Comprehensive form covering:
  - Contact & organization details
  - Pickup address, date, time window, contact
  - Delivery address and preferences
  - Package type, quantity, special handling (cold chain, biohazard, etc.)
  - Urgency level (Standard / Same-Day / STAT)
  - Notes
- **Booking Confirmation**: Instant confirmation with unique Booking ID
- **My Bookings**: View past bookings stored in the browser (localStorage)
- Professional medical theme with custom logo
- Fully responsive design
- Client-side only (demo) — no backend required

## How to Use

1. Download or open the folder.
2. Open `index.html` in any modern web browser.
3. Navigate to **Book Order** to submit a booking.
4. View submitted bookings under **My Bookings**.

> Note: Bookings are saved only in the current browser's localStorage. Clearing browser data will remove them. This is ideal for demonstration or as a frontend prototype.

## Customization

- Change company name, colors, and content in the HTML/CSS files.
- Logo is in `images/logo.jpg` (replace as needed).
- To make it production-ready:
  - Connect the form to a backend (email service, database, or dispatch system like Onfleet, Track-POD, etc.).
  - Add real authentication and user accounts.
  - Integrate payment, tracking, and notifications.
  - Ensure HIPAA / local regulatory compliance for handling any patient-related data.

## Tech

- Pure HTML, CSS, and vanilla JavaScript
- No frameworks or build step required
- Works offline once loaded

---

Built as a demonstration for a medical courier service project.
