/**
 * MEERZAIB RESTAURANT - Main JavaScript Application
 * Handles Menu Rendering, Cart Drawer, Table Reservations, Button Animations, and LocalStorage Sync
 */

// Initial Default Menu Database
const DEFAULT_MENU_ITEMS = [
  {
    id: 1,
    name: "Royal Mutton Chops BBQ",
    category: "BBQ",
    price: 1850,
    rating: 4.9,
    badge: "Chef Special",
    isSpecial: true,
    description: "Tender overnight marinated chops charred to perfection on fragrant charcoal embers with secret royal spices.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Meerzaib Shahi Dum Biryani",
    category: "Main Course",
    price: 1250,
    rating: 5.0,
    badge: "Bestseller",
    isSpecial: true,
    description: "Aged basmati rice layered with succulent saffron infused meat, caramelised onions, mint, and pure ghee.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Smoked Cheese Beef Burger",
    category: "Fast Food",
    price: 950,
    rating: 4.8,
    badge: "Popular",
    isSpecial: true,
    description: "Double smash prime beef patty, melted aged gouda, caramelised brisket onions, and truffle aioli on toasted brioche.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Chicken Malai Boti Skewers",
    category: "BBQ",
    price: 1100,
    rating: 4.9,
    badge: "Melt In Mouth",
    isSpecial: false,
    description: "Boneless chicken chunks steeped in fresh clotted cream, white pepper, cardamom, and grilled tenderly.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Royal Mughlai Handi",
    category: "Main Course",
    price: 1450,
    rating: 4.8,
    badge: "Royal Rich",
    isSpecial: false,
    description: "Creamy cashew and roasted tomato velvet gravy with succulent boneless chicken cooked in clay handi.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Crispy Peri Peri Wings (8 Pcs)",
    category: "Starters",
    price: 750,
    rating: 4.7,
    badge: "Spicy",
    isSpecial: false,
    description: "Double battered golden chicken wings glazed with tangy African bird's eye chili marinade and ranch dip.",
    image: "https://images.unsplash.com/photo-1527477378378-0245244b7d51?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Artisan Wood-Fired Margherita Pizza",
    category: "Fast Food",
    price: 1350,
    rating: 4.9,
    badge: "Italian Craft",
    isSpecial: false,
    description: "San Marzano tomato sauce, fresh buffalo mozzarella, virgin olive oil, and aromatic garden sweet basil.",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Zafrani Matka Kheer",
    category: "Desserts",
    price: 550,
    rating: 4.9,
    badge: "Traditional",
    isSpecial: false,
    description: "Slow simmered royal rice pudding with Iranian saffron, crushed pistachios, almonds, and silver vark in terracotta pot.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    name: "Molten Chocolate Lava Cake",
    category: "Desserts",
    price: 790,
    rating: 5.0,
    badge: "Warm Delight",
    isSpecial: false,
    description: "Belgian dark chocolate sponge oozing warm liquid ganache, paired with a scoop of Madagascar vanilla bean gelato.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 10,
    name: "Mint Margarita Royale",
    category: "Beverages",
    price: 420,
    rating: 4.8,
    badge: "Chilled Refresh",
    isSpecial: false,
    description: "Crushed fresh mint leaves, zesty lemon juice, Himalayan pink salt, and sparkling soda served on shaved ice.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 11,
    name: "Royal Karak Peshawari Chai",
    category: "Beverages",
    price: 250,
    rating: 4.9,
    badge: "Must Try",
    isSpecial: false,
    description: "Strong brewed black tea leaves slow boiled with whole buffalo milk, green cardamom, and golden jaggery.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 12,
    name: "Golden Stuffed Cheese Naan",
    category: "Starters",
    price: 480,
    rating: 4.8,
    badge: "Appetizer",
    isSpecial: false,
    description: "Fluffy clay oven tandoori bread stuffed with premium mozzarella, cheddar, herbs, and brushed with garlic butter.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"
  }
];

// Default Verified Reviews
const DEFAULT_REVIEWS = [
  {
    name: "Hamza Khan",
    rating: 5,
    dish: "Royal Mutton Chops BBQ",
    text: "The Mutton Chops at Meerzaib Restaurant are pure perfection! Melting texture, authentic spices, and the ambiance is truly majestic."
  },
  {
    name: "Ayesha Malik",
    rating: 5,
    dish: "Meerzaib Shahi Dum Biryani",
    text: "Hands down the best Dum Biryani in the city. The aroma itself took my breath away. Fast service and courteous staff!"
  },
  {
    name: "Shahmeer Baloch",
    rating: 5,
    dish: "Smoked Cheese Beef Burger",
    text: "Surpassed all burger spots in town! Juicy double beef patty, incredible cheese pull, and crisp fries. 10/10 recommended."
  }
];

