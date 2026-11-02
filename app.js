// MediSwift Couriers - Booking Application

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }

  if (document.getElementById('bookingsList')) {
    loadBookings();
  }

  // Highlight active nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});

function handleBookingSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const booking = {
    id: generateBookingId(),
    timestamp: new Date().toISOString(),
    status: 'Pending Confirmation',
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    organization: formData.get('organization') || 'N/A',
    pickupAddress: formData.get('pickupAddress'),
    pickupContact: formData.get('pickupContact') || '',
    pickupDate: formData.get('pickupDate'),
    pickupTime: formData.get('pickupTime') || 'Flexible',
    deliveryAddress: formData.get('deliveryAddress'),
    deliveryContact: formData.get('deliveryContact') || '',
    deliveryTime: formData.get('deliveryTime') || 'As soon as possible',
    packageType: formData.get('packageType'),
    quantity: formData.get('quantity') || '1',
    handling: Array.from(formData.getAll('handling')),
    urgency: formData.get('urgency'),
    notes: formData.get('notes') || ''
  };

  // Save to localStorage
  const bookings = JSON.parse(localStorage.getItem('medicourierBookings') || '[]');
  bookings.unshift(booking);
  localStorage.setItem('medicourierBookings', JSON.stringify(bookings));

  // Show confirmation
  showConfirmation(booking);
  e.target.reset();
}

function generateBookingId() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `MSC-${dateStr}-${random}`;
}

function showConfirmation(booking) {
  const container = document.querySelector('.container') || document.body;
  const confirmationHTML = `
    <div class="confirmation" id="confirmationBox">
      <h2 style="margin-bottom: 1rem;">Booking Submitted Successfully!</h2>
      <p style="font-size: 1.2rem; margin-bottom: 0.5rem;"><strong>Booking ID:</strong> ${booking.id}</p>
      <p>Thank you, ${booking.name}. Your medical courier request has been received.</p>
      <p style="margin: 1rem 0;">We will contact you shortly at ${booking.phone} or ${booking.email} to confirm details and schedule pickup.</p>
      <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: left;">
        <p><strong>Pickup:</strong> ${booking.pickupAddress} on ${booking.pickupDate}</p>
        <p><strong>Delivery:</strong> ${booking.deliveryAddress}</p>
        <p><strong>Package:</strong> ${booking.packageType} (${booking.quantity})</p>
        <p><strong>Urgency:</strong> ${booking.urgency}</p>
        ${booking.handling.length ? `<p><strong>Handling:</strong> ${booking.handling.join(', ')}</p>` : ''}
      </div>
      <a href="my-bookings.html" class="btn" style="margin-right: 0.5rem;">View My Bookings</a>
      <button onclick="document.getElementById('confirmationBox').remove(); document.getElementById('bookingForm').style.display='block';" class="btn btn-outline">Book Another</button>
    </div>
  `;

  // Hide form and show confirmation
  const form = document.getElementById('bookingForm');
  if (form) form.style.display = 'none';
  
  const existing = document.getElementById('confirmationBox');
  if (existing) existing.remove();
  
  container.insertAdjacentHTML('afterbegin', confirmationHTML);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadBookings() {
  const list = document.getElementById('bookingsList');
  const bookings = JSON.parse(localStorage.getItem('medicourierBookings') || '[]');

  if (bookings.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px;">
        <p style="font-size: 1.2rem; color: #64748b; margin-bottom: 1rem;">No bookings yet.</p>
        <a href="book.html" class="btn">Book Your First Order</a>
      </div>
    `;
    return;
  }

  list.innerHTML = bookings.map(b => `
    <div class="booking-card">
      <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <div class="booking-id">${b.id}</div>
          <div style="color: #64748b; font-size: 0.9rem;">${new Date(b.timestamp).toLocaleString()}</div>
        </div>
        <span class="status">${b.status}</span>
      </div>
      <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
        <div><strong>From:</strong> ${b.pickupAddress}</div>
        <div><strong>To:</strong> ${b.deliveryAddress}</div>
        <div><strong>Date:</strong> ${b.pickupDate}</div>
        <div><strong>Package:</strong> ${b.packageType}</div>
        <div><strong>Urgency:</strong> ${b.urgency}</div>
        <div><strong>Contact:</strong> ${b.name}</div>
      </div>
      ${b.notes ? `<div style="margin-top: 0.75rem; font-style: italic; color: #64748b;">Note: ${b.notes}</div>` : ''}
    </div>
  `).join('');
}

// Utility to clear bookings (for demo)
function clearBookings() {
  if (confirm('Clear all local bookings? This only affects this browser.')) {
    localStorage.removeItem('medicourierBookings');
    loadBookings();
  }
}
