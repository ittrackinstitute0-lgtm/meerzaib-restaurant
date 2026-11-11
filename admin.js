/**
 * MEERZAIB RESTAURANT - Admin Dashboard Controller
 * Handles Authentication, Orders Management, Menu CRUD, and Bookings
 */

// Demo Admin Credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "meerzaib123";

// Current Active Filter for Orders
let currentOrderFilter = "all";

// Audio sound feedback
function playAdminBeep() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch(e) {}
}

// ==========================================================
// AUTHENTICATION
// ==========================================================
function checkAuth() {
  const isAuth = sessionStorage.getItem("meerzaib_admin_auth");
  const loginOverlay = document.getElementById("adminLoginOverlay");
  const adminApp = document.getElementById("adminApp");

  if (isAuth === "true") {
    if (loginOverlay) loginOverlay.style.display = "none";
    if (adminApp) adminApp.style.display = "flex";
    loadAllAdminData();
  } else {
    if (loginOverlay) loginOverlay.style.display = "flex";
    if (adminApp) adminApp.style.display = "none";
  }
}

function initAdminLogin() {
  const form = document.getElementById("adminLoginForm");
  const logoutBtn = document.getElementById("adminLogoutBtn");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("adminUser").value.trim();
      const pass = document.getElementById("adminPass").value.trim();

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem("meerzaib_admin_auth", "true");
        showAdminToast("Welcome to Meerzaib Restaurant Dashboard!", "success");
        checkAuth();
      } else {
        showAdminToast("Invalid username or password. Check demo credentials.", "danger");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("meerzaib_admin_auth");
      showAdminToast("Logged out successfully.");
      checkAuth();
    });
  }
}