// Initialize Storage State
function getStoredMenu() {
  const stored = localStorage.getItem("meerzaib_menu");
  if (!stored) {
    localStorage.setItem("meerzaib_menu", JSON.stringify(DEFAULT_MENU_ITEMS));
    return DEFAULT_MENU_ITEMS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_MENU_ITEMS;
  }
}

function getStoredCart() {
  const stored = localStorage.getItem("meerzaib_cart");
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("meerzaib_cart", JSON.stringify(cart));
  updateCartUI();
}

function getStoredReviews() {
  const stored = localStorage.getItem("meerzaib_reviews");
  if (!stored) {
    localStorage.setItem("meerzaib_reviews", JSON.stringify(DEFAULT_REVIEWS));
    return DEFAULT_REVIEWS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_REVIEWS;
  }
}

// Current Filter & Coupon State
let currentCategory = "all";
let currentSearch = "";
let appliedCoupon = null; // { code: 'MEERZAIB10', discountPercent: 10 }
const DELIVERY_FEE = 150;

// ==========================================================
// SOUND FEEDBACK UTILITY (Synthesized Web Audio API)
// ==========================================================
function playFeedbackSound(type = "click") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Audio context may require user gesture on some browsers
  }
}

// ==========================================================
// BUTTON RIPPLE ANIMATION
// ==========================================================
function attachRippleEffect() {
  document.querySelectorAll(".btn-ripple").forEach(btn => {
    btn.addEventListener("click", function(e) {
      playFeedbackSound("click");
      const circle = document.createElement("span");
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      const rect = btn.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add("ripple-circle");

      const existingRipple = btn.querySelector(".ripple-circle");
      if (existingRipple) {
        existingRipple.remove();
      }

      btn.appendChild(circle);
    });
  });
}

// ==========================================================
// RENDER SPECIALS
// ==========================================================
function renderSpecials() {
  const container = document.getElementById("specialsContainer");
  if (!container) return;

  const menu = getStoredMenu();
  const specials = menu.filter(item => item.isSpecial).slice(0, 3);

  container.innerHTML = specials.map(dish => `
    <div class="special-card">
      <div class="special-img-wrap">
        <img src="${dish.image}" alt="${dish.name}" loading="lazy">
        <span class="special-tag"><i class="fa-solid fa-star"></i> ${dish.badge || "Signature"}</span>
      </div>
      <div class="special-info">
        <div class="special-meta">
          <span class="special-cat">${dish.category}</span>
          <span class="special-rating"><i class="fa-solid fa-star"></i> ${dish.rating}</span>
        </div>
        <h3 class="special-title">${dish.name}</h3>
        <p class="special-desc">${dish.description}</p>
        <div class="special-footer">
          <div class="special-price">Rs. ${dish.price.toLocaleString()}</div>
          <button class="btn-royal btn-sm btn-shimmer btn-ripple" onclick="addToCart(${dish.id})">
            <i class="fa-solid fa-plus"></i> Order Now
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// ==========================================================
// RENDER ROYAL MENU ITEMS
// ==========================================================
function renderMenu() {
  const container = document.getElementById("menuCardsContainer");
  const noItems = document.getElementById("noItemsMessage");
  if (!container) return;

  const menu = getStoredMenu();
  const cart = getStoredCart();

  const filtered = menu.filter(item => {
    const matchesCat = currentCategory === "all" || item.category === currentCategory;
    const matchesSearch = item.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(currentSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = "";
    if (noItems) noItems.style.display = "block";
    return;
  }

  if (noItems) noItems.style.display = "none";

  container.innerHTML = filtered.map(dish => {
    const cartEntry = cart.find(c => c.id === dish.id);
    const inCartQty = cartEntry ? cartEntry.qty : 0;

    let actionButtonHTML = "";
    if (inCartQty > 0) {
      actionButtonHTML = `
        <div class="card-qty-control">
          <button class="card-qty-btn" onclick="updateItemQuantity(${dish.id}, -1)">-</button>
          <span class="card-qty-count">${inCartQty}</span>
          <button class="card-qty-btn" onclick="updateItemQuantity(${dish.id}, 1)">+</button>
        </div>
      `;
    } else {
      actionButtonHTML = `
        <button class="btn-add-cart btn-ripple" onclick="addToCart(${dish.id})">
          <i class="fa-solid fa-bag-shopping"></i> Add To Cart
        </button>
      `;
    }

    return `
      <div class="menu-card">
        <div class="menu-img-wrap">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy">
          <span class="menu-badge ${dish.badge === 'Spicy' ? 'badge-spicy' : ''}">
            ${dish.badge || dish.category}
          </span>
        </div>
        <div class="menu-card-body">
          <div class="menu-item-header">
            <h4 class="menu-item-title">${dish.name}</h4>
            <span class="menu-item-rating"><i class="fa-solid fa-star"></i> ${dish.rating}</span>
          </div>
          <p class="menu-item-desc">${dish.description}</p>
          <div class="menu-card-bottom">
            <span class="menu-price">Rs. ${dish.price.toLocaleString()}</span>
            <div class="card-action-wrap">
              ${actionButtonHTML}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  attachRippleEffect();
}

// ==========================================================
// CART OPERATIONS
// ==========================================================
function addToCart(dishId) {
  playFeedbackSound("click");
  const menu = getStoredMenu();
  const dish = menu.find(d => d.id === dishId);
  if (!dish) return;

  const cart = getStoredCart();
  const existing = cart.find(item => item.id === dishId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      qty: 1
    });
  }

  saveCart(cart);
  renderMenu();
  showToast(`Added <strong>${dish.name}</strong> to your royal cart!`);

  // Cart badge bounce animation
  const badge = document.getElementById("cartBadgeCount");
  if (badge) {
    badge.classList.remove("bounce-anim");
    void badge.offsetWidth; // Trigger reflow
    badge.classList.add("bounce-anim");
  }
}

function updateItemQuantity(dishId, delta) {
  playFeedbackSound("click");
  let cart = getStoredCart();
  const existing = cart.find(item => item.id === dishId);

  if (!existing) return;

  existing.qty += delta;
  if (existing.qty <= 0) {
    cart = cart.filter(item => item.id !== dishId);
  }

  saveCart(cart);
  renderMenu();
}

function removeCartItem(dishId) {
  let cart = getStoredCart();
  cart = cart.filter(item => item.id !== dishId);
  saveCart(cart);
  renderMenu();
  showToast("Item removed from cart.", "danger");
}

function updateCartUI() {
  const cart = getStoredCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // Update Badges
  const badge = document.getElementById("cartBadgeCount");
  const mobileCount = document.getElementById("mobileCartCount");
  if (badge) badge.textContent = totalItems;
  if (mobileCount) mobileCount.textContent = totalItems;

  // Render items inside drawer
  const cartList = document.getElementById("cartItemsList");
  const cartFooter = document.getElementById("cartFooter");

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-basket-shopping"></i>
        <h4>Your Cart is Empty</h4>
        <p>Explore our royal menu and add mouthwatering dishes!</p>
      </div>
    `;
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }

  if (cartFooter) cartFooter.style.display = "block";

  cartList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-actions">
          <button class="cart-item-qty-btn" onclick="updateItemQuantity(${item.id}, -1)">-</button>
          <span style="font-size:0.85rem; font-weight:700;">${item.qty}</span>
          <button class="cart-item-qty-btn" onclick="updateItemQuantity(${item.id}, 1)">+</button>
          <button class="cart-item-remove-btn" onclick="removeCartItem(${item.id})" title="Remove"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    </div>
  `).join("");

  // Subtotal Calculation
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discountAmount = 0;

  if (appliedCoupon) {
    discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + DELIVERY_FEE);

  const subtotalEl = document.getElementById("billSubtotal");
  const discountRow = document.getElementById("billDiscountRow");
  const discountEl = document.getElementById("billDiscount");
  const grandTotalEl = document.getElementById("billGrandTotal");
  const checkoutTotalText = document.getElementById("checkoutTotalText");

  if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
  if (grandTotalEl) grandTotalEl.textContent = `Rs. ${grandTotal.toLocaleString()}`;
  if (checkoutTotalText) checkoutTotalText.textContent = `Rs. ${grandTotal.toLocaleString()}`;

  if (appliedCoupon && discountAmount > 0) {
    if (discountRow) discountRow.style.display = "flex";
    if (discountEl) discountEl.textContent = `- Rs. ${discountAmount.toLocaleString()} (${appliedCoupon.discountPercent}%)`;
  } else {
    if (discountRow) discountRow.style.display = "none";
  }
}