// ==========================================================
// TAB NAVIGATION
// ==========================================================
function switchAdminTab(targetTabId) {
  playAdminBeep();
  const tabs = document.querySelectorAll(".admin-tab-pane");
  const navBtns = document.querySelectorAll(".admin-nav-item");
  const tabTitle = document.getElementById("currentTabTitle");

  tabs.forEach(tab => tab.classList.remove("active"));
  navBtns.forEach(btn => btn.classList.remove("active"));

  const targetPane = document.getElementById(targetTabId);
  if (targetPane) targetPane.classList.add("active");

  const activeNav = document.querySelector(`.admin-nav-item[data-tab="${targetTabId}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
    if (tabTitle) tabTitle.textContent = activeNav.textContent.trim().split(" ")[0] + " " + (activeNav.textContent.trim().split(" ")[1] || "");
  }

  // Close sidebar on mobile
  const sidebar = document.getElementById("adminSidebar");
  if (sidebar && window.innerWidth <= 768) {
    sidebar.classList.remove("open");
  }
}

function initTabNavigation() {
  const navBtns = document.querySelectorAll(".admin-nav-item");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      switchAdminTab(target);
    });
  });

  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("adminSidebar");
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }
}

// ==========================================================
// LOAD DATA & STATS
// ==========================================================
function loadAllAdminData() {
  updateDashboardStats();
  renderOrdersTable();
  renderMenuAdminTable();
  renderReservationsTable();
  renderReviewsAdminTable();
}

function updateDashboardStats() {
  const orders = JSON.parse(localStorage.getItem("meerzaib_orders") || "[]");
  const reservations = JSON.parse(localStorage.getItem("meerzaib_reservations") || "[]");
  const menu = JSON.parse(localStorage.getItem("meerzaib_menu") || "[]");

  // Calculations
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => {
    return ord.status !== "Cancelled" ? sum + (ord.total || 0) : sum;
  }, 0);
  const totalBookings = reservations.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const pendingRes = reservations.filter(r => r.status === "Pending").length;

  // DOM Updates
  const statOrdersEl = document.getElementById("statTotalOrders");
  const statRevEl = document.getElementById("statTotalRevenue");
  const statBookingsEl = document.getElementById("statTotalBookings");
  const statDishesEl = document.getElementById("statTotalDishes");
  const ordersPendingBadge = document.getElementById("ordersPendingBadge");
  const resPendingBadge = document.getElementById("resPendingBadge");

  if (statOrdersEl) statOrdersEl.textContent = totalOrders;
  if (statRevEl) statRevEl.textContent = `Rs. ${totalRevenue.toLocaleString()}`;
  if (statBookingsEl) statBookingsEl.textContent = totalBookings;
  if (statDishesEl) statDishesEl.textContent = menu.length;
  if (ordersPendingBadge) ordersPendingBadge.textContent = pendingOrders;
  if (resPendingBadge) resPendingBadge.textContent = pendingRes;

  // Quick Dashboard mini tables
  const recentOrdersTbody = document.querySelector("#dashboardRecentOrdersTable tbody");
  if (recentOrdersTbody) {
    if (orders.length === 0) {
      recentOrdersTbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No orders placed yet.</td></tr>`;
    } else {
      recentOrdersTbody.innerHTML = orders.slice(0, 5).map(o => `
        <tr>
          <td><strong>#${o.id}</strong></td>
          <td>${o.customerName}<br><small class="text-dim">${o.phone}</small></td>
          <td class="highlight-gold font-bold">Rs. ${o.total.toLocaleString()}</td>
          <td><span class="badge-status ${getStatusBadgeClass(o.status)}">${o.status}</span></td>
        </tr>
      `).join("");
    }
  }

  const recentBookingsTbody = document.querySelector("#dashboardRecentBookingsTable tbody");
  if (recentBookingsTbody) {
    if (reservations.length === 0) {
      recentBookingsTbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No table reservations yet.</td></tr>`;
    } else {
      recentBookingsTbody.innerHTML = reservations.slice(0, 5).map(r => `
        <tr>
          <td><strong>${r.name}</strong><br><small class="text-dim">${r.phone}</small></td>
          <td>${r.date}<br><small>${r.time}</small></td>
          <td>${r.guests}</td>
          <td><span class="badge-status badge-preparing">${r.seating || "Hall"}</span></td>
        </tr>
      `).join("");
    }
  }
}

function getStatusBadgeClass(status) {
  if (status === "Pending") return "badge-pending";
  if (status === "Preparing") return "badge-preparing";
  if (status === "Completed") return "badge-completed";
  if (status === "Cancelled") return "badge-cancelled";
  return "badge-pending";
}

// ==========================================================
// ORDERS MANAGEMENT
// ==========================================================
function renderOrdersTable() {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  const orders = JSON.parse(localStorage.getItem("meerzaib_orders") || "[]");
  const filtered = orders.filter(o => currentOrderFilter === "all" || o.status === currentOrderFilter);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center" style="padding: 2.5rem; color: var(--text-dim);">
          <i class="fa-solid fa-receipt" style="font-size:2rem; margin-bottom:0.5rem; display:block;"></i>
          No orders found matching the filter "${currentOrderFilter}".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(order => {
    const itemsSummary = (order.items || []).map(i => `${i.name} × ${i.qty}`).join("<br>");

    return `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td>
          <strong>${order.customerName}</strong><br>
          <small class="text-dim"><i class="fa-solid fa-phone"></i> ${order.phone}</small><br>
          <small class="text-muted"><i class="fa-solid fa-location-dot"></i> ${order.address || "Dine-in"}</small>
        </td>
        <td><small style="line-height:1.4;">${itemsSummary}</small></td>
        <td><strong class="highlight-gold">Rs. ${order.total.toLocaleString()}</strong><br><small class="text-dim">${order.paymentMethod || "COD"}</small></td>
        <td>
          <span style="font-weight:600;">${order.orderType || "Delivery"}</span><br>
          <small class="text-dim">${order.date || ""} ${order.time || ""}</small>
        </td>
        <td><span class="badge-status ${getStatusBadgeClass(order.status)}">${order.status}</span></td>
        <td>
          <div class="table-actions">
            ${order.status === "Pending" ? `
              <button class="btn-tbl btn-tbl-prep" onclick="updateOrderStatus('${order.id}', 'Preparing')">
                <i class="fa-solid fa-kitchen-set"></i> Prepare
              </button>
            ` : ""}
            ${order.status === "Preparing" || order.status === "Pending" ? `
              <button class="btn-tbl btn-tbl-done" onclick="updateOrderStatus('${order.id}', 'Completed')">
                <i class="fa-solid fa-check"></i> Complete
              </button>
            ` : ""}
            ${order.status !== "Cancelled" && order.status !== "Completed" ? `
              <button class="btn-tbl btn-tbl-cancel" onclick="updateOrderStatus('${order.id}', 'Cancelled')">
                <i class="fa-solid fa-xmark"></i> Cancel
              </button>
            ` : ""}
            <button class="btn-tbl btn-tbl-edit" onclick="printOrderReceipt('${order.id}')" title="Print Invoice">
              <i class="fa-solid fa-print"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateOrderStatus(orderId, newStatus) {
  playAdminBeep();
  const orders = JSON.parse(localStorage.getItem("meerzaib_orders") || "[]");
  const target = orders.find(o => o.id === orderId);

  if (target) {
    target.status = newStatus;
    localStorage.setItem("meerzaib_orders", JSON.stringify(orders));
    showAdminToast(`Order #${orderId} marked as ${newStatus}!`, "success");
    loadAllAdminData();
  }
}

function printOrderReceipt(orderId) {
  const orders = JSON.parse(localStorage.getItem("meerzaib_orders") || "[]");
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt - Order #${order.id}</title>
        <style>
          body { font-family: monospace; padding: 20px; max-width: 380px; margin: 0 auto; }
          h2 { text-align: center; margin-bottom: 2px; }
          p { margin: 3px 0; font-size: 13px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .total { font-size: 16px; font-weight: bold; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h2>MEERZAIB RESTAURANT</h2>
        <p style="text-align:center;">Royal Fine Dining & Lounge</p>
        <p style="text-align:center;">Tel: +92 300 1234567</p>
        <div class="divider"></div>
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Date/Time:</strong> ${order.date} ${order.time}</p>
        <p><strong>Type:</strong> ${order.orderType}</p>
        <div class="divider"></div>
        ${(order.items || []).map(i => `<p>${i.name} x ${i.qty} - Rs. ${(i.price * i.qty).toLocaleString()}</p>`).join("")}
        <div class="divider"></div>
        <p>Subtotal: Rs. ${(order.subtotal || 0).toLocaleString()}</p>
        <p>Delivery: Rs. ${(order.deliveryFee || 0).toLocaleString()}</p>
        <p class="total">GRAND TOTAL: Rs. ${(order.total || 0).toLocaleString()}</p>
        <p>Payment: ${order.paymentMethod}</p>
        <div class="divider"></div>
        <p style="text-align:center;">Thank you for dining with royalty!</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}

function initOrderFilters() {
  const pills = document.querySelectorAll(".order-filter-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentOrderFilter = pill.getAttribute("data-filter");
      renderOrdersTable();
    });
  });
}

// ==========================================================
// MENU MANAGEMENT (CRUD)
// ==========================================================
function renderMenuAdminTable() {
  const tbody = document.getElementById("menuAdminTableBody");
  if (!tbody) return;

  const menu = JSON.parse(localStorage.getItem("meerzaib_menu") || "[]");

  tbody.innerHTML = menu.map(dish => `
    <tr>
      <td>
        <div class="tbl-dish-cell">
          <img src="${dish.image}" alt="${dish.name}" class="tbl-dish-thumb">
          <div>
            <strong>${dish.name}</strong><br>
            <small class="text-dim">${dish.description.substring(0, 45)}...</small>
          </div>
        </div>
      </td>
      <td><span class="badge-status badge-preparing">${dish.category}</span></td>
      <td><strong class="highlight-gold">Rs. ${dish.price.toLocaleString()}</strong></td>
      <td><i class="fa-solid fa-star" style="color:#facc15"></i> ${dish.rating}</td>
      <td><span class="badge-status badge-pending">${dish.badge || "Standard"}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-tbl btn-tbl-edit" onclick="openEditDishModal(${dish.id})">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="btn-tbl btn-tbl-cancel" onclick="deleteDish(${dish.id})">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function openAddDishModal() {
  playAdminBeep();
  document.getElementById("dishModalTitle").innerHTML = '<i class="fa-solid fa-utensils highlight-gold"></i> Add New Menu Dish';
  document.getElementById("dishForm").reset();
  document.getElementById("editDishId").value = "";
  openAdminModal("dishModal");
}

function openEditDishModal(dishId) {
  playAdminBeep();
  const menu = JSON.parse(localStorage.getItem("meerzaib_menu") || "[]");
  const dish = menu.find(d => d.id === dishId);
  if (!dish) return;

  document.getElementById("dishModalTitle").innerHTML = '<i class="fa-solid fa-pen-to-square highlight-gold"></i> Edit Menu Dish';
  document.getElementById("editDishId").value = dish.id;
  document.getElementById("dishName").value = dish.name;
  document.getElementById("dishCategory").value = dish.category;
  document.getElementById("dishPrice").value = dish.price;
  document.getElementById("dishRating").value = dish.rating;
  document.getElementById("dishBadge").value = dish.badge || "";
  document.getElementById("dishImage").value = dish.image;
  document.getElementById("dishDescription").value = dish.description;
  document.getElementById("dishIsSpecial").checked = !!dish.isSpecial;

  openAdminModal("dishModal");
}

function deleteDish(dishId) {
  if (!confirm("Are you sure you want to delete this dish from the menu?")) return;
  let menu = JSON.parse(localStorage.getItem("meerzaib_menu") || "[]");
  menu = menu.filter(d => d.id !== dishId);
  localStorage.setItem("meerzaib_menu", JSON.stringify(menu));
  showAdminToast("Dish deleted successfully from menu.", "danger");
  loadAllAdminData();
}

function resetToDefaultMenu() {
  if (!confirm("Reset menu to original royal dishes? (All custom items will be restored)")) return;
  localStorage.removeItem("meerzaib_menu");
  showAdminToast("Menu restored to default Royal signature items!", "success");
  loadAllAdminData();
}

function initDishForm() {
  const form = document.getElementById("dishForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    playAdminBeep();

    const editId = document.getElementById("editDishId").value;
    const name = document.getElementById("dishName").value.trim();
    const category = document.getElementById("dishCategory").value;
    const price = parseInt(document.getElementById("dishPrice").value);
    const rating = parseFloat(document.getElementById("dishRating").value) || 4.9;
    const badge = document.getElementById("dishBadge").value.trim();
    const image = document.getElementById("dishImage").value.trim();
    const description = document.getElementById("dishDescription").value.trim();
    const isSpecial = document.getElementById("dishIsSpecial").checked;

    let menu = JSON.parse(localStorage.getItem("meerzaib_menu") || "[]");

    if (editId) {
      // Edit existing
      const target = menu.find(d => d.id === parseInt(editId));
      if (target) {
        target.name = name;
        target.category = category;
        target.price = price;
        target.rating = rating;
        target.badge = badge;
        target.image = image;
        target.description = description;
        target.isSpecial = isSpecial;
      }
      showAdminToast(`Updated "${name}" successfully!`, "success");
    } else {
      // Add new
      const newDish = {
        id: Date.now(),
        name,
        category,
        price,
        rating,
        badge,
        image,
        description,
        isSpecial
      };
      menu.unshift(newDish);
      showAdminToast(`Added new dish "${name}" to Royal Menu!`, "success");
    }

    localStorage.setItem("meerzaib_menu", JSON.stringify(menu));
    closeAdminModal("dishModal");
    loadAllAdminData();
  });
}

// ==========================================================
// RESERVATIONS MANAGEMENT
// ==========================================================
function renderReservationsTable() {
  const tbody = document.getElementById("reservationsTableBody");
  if (!tbody) return;

  const bookings = JSON.parse(localStorage.getItem("meerzaib_reservations") || "[]");

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="padding:2rem;">No reservations booked yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td><strong>${b.name}</strong></td>
      <td><a href="tel:${b.phone}" class="text-gold">${b.phone}</a></td>
      <td>${b.date}<br><small class="text-dim">${b.time}</small></td>
      <td>${b.guests}</td>
      <td><span class="badge-status badge-preparing">${b.seating}</span></td>
      <td><small class="text-dim">${b.notes || "-"}</small></td>
      <td><span class="badge-status ${b.status === 'Confirmed' ? 'badge-completed' : 'badge-cancelled'}">${b.status}</span></td>
      <td>
        <div class="table-actions">
          ${b.status !== "Confirmed" ? `
            <button class="btn-tbl btn-tbl-done" onclick="updateBookingStatus('${b.id}', 'Confirmed')">Confirm</button>
          ` : `
            <button class="btn-tbl btn-tbl-cancel" onclick="updateBookingStatus('${b.id}', 'Cancelled')">Cancel</button>
          `}
        </div>
      </td>
    </tr>
  `).join("");
}

function updateBookingStatus(bookingId, status) {
  playAdminBeep();
  const bookings = JSON.parse(localStorage.getItem("meerzaib_reservations") || "[]");
  const target = bookings.find(b => b.id === bookingId);
  if (target) {
    target.status = status;
    localStorage.setItem("meerzaib_reservations", JSON.stringify(bookings));
    showAdminToast(`Reservation ${bookingId} updated to ${status}!`);
    loadAllAdminData();
  }
}

// ==========================================================
// REVIEWS MANAGEMENT
// ==========================================================
function renderReviewsAdminTable() {
  const tbody = document.getElementById("reviewsTableBody");
  if (!tbody) return;

  const reviews = JSON.parse(localStorage.getItem("meerzaib_reviews") || "[]");

  tbody.innerHTML = reviews.map((r, idx) => `
    <tr>
      <td><strong>${r.name}</strong></td>
      <td><span style="color:#facc15;">${'★'.repeat(r.rating)}</span></td>
      <td>${r.dish || "Royal Special"}</td>
      <td><small>"${r.text}"</small></td>
      <td>
        <button class="btn-tbl btn-tbl-cancel" onclick="deleteReview(${idx})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteReview(index) {
  const reviews = JSON.parse(localStorage.getItem("meerzaib_reviews") || "[]");
  reviews.splice(index, 1);
  localStorage.setItem("meerzaib_reviews", JSON.stringify(reviews));
  showAdminToast("Review removed.", "danger");
  renderReviewsAdminTable();
}

// ==========================================================
// SIMULATION HELPERS (FOR TESTING DEMO)
// ==========================================================
function addSampleOrderDemo() {
  const orders = JSON.parse(localStorage.getItem("meerzaib_orders") || "[]");
  const sampleOrder = {
    id: "MZB-" + Math.floor(1000 + Math.random() * 9000),
    customerName: "Sultan Ahmed",
    phone: "0321-9876543",
    orderType: "Home Delivery",
    address: "Villa 42, Royal Orchard Lane",
    paymentMethod: "Cash on Delivery (COD)",
    notes: "Please deliver piping hot with mint chutney.",
    items: [
      { name: "Royal Mutton Chops BBQ", qty: 2, price: 1850 },
      { name: "Meerzaib Shahi Dum Biryani", qty: 1, price: 1250 }
    ],
    subtotal: 4950,
    discount: 0,
    deliveryFee: 150,
    total: 5100,
    status: "Pending",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString()
  };

  orders.unshift(sampleOrder);
  localStorage.setItem("meerzaib_orders", JSON.stringify(orders));
  showAdminToast(`New simulated order #${sampleOrder.id} generated!`, "success");
  loadAllAdminData();
}

function addSampleReservationDemo() {
  const bookings = JSON.parse(localStorage.getItem("meerzaib_reservations") || "[]");
  const sample = {
    id: "RES-" + Math.floor(1000 + Math.random() * 9000),
    name: "Dr. Farhan Qureshi",
    phone: "0312-4455667",
    date: new Date().toISOString().split("T")[0],
    time: "08:30 PM",
    guests: "4 Persons",
    seating: "VIP Private Lounge",
    notes: "VIP guest dining with international delegates.",
    status: "Confirmed",
    timestamp: new Date().toLocaleString()
  };

  bookings.unshift(sample);
  localStorage.setItem("meerzaib_reservations", JSON.stringify(bookings));
  showAdminToast(`New booking added for ${sample.name}!`, "success");
  loadAllAdminData();
}

// ==========================================================
// MODALS & TOASTS
// ==========================================================
function openAdminModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("active");
}

function closeAdminModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("active");
}

function showAdminToast(msg, type = "info") {
  const container = document.getElementById("adminToastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : type === "danger" ? "toast-danger" : ""}`;
  toast.innerHTML = `<i class="fa-solid fa-bell highlight-gold"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Dom Ready
document.addEventListener("DOMContentLoaded", () => {
  initAdminLogin();
  checkAuth();
  initTabNavigation();
  initOrderFilters();
  initDishForm();
});