// Drawer Toggles
function toggleCart() {
  playFeedbackSound("click");
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer && overlay) {
    drawer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

// ==========================================================
// TABLE RESERVATION FORM HANDLING
// ==========================================================
function initReservation() {
  const form = document.getElementById("reservationForm");
  if (!form) return;

  // Set today as min date
  const dateInput = document.getElementById("resDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    playFeedbackSound("success");

    const newBooking = {
      id: "RES-" + Math.floor(1000 + Math.random() * 9000),
      name: document.getElementById("resName").value.trim(),
      phone: document.getElementById("resPhone").value.trim(),
      date: document.getElementById("resDate").value,
      time: document.getElementById("resTime").value,
      guests: document.getElementById("resGuests").value,
      seating: document.getElementById("resSeating").value,
      notes: document.getElementById("resNotes").value.trim() || "None",
      status: "Confirmed",
      timestamp: new Date().toLocaleString()
    };

    // Save to local storage for Admin Panel sync
    const bookings = JSON.parse(localStorage.getItem("meerzaib_reservations") || "[]");
    bookings.unshift(newBooking);
    localStorage.setItem("meerzaib_reservations", JSON.stringify(bookings));

    showToast(`🎉 Table reserved successfully for ${newBooking.name}! Booking ID: ${newBooking.id}`, "success");
    form.reset();
  });
}

// ==========================================================
// CHECKOUT & ORDER SUBMISSION
// ==========================================================
function initCheckout() {
  const proceedBtn = document.getElementById("proceedCheckoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");

  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      const cart = getStoredCart();
      if (cart.length === 0) {
        showToast("Your cart is empty! Add food items first.", "danger");
        return;
      }
      toggleCart(); // Close drawer
      openModal("checkoutModal");

      // Set payable total in modal
      const grandTotalEl = document.getElementById("billGrandTotal");
      const modalPayableTotal = document.getElementById("modalPayableTotal");
      if (grandTotalEl && modalPayableTotal) {
        modalPayableTotal.textContent = grandTotalEl.textContent;
      }
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {
      e.preventDefault();
      playFeedbackSound("success");

      const cart = getStoredCart();
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      let discountAmount = 0;
      if (appliedCoupon) {
        discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      }
      const finalTotal = Math.max(0, subtotal - discountAmount + DELIVERY_FEE);

      const orderId = "MZB-" + Math.floor(1000 + Math.random() * 9000);
      const custName = document.getElementById("custName").value.trim();
      const custPhone = document.getElementById("custPhone").value.trim();
      const orderType = document.getElementById("custOrderType").value;
      const custAddress = document.getElementById("custAddress").value.trim() || "Dine-in / Pickup";
      const paymentMethod = document.getElementById("custPayment").value;
      const notes = document.getElementById("custNotes").value.trim() || "-";

      const newOrder = {
        id: orderId,
        customerName: custName,
        phone: custPhone,
        orderType: orderType,
        address: custAddress,
        paymentMethod: paymentMethod,
        notes: notes,
        items: cart,
        subtotal: subtotal,
        discount: discountAmount,
        deliveryFee: DELIVERY_FEE,
        total: finalTotal,
        status: "Pending",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
      };

      // Store in localStorage for Admin Panel
      const orders = JSON.parse(localStorage.getItem("meerzaib_orders") || "[]");
      orders.unshift(newOrder);
      localStorage.setItem("meerzaib_orders", JSON.stringify(orders));

      // Clear Cart
      localStorage.removeItem("meerzaib_cart");
      updateCartUI();
      renderMenu();

      // Close Checkout Modal & Open Success Celebration
      closeModal("checkoutModal");

      document.getElementById("successOrderId").textContent = "#" + orderId;
      document.getElementById("successCustomerName").textContent = custName;
      document.getElementById("successOrderTotal").textContent = `Rs. ${finalTotal.toLocaleString()}`;

      openModal("orderSuccessModal");
      checkoutForm.reset();
    });
  }

  // Coupon Apply
  const applyCouponBtn = document.getElementById("applyCouponBtn");
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", () => {
      const codeInput = document.getElementById("couponCodeInput");
      const badge = document.getElementById("couponAppliedBadge");
      const code = codeInput.value.trim().toUpperCase();

      if (code === "MEERZAIB10") {
        appliedCoupon = { code: "MEERZAIB10", discountPercent: 10 };
        if (badge) {
          badge.style.display = "block";
          badge.textContent = "✨ Promo Code 'MEERZAIB10' Applied: 10% OFF!";
        }
        showToast("🎉 Promo code applied! Enjoy 10% off your feast.", "success");
        updateCartUI();
      } else if (code === "") {
        showToast("Please enter a coupon code.", "danger");
      } else {
        showToast("Invalid promo code. Try MEERZAIB10", "danger");
      }
    });
  }
}

// ==========================================================
// REVIEWS
// ==========================================================
function renderReviews() {
  const container = document.getElementById("reviewsContainer");
  if (!container) return;

  const reviews = getStoredReviews();
  container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">
        ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
      </div>
      <p class="review-quote">"${r.text}"</p>
      <div class="review-author-wrap">
        <div class="author-avatar">${r.name.charAt(0)}</div>
        <div class="author-meta">
          <h5>${r.name}</h5>
          <span>Favorite: ${r.dish || "Royal Banquet"}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function initReviewForm() {
  const openBtn = document.getElementById("openReviewModalBtn");
  const form = document.getElementById("reviewForm");
  const starContainer = document.getElementById("starRatingSelect");

  if (openBtn) {
    openBtn.addEventListener("click", () => openModal("reviewModal"));
  }

  if (starContainer) {
    const stars = starContainer.querySelectorAll(".star");
    const input = document.getElementById("reviewRatingInput");
    stars.forEach(star => {
      star.addEventListener("click", () => {
        const rating = parseInt(star.getAttribute("data-rating"));
        input.value = rating;
        stars.forEach(s => {
          const r = parseInt(s.getAttribute("data-rating"));
          if (r <= rating) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });
      });
    });
  }

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      playFeedbackSound("success");

      const author = document.getElementById("reviewAuthor").value.trim();
      const rating = parseInt(document.getElementById("reviewRatingInput").value) || 5;
      const dish = document.getElementById("reviewDish").value.trim() || "Special BBQ";
      const text = document.getElementById("reviewText").value.trim();

      const newRev = { name: author, rating, dish, text };
      const reviews = getStoredReviews();
      reviews.unshift(newRev);
      localStorage.setItem("meerzaib_reviews", JSON.stringify(reviews));

      renderReviews();
      closeModal("reviewModal");
      form.reset();
      showToast("Thank you for your valuable royal review!", "success");
    });
  }
}

// ==========================================================
// MODAL CONTROLLERS
// ==========================================================
function openModal(id) {
  playFeedbackSound("click");
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("active");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("active");
}

// ==========================================================
// TOAST NOTIFICATIONS
// ==========================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : type === "danger" ? "toast-danger" : ""}`;
  
  let icon = '<i class="fa-solid fa-bell highlight-gold"></i>';
  if (type === "success") icon = '<i class="fa-solid fa-circle-check" style="color:var(--emerald-accent)"></i>';
  if (type === "danger") icon = '<i class="fa-solid fa-triangle-exclamation" style="color:var(--ruby-accent)"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================
// FILTERS & SEARCH
// ==========================================================
function initMenuFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      renderMenu();
    });
  });

  const searchInput = document.getElementById("menuSearchInput");
  const clearBtn = document.getElementById("clearSearchBtn");
  const searchToggle = document.getElementById("searchToggle");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = currentSearch ? "block" : "none";
      }
      renderMenu();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      currentSearch = "";
      clearBtn.style.display = "none";
      renderMenu();
    });
  }

  if (searchToggle) {
    searchToggle.addEventListener("click", () => {
      const menuSection = document.getElementById("menu");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 600);
        }
      }
    });
  }
}

function resetMenuFilters() {
  currentCategory = "all";
  currentSearch = "";
  const searchInput = document.getElementById("menuSearchInput");
  if (searchInput) searchInput.value = "";
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(b => {
    if (b.getAttribute("data-category") === "all") {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });
  renderMenu();
}

// Mobile Hamburger Menu
function initMobileMenu() {
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
}

// Navbar scroll styling
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
});

// Window Onload Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderSpecials();
  renderMenu();
  renderReviews();
  updateCartUI();
  initMenuFilters();
  initReservation();
  initCheckout();
  initReviewForm();
  initMobileMenu();
  attachRippleEffect();

  // Cart Drawer Listeners
  const cartTrigger = document.getElementById("cartTrigger");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartTrigger) cartTrigger.addEventListener("click", toggleCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", toggleCart);
  if (cartOverlay) cartOverlay.addEventListener("click", toggleCart);
});
