const API_BASE_URL = '/api';
const APP_NAME = "Campuswolf";
const root = document.getElementById('app-root');
const toastContainer = document.getElementById('toast-container');
const modalContainer = document.getElementById('modal-container');

// --- STATE MANAGEMENT ---
let state = {
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
    cart: [],
    selectedShopId: null,
};

// --- ICONS ---
const icons = {
    motorcycle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10"><circle cx="6" cy="18" r="3"></circle><circle cx="19" cy="18" r="3"></circle><path d="M6 15h11l2-7h-3.4"></path><path d="m11 5 3 3"></path><path d="M12 15a3 3 0 0 0 3-3V5h2"></path></svg>`,
    package: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10"><path d="M12.89 1.45a2 2 0 0 0-1.78 0L2.39 6.22a2 2 0 0 0-1.1 1.79v8.05a2 2 0 0 0 1.1 1.79l8.72 4.77a2 2 0 0 0 1.78 0l8.72-4.77a2 2 0 0 0 1.1-1.79v-8.05a2 2 0 0 0-1.1-1.79L12.89 1.45z"></path><polyline points="2.39 6.22 12 11.25 21.61 6.22"></polyline><line x1="12" y1="22.75" x2="12" y2="11.25"></line><line x1="17.2" y1="8.6" x2="7" y2="3.7"></line></svg>`,
    store: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7H2"></path></svg>`,
    logout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    cart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 group-hover:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
};

// --- UI HELPERS ---
const showToast = (message, type = 'info') => {
    const themes = {
        success: { bg: 'bg-green-500/10 border-green-500/50', text: 'text-green-300' },
        error: { bg: 'bg-red-500/10 border-red-500/50', text: 'text-red-300' },
        info: { bg: 'bg-sky-500/10 border-sky-500/50', text: 'text-sky-300' },
    };
    const theme = themes[type];
    const toast = document.createElement('div');
    toast.className = `flex items-center p-4 rounded-lg border backdrop-blur-sm shadow-lg max-w-sm w-full transition-all duration-300 opacity-0 translate-x-full ${theme.bg}`;
    toast.innerHTML = `
        <div class="ml-3 text-sm font-medium ${theme.text}">${message}</div>
        <button class="toast-close ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10">
            &times;
        </button>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.remove('opacity-0', 'translate-x-full'), 10);
    const close = () => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    };
    setTimeout(close, 4700);
    toast.querySelector('.toast-close').addEventListener('click', close);
};

const showModal = (title, content, on_close = () => {}) => {
    modalContainer.innerHTML = `
    <div class="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
      <div class="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md m-4 transform transition-all duration-300 scale-95">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-white">${title}</h2>
          <button class="modal-close text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div>${content}</div>
      </div>
    </div>`;
    modalContainer.querySelector('.modal-close').addEventListener('click', () => {
        modalContainer.innerHTML = '';
        on_close();
    });
    modalContainer.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
             modalContainer.innerHTML = '';
             on_close();
        }
    });
};

const renderSpinner = () => `<div class="flex justify-center items-center h-64"><div class="border-gray-500 h-20 w-20 animate-spin rounded-full border-8 border-t-sky-500"></div></div>`;

// --- AUTH & API ---
const apiFetch = async (endpoint, options = {}) => {
    options.headers = { 'Content-Type': 'application/json', ...options.headers };
    if (state.token) {
        options.headers['Authorization'] = `Bearer ${state.token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
};

const auth = {
    async login(email, password, role) {
        const { user, token } = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
        });
        state.user = user;
        state.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    },
    async register(name, email, password, mobile) {
        const { user, token } = await apiFetch('/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, mobile, role: 'student' }),
        });
        state.user = user;
        state.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    },
    logout() {
        state.user = null;
        state.token = null;
        state.cart = [];
        localStorage.clear();
        router.navigate('/login.html');
    },
    isAuthenticated: () => !!state.token,
};

// --- ROUTER & PAGE RENDERING ---
const router = {
    navigate: (path) => {
        window.location.href = path;
    },
    render: () => {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') {
            document.title = "Campuswolf";
            if (auth.isAuthenticated()) return router.navigate('/dashboard.html');
            renderLandingPage();
        } else if (path === '/login.html') {
            document.title = "Login - Campuswolf";
            if (auth.isAuthenticated()) return router.navigate('/dashboard.html');
            renderLoginPage();
        } else if (path === '/dashboard.html') {
            document.title = "Dashboard - Campuswolf";
            if (!auth.isAuthenticated()) return router.navigate('/login.html');
            renderDashboard();
        }
    }
};

const renderHeader = (title) => {
    return `
    <header class="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <div>
            <h1 class="text-2xl font-bold text-white tracking-tighter">
              <span class="text-sky-400">${APP_NAME}</span> ${title ? `/ ${title}` : ''}
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-right">
              ${icons.user}
              <div>
                <p class="font-semibold text-white">${state.user.name}</p>
                <p class="text-xs text-gray-400 capitalize">${state.user.role}</p>
              </div>
            </div>
            <button id="logout-btn" class="p-2 text-gray-400 hover:text-white transition-colors">${icons.logout}</button>
          </div>
        </div>
      </div>
    </header>`;
};

// Landing Page
const renderLandingPage = () => {
    root.innerHTML = `
    <div class="min-h-screen bg-black text-white overflow-x-hidden">
      <div class="absolute top-0 left-0 w-full h-full bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
      <header class="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tighter">${APP_NAME}</h1>
        <a href="/login.html" class="px-6 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black bg-sky-500 hover:bg-sky-600 text-white">Login / Sign Up</a>
      </header>
      <main class="relative z-10">
        <section class="container mx-auto px-6 pt-24 pb-32 text-center">
          <h2 class="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Your Campus Cravings, Delivered.
          </h2>
          <p class="max-w-2xl mx-auto text-lg text-gray-400 mb-10">
            From late-night snacks to essential supplies, ${APP_NAME} connects you to local shops outside campus, delivered right to your hostel.
          </p>
          <a href="/login.html" class="px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black bg-sky-500 hover:bg-sky-600 text-white">
            Start Ordering
          </a>
        </section>
        <section class="container mx-auto px-6 py-24">
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl text-center backdrop-blur-lg">
                    <div class="flex justify-center items-center mb-4 text-sky-400">${icons.store}</div>
                    <h3 class="text-xl font-bold text-white mb-2">All Your Local Favorites</h3>
                    <p class="text-gray-400">Browse a wide variety of shops and items, all in one place.</p>
                </div>
                <div class="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl text-center backdrop-blur-lg">
                    <div class="flex justify-center items-center mb-4 text-sky-400">${icons.package}</div>
                    <h3 class="text-xl font-bold text-white mb-2">Simple & Transparent</h3>
                    <p class="text-gray-400">Place orders easily and get price quotes directly from the shopkeeper.</p>
                </div>
                <div class="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl text-center backdrop-blur-lg">
                    <div class="flex justify-center items-center mb-4 text-sky-400">${icons.motorcycle}</div>
                    <h3 class="text-xl font-bold text-white mb-2">Fast & Reliable Delivery</h3>
                    <p class="text-gray-400">Track your order in real-time as our delivery partners bring it to you.</p>
                </div>
            </div>
        </section>
      </main>
      <footer class="relative z-10 text-center py-8 border-t border-gray-800 text-gray-500">
        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      </footer>
    </div>`;
};


// Login/Register Page
const renderLoginPage = (view = 'login') => {
    const loginForm = `
        <h1 class="text-3xl font-bold text-center text-white mb-2">${APP_NAME} Login</h1>
        <p class="text-center text-gray-400 mb-8">Welcome! Select your role to continue.</p>
        <form id="login-form">
          <div class="space-y-6">
             <input name="email" type="email" required placeholder="e.g., alice@campus.edu" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500">
             <input name="password" type="password" required placeholder="••••••••" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500">
             <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
              <div class="grid grid-cols-2 gap-3" id="role-selector">
                <button type="button" data-role="student" class="role-btn px-4 py-3 text-sm font-semibold rounded-lg border-2 bg-sky-500 border-sky-500 text-white">Student</button>
                <button type="button" data-role="shopkeeper" class="role-btn px-4 py-3 text-sm font-semibold rounded-lg border-2 bg-gray-800 border-gray-700 text-gray-300">Shopkeeper</button>
                <button type="button" data-role="delivery" class="role-btn px-4 py-3 text-sm font-semibold rounded-lg border-2 bg-gray-800 border-gray-700 text-gray-300">Delivery Partner</button>
                <button type="button" data-role="admin" class="role-btn px-4 py-3 text-sm font-semibold rounded-lg border-2 bg-gray-800 border-gray-700 text-gray-300">Admin</button>
              </div>
            </div>
            <button type="submit" class="w-full px-6 py-3 font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white">Login</button>
          </div>
        </form>
         <p class="text-center text-sm text-gray-400 mt-6">Don't have an account? <button id="show-register" class="font-semibold text-sky-400 hover:text-sky-300">Create a new one</button></p>
    `;
    const registerForm = `
        <h1 class="text-3xl font-bold text-center text-white mb-2">Create a Student Account</h1>
        <p class="text-center text-gray-400 mb-8">Join ${APP_NAME} to start ordering!</p>
        <form id="register-form">
          <div class="space-y-6">
            <input name="name" type="text" required placeholder="Full Name" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <input name="email" type="email" required placeholder="Email Address" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <input name="mobile" type="tel" required placeholder="Mobile Number" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <input name="password" type="password" required placeholder="Password" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <button type="submit" class="w-full px-6 py-3 font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white">Sign Up</button>
          </div>
        </form>
        <p class="text-center text-sm text-gray-400 mt-6">Already have an account? <button id="show-login" class="font-semibold text-sky-400 hover:text-sky-300">Login here</button></p>
    `;
    root.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-black p-4 bg-grid-gray-700/[0.2]">
      <div class="w-full max-w-md bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-lg">
        <a href="/" class="text-sm text-gray-400 hover:text-white mb-6 block">&larr; Back to Home</a>
        <div id="auth-form-container">${view === 'login' ? loginForm : registerForm}</div>
      </div>
    </div>`;
    
    addLoginListeners();
};

const addLoginListeners = () => {
    // Toggle forms
    const showRegisterBtn = document.getElementById('show-register');
    if (showRegisterBtn) showRegisterBtn.addEventListener('click', () => renderLoginPage('register'));
    const showLoginBtn = document.getElementById('show-login');
    if (showLoginBtn) showLoginBtn.addEventListener('click', () => renderLoginPage('login'));
    
    // Login form
    const loginFormEl = document.getElementById('login-form');
    if (loginFormEl) {
        let selectedRole = 'student';
        const roleSelector = document.getElementById('role-selector');
        roleSelector.addEventListener('click', e => {
            if (e.target.matches('.role-btn')) {
                selectedRole = e.target.dataset.role;
                roleSelector.querySelectorAll('.role-btn').forEach(btn => {
                    btn.classList.remove('bg-sky-500', 'border-sky-500', 'text-white');
                    btn.classList.add('bg-gray-800', 'border-gray-700', 'text-gray-300');
                });
                e.target.classList.add('bg-sky-500', 'border-sky-500', 'text-white');
                e.target.classList.remove('bg-gray-800', 'border-gray-700', 'text-gray-300');
            }
        });

        loginFormEl.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const { email, password } = Object.fromEntries(formData.entries());
            try {
                await auth.login(email, password, selectedRole);
                showToast('Successfully logged in!', 'success');
                router.navigate('/dashboard.html');
            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }

    // Register form
    const registerFormEl = document.getElementById('register-form');
    if (registerFormEl) {
        registerFormEl.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const { name, email, mobile, password } = Object.fromEntries(formData.entries());
             if (password.length < 6) {
                showToast('Password must be at least 6 characters long.', 'error');
                return;
            }
            try {
                await auth.register(name, email, password, mobile);
                showToast('Registration successful! Welcome.', 'success');
                router.navigate('/dashboard.html');
            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }
};

// --- DASHBOARDS ---
const dashboardRenderers = {}; // To be populated with role-specific renderers

const renderDashboard = () => {
    const role = state.user.role;
    const renderer = dashboardRenderers[role];
    if (renderer) {
        renderer();
    } else {
        root.innerHTML = `<p>No dashboard available for role: ${role}</p>`;
    }
    // Add logout listener after header is rendered
    setTimeout(() => {
         const logoutBtn = document.getElementById('logout-btn');
         if (logoutBtn) logoutBtn.addEventListener('click', auth.logout);
    },0);
};

// -- STUDENT DASHBOARD --
dashboardRenderers.student = async () => {
    root.innerHTML = `
        ${renderHeader('Student')}
        <nav class="bg-gray-900 border-b border-gray-800">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div class="flex space-x-2" id="student-nav">
                    <button data-view="shops" class="px-4 py-3 text-sm font-medium border-b-2 border-sky-500 text-sky-400">Browse Shops</button>
                    <button data-view="tracking" class="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white">My Orders</button>
                </div>
                <div id="cart-indicator" class="flex items-center space-x-2 text-sky-400 hidden">
                    ${icons.cart}
                    <span id="cart-count">0 items</span>
                </div>
            </div>
        </nav>
        <main id="student-content" class="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">${renderSpinner()}</main>
        <footer id="student-footer" class="sticky bottom-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 p-4 hidden"></footer>
    `;

    const contentEl = document.getElementById('student-content');
    const navEl = document.getElementById('student-nav');
    
    const views = {
        shops: async () => {
            contentEl.innerHTML = renderSpinner();
            const shops = await apiFetch('/shops');
            contentEl.innerHTML = `
                <h2 class="text-3xl font-bold tracking-tighter text-white mb-6">Explore Shops</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${shops.map(shop => `
                        <div data-shop-id="${shop.id}" class="shop-card bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 group hover:border-sky-500/50 transition-all duration-300 cursor-pointer">
                            <img src="${shop.imageUrl}" alt="${shop.name}" class="w-full h-40 object-cover" />
                            <div class="p-5">
                                <h3 class="text-xl font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">${shop.name}</h3>
                                <p class="text-sm text-gray-400 mb-4">${shop.categories.join(' • ')}</p>
                                <div class="flex justify-between items-center text-sm text-sky-400">
                                    <span>View Menu</span>
                                    ${icons.chevronRight}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
            document.querySelectorAll('.shop-card').forEach(card => {
                card.addEventListener('click', e => {
                    state.selectedShopId = e.currentTarget.dataset.shopId;
                    switchView('menu');
                });
            });
        },
        menu: async () => {
            contentEl.innerHTML = renderSpinner();
            const { shop, products } = await apiFetch(`/shops/${state.selectedShopId}`);
            contentEl.innerHTML = `
                 <div class="mb-8">
                    <img src="${shop.imageUrl}" alt="${shop.name}" class="w-full h-48 object-cover rounded-2xl mb-4"/>
                    <h2 class="text-4xl font-extrabold tracking-tighter text-white">${shop.name}</h2>
                    <p class="text-gray-400">${shop.categories.join(' • ')}</p>
                </div>
                <div class="space-y-4">
                    ${products.map(p => `
                        <div class="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center space-x-4">
                            <img src="${p.imageUrl}" alt="${p.name}" class="w-24 h-24 object-cover rounded-lg"/>
                            <div class="flex-1">
                                <h4 class="font-bold text-white">${p.name}</h4>
                                <p class="text-sm text-gray-400 mb-2">${p.description}</p>
                                <p class="font-semibold text-white">${p.price ? `₹${p.price}` : 'Price on request'}</p>
                            </div>
                            <button data-product-id="${p.id}" data-product-name="${p.name}" data-product-price="${p.price}" class="add-to-cart-btn px-4 py-2 text-sm bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg">Add</button>
                        </div>
                    `).join('')}
                </div>
            `;
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => btn.addEventListener('click', e => {
                const { productId, productName, productPrice } = e.currentTarget.dataset;
                const existing = state.cart.find(i => i.productId === productId);
                if (existing) {
                    existing.quantity++;
                } else {
                    state.cart.push({ productId, name: productName, price: parseFloat(productPrice), quantity: 1 });
                }
                updateCartUI();
                showToast(`${productName} added to cart`, 'info');
            }));
            updateCartUI();
        },
        tracking: async () => {
            contentEl.innerHTML = renderSpinner();
            const orders = await apiFetch(`/student/orders/${state.user.id}`);
            const ORDER_STATUS_CLASSES = {
                'Waiting for Shop Confirmation': 'bg-yellow-500/10 text-yellow-400',
                'Rejected by Shop': 'bg-red-500/10 text-red-400',
                'Confirmed, Awaiting Delivery Partner': 'bg-cyan-500/10 text-cyan-400',
                'Delivery Partner Assigned': 'bg-blue-500/10 text-blue-400',
                'Out for Delivery': 'bg-indigo-500/10 text-indigo-400',
                'Delivered': 'bg-green-500/10 text-green-400',
                'Cancelled by Student': 'bg-gray-500/10 text-gray-400',
            };
            contentEl.innerHTML = `
                <h2 class="text-3xl font-bold tracking-tighter text-white mb-6">My Orders</h2>
                ${orders.length === 0 ? `<p class="text-center text-gray-400 py-10">You haven't placed any orders yet.</p>` : `
                <div class="space-y-6">
                    ${orders.map(order => `
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-white">${order.shopName}</h3>
                                <p class="text-sm text-gray-400">Order ID: ${order.id}</p>
                            </div>
                            <div class="text-xs font-bold px-3 py-1 rounded-full ${ORDER_STATUS_CLASSES[order.status]}">${order.status}</div>
                        </div>
                        <ul class="text-sm text-gray-300 list-disc list-inside mb-4">
                            ${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
                        </ul>
                        <div class="border-t border-gray-800 pt-4 flex justify-between items-center">
                            <div>
                                <p class="text-gray-400 text-sm">Total Price</p>
                                <p class="text-2xl font-bold text-white">${order.totalPrice ? `₹${order.totalPrice}` : 'Awaiting confirmation'}</p>
                            </div>
                            ${order.totalPrice ? `<button data-shop-id="${order.shopId}" class="show-qr-btn bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600">Pay with QR</button>` : ''}
                        </div>
                        ${order.deliveryBoyName ? `<div class="border-t border-gray-800 mt-4 pt-4 text-sm"><p class="text-gray-400">Delivery Partner: <span class="font-semibold text-white">${order.deliveryBoyName}</span></p></div>` : ''}
                    </div>
                    `).join('')}
                </div>
                `}`;
            document.querySelectorAll('.show-qr-btn').forEach(btn => btn.addEventListener('click', async e => {
                const shopId = e.currentTarget.dataset.shopId;
                const { shop } = await apiFetch(`/shops/${shopId}`);
                showModal('Scan to Pay Shop', `
                    <div class="p-4 flex flex-col items-center">
                        <img src="${shop.qrCodeUrl}" alt="Shop QR Code" class="w-64 h-64 rounded-lg mb-4"/>
                        <p class="text-gray-400 text-center">The delivery partner will verify the payment screenshot upon arrival.</p>
                    </div>`);
            }));
        }
    };

    const switchView = (view) => {
        navEl.querySelectorAll('button').forEach(btn => {
            if (btn.dataset.view === view) {
                btn.className = 'px-4 py-3 text-sm font-medium border-b-2 border-sky-500 text-sky-400';
            } else {
                btn.className = 'px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white';
            }
        });
        document.getElementById('student-footer').innerHTML = '';
        document.getElementById('student-footer').classList.add('hidden');
        views[view]();
    };

    const updateCartUI = () => {
        const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartIndicator = document.getElementById('cart-indicator');
        const studentFooter = document.getElementById('student-footer');
        if (cartCount > 0) {
            cartIndicator.classList.remove('hidden');
            document.getElementById('cart-count').textContent = `${cartCount} items`;
            studentFooter.classList.remove('hidden');
            studentFooter.innerHTML = `
             <div class="container mx-auto flex justify-between items-center">
                <p class="text-lg font-semibold">Ready to order?</p>
                <button id="place-order-btn" class="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-600">Place Order (${cartCount})</button>
            </div>`;
            document.getElementById('place-order-btn').addEventListener('click', async () => {
                try {
                    await apiFetch('/orders', {
                        method: 'POST',
                        body: JSON.stringify({ studentId: state.user.id, shopId: state.selectedShopId, items: state.cart })
                    });
                    showToast('Order placed successfully!', 'success');
                    state.cart = [];
                    updateCartUI();
                    switchView('tracking');
                } catch(err) {
                    showToast(`Order failed: ${err.message}`, 'error');
                }
            });
        } else {
            cartIndicator.classList.add('hidden');
            studentFooter.classList.add('hidden');
        }
    };
    
    navEl.addEventListener('click', e => {
        if(e.target.matches('button')) switchView(e.target.dataset.view);
    });

    switchView('shops');
};


// -- SHOPKEEPER DASHBOARD --
dashboardRenderers.shopkeeper = async () => {
     root.innerHTML = `
        ${renderHeader('Shopkeeper')}
        <main id="shop-content" class="container mx-auto p-4 sm:p-6 lg:p-8">${renderSpinner()}</main>
    `;

    const contentEl = document.getElementById('shop-content');
    
    const render = async () => {
        contentEl.innerHTML = renderSpinner();
        const orders = await apiFetch(`/shopkeeper/orders/${state.user.id}`);
        const ORDER_STATUS_CLASSES = { 'Waiting for Shop Confirmation': 'bg-yellow-500/10 text-yellow-400' };
        contentEl.innerHTML = `
            <h2 class="text-3xl font-bold tracking-tighter text-white mb-6">Incoming Orders</h2>
            ${orders.length === 0 ? `<p class="text-center text-gray-400 py-10">No new orders at the moment.</p>` : `
            <div class="space-y-6">
                ${orders.map(order => `
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white">Order from ${order.studentName}</h3>
                            <p class="text-sm text-gray-400">Order ID: ${order.id}</p>
                        </div>
                        <div class="text-xs font-bold px-3 py-1 rounded-full ${ORDER_STATUS_CLASSES[order.status] || 'bg-gray-500/10 text-gray-400'}">${order.status}</div>
                    </div>
                    <ul class="text-gray-300 list-disc list-inside mb-4">
                        ${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
                    </ul>
                    ${order.status === 'Waiting for Shop Confirmation' ? `
                    <div class="flex space-x-4">
                        <button data-order-id="${order.id}" class="confirm-btn bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg">Confirm</button>
                        <button data-order-id="${order.id}" class="reject-btn bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">Reject</button>
                    </div>` : ''}
                </div>
                `).join('')}
            </div>
            `}
        `;
        document.querySelectorAll('.reject-btn').forEach(btn => btn.addEventListener('click', async e => {
            const orderId = e.target.dataset.orderId;
            await apiFetch(`/orders/${orderId}/reject`, { method: 'PUT' });
            showToast('Order rejected', 'info');
            render();
        }));
        document.querySelectorAll('.confirm-btn').forEach(btn => btn.addEventListener('click', e => {
            const orderId = e.target.dataset.orderId;
            showModal('Confirm Order & Set Price', `
                <div class="space-y-4">
                    <p class="text-gray-400">Enter the final price for this order, including delivery.</p>
                    <input id="total-price-input" type="number" placeholder="e.g., 250" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3">
                    <button id="confirm-price-btn" class="w-full bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg">Confirm & Send</button>
                </div>
            `);
            document.getElementById('confirm-price-btn').addEventListener('click', async () => {
                const totalPrice = document.getElementById('total-price-input').value;
                if (!totalPrice || totalPrice <= 0) return showToast('Please enter a valid price', 'error');
                await apiFetch(`/orders/${orderId}/confirm`, { method: 'PUT', body: JSON.stringify({ totalPrice: Number(totalPrice) }) });
                showToast('Order confirmed!', 'success');
                modalContainer.innerHTML = '';
                render();
            });
        }));
    };
    setInterval(render, 5000);
    render();
};

// -- DELIVERY DASHBOARD --
dashboardRenderers.delivery = async () => {
    root.innerHTML = `
        ${renderHeader('Delivery Partner')}
        <nav class="bg-gray-900 border-b border-gray-800">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2" id="delivery-nav">
                <button data-view="available" class="px-4 py-3 text-sm font-medium border-b-2 border-sky-500 text-sky-400">Available for Pickup</button>
                <button data-view="my_deliveries" class="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white">My Deliveries</button>
            </div>
        </nav>
        <main id="delivery-content" class="container mx-auto p-4 sm:p-6 lg:p-8">${renderSpinner()}</main>
    `;
    const contentEl = document.getElementById('delivery-content');
    const navEl = document.getElementById('delivery-nav');
    let currentView = 'available';

    const render = async () => {
        contentEl.innerHTML = renderSpinner();
        const endpoint = currentView === 'available' ? '/delivery/available' : `/delivery/my-orders/${state.user.id}`;
        const orders = await apiFetch(endpoint);
         const ORDER_STATUS_CLASSES = {
            'Confirmed, Awaiting Delivery Partner': 'bg-cyan-500/10 text-cyan-400',
            'Delivery Partner Assigned': 'bg-blue-500/10 text-blue-400',
            'Out for Delivery': 'bg-indigo-500/10 text-indigo-400',
            'Delivered': 'bg-green-500/10 text-green-400',
        };

        const getAction = (order) => {
            if (currentView === 'available') {
                return `<button data-order-id="${order.id}" class="accept-btn bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg">Accept Delivery</button>`;
            }
            switch (order.status) {
                case 'Delivery Partner Assigned': // Picking Up
                    return `<button data-order-id="${order.id}" data-status="Out for Delivery" class="update-status-btn bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg">Mark as Picked Up</button>`;
                case 'Out for Delivery':
                     return `<div class="flex flex-col items-end gap-3">
                         <label class="flex items-center text-sm text-gray-300 cursor-pointer">
                            <input data-order-id="${order.id}" type="checkbox" class="payment-verified-check w-4 h-4 mr-2 bg-gray-700 border-gray-600 rounded text-sky-500 focus:ring-sky-500">
                            Payment Verified
                        </label>
                        <button data-order-id="${order.id}" data-status="Delivered" class="update-status-btn bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg" disabled>Mark as Delivered</button>
                    </div>`;
                case 'Delivered': return `<p class="text-green-400 font-semibold">Completed</p>`;
                default: return '';
            }
        };

        contentEl.innerHTML = `
            <h2 class="text-3xl font-bold tracking-tighter text-white mb-6">${currentView === 'available' ? 'Available Orders' : 'My Active Deliveries'}</h2>
            ${orders.length === 0 ? `<p class="text-center text-gray-400 py-10">No orders available right now.</p>` : `
            <div class="space-y-6">
                ${orders.map(order => `
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div><h3 class="text-xl font-bold text-white">Order for ${order.studentName}</h3><p class="text-sm text-gray-400">From: ${order.shopName}</p></div>
                        <div class="text-xs font-bold px-3 py-1 rounded-full ${ORDER_STATUS_CLASSES[order.status]}">${order.status}</div>
                    </div>
                    <div class="border-t border-gray-800 pt-4 flex justify-between items-center">
                        <p class="text-lg font-bold text-white">Total: ₹${order.totalPrice}</p>
                        ${getAction(order)}
                    </div>
                </div>
                `).join('')}
            </div>
            `}
        `;
        addDeliveryListeners();
    };

    const addDeliveryListeners = () => {
        document.querySelectorAll('.accept-btn').forEach(btn => btn.addEventListener('click', async e => {
            await apiFetch(`/orders/${e.target.dataset.orderId}/accept`, { method: 'PUT', body: JSON.stringify({ deliveryBoyId: state.user.id }) });
            showToast('Delivery accepted!', 'success');
            render();
        }));
        document.querySelectorAll('.update-status-btn').forEach(btn => btn.addEventListener('click', async e => {
            const orderId = e.target.dataset.orderId;
            const paymentCheckbox = document.querySelector(`input.payment-verified-check[data-order-id="${orderId}"]`);
            const paymentVerified = paymentCheckbox ? paymentCheckbox.checked : undefined;
            await apiFetch(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status: e.target.dataset.status, paymentVerified }) });
            showToast('Order status updated!', 'success');
            render();
        }));
        document.querySelectorAll('.payment-verified-check').forEach(box => box.addEventListener('change', e => {
            const deliverButton = document.querySelector(`button.update-status-btn[data-order-id="${e.target.dataset.orderId}"]`);
            if (deliverButton) deliverButton.disabled = !e.target.checked;
        }));
    };

    navEl.addEventListener('click', e => {
        if(e.target.matches('button')) {
            currentView = e.target.dataset.view;
            navEl.querySelectorAll('button').forEach(btn => {
                btn.className = 'px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white';
            });
            e.target.className = 'px-4 py-3 text-sm font-medium border-b-2 border-sky-500 text-sky-400';
            render();
        }
    });

    setInterval(render, 5000);
    render();
};

// -- ADMIN DASHBOARD --
dashboardRenderers.admin = async () => {
    root.innerHTML = `
        ${renderHeader('Admin')}
        <nav class="bg-gray-900 border-b border-gray-800">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2" id="admin-nav">
                <button data-view="dashboard" class="px-4 py-3 text-sm font-medium border-b-2 border-sky-500 text-sky-400">Dashboard</button>
                <button data-view="orders" class="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white">Manage Orders</button>
                <button data-view="users" class="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white">Manage Users</button>
            </div>
        </nav>
        <main id="admin-content" class="container mx-auto p-4 sm:p-6 lg:p-8">${renderSpinner()}</main>
    `;
    
    const contentEl = document.getElementById('admin-content');
    const navEl = document.getElementById('admin-nav');
    
    const fetchData = async () => Promise.all([apiFetch('/admin/orders'), apiFetch('/admin/users')]);
    
    const renderOrdersTable = (orders) => {
        const ORDER_STATUS_CLASSES = { 'Delivered': 'bg-green-500/10 text-green-400' };
        return `<div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto"><table class="min-w-full divide-y divide-gray-800">
            <thead class="bg-gray-800"><tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Student</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Shop</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
            </tr></thead>
            <tbody class="divide-y divide-gray-800">
            ${orders.map(o => `<tr>
                <td class="px-6 py-4 text-sm text-gray-400">${o.id}</td>
                <td class="px-6 py-4 text-sm text-white">${o.studentName}</td>
                <td class="px-6 py-4 text-sm text-white">${o.shopName}</td>
                <td class="px-6 py-4 text-sm text-white">₹${o.totalPrice || '...'}</td>
                <td class="px-6 py-4 text-sm"><span class="px-2 inline-flex text-xs font-semibold rounded-full ${ORDER_STATUS_CLASSES[o.status] || 'bg-yellow-500/10 text-yellow-400'}">${o.status}</span></td>
            </tr>`).join('')}
            </tbody></table></div>`;
    };
     const renderUsersTable = (users) => `
        <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto"><table class="min-w-full divide-y divide-gray-800">
            <thead class="bg-gray-800"><tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Mobile</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
            </tr></thead>
            <tbody class="divide-y divide-gray-800">
            ${users.map(u => `<tr>
                <td class="px-6 py-4 text-sm text-white">${u.name}</td>
                <td class="px-6 py-4 text-sm text-white">${u.email}</td>
                <td class="px-6 py-4 text-sm text-white">${u.mobile || 'N/A'}</td>
                <td class="px-6 py-4 text-sm text-sky-400 capitalize">${u.role}</td>
            </tr>`).join('')}
            </tbody></table></div>`;

    const views = {
        dashboard: async () => {
            const [orders, users] = await fetchData();
            contentEl.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6"><p class="text-sm text-gray-400 mb-1">Total Orders</p><p class="text-3xl font-bold text-white">${orders.length}</p></div>
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6"><p class="text-sm text-gray-400 mb-1">Total Users</p><p class="text-3xl font-bold text-white">${users.length}</p></div>
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6"><p class="text-sm text-gray-400 mb-1">Total Revenue</p><p class="text-3xl font-bold text-white">₹${orders.reduce((s, o) => s + (o.totalPrice || 0), 0)}</p></div>
                </div>
                <h3 class="text-2xl font-bold tracking-tighter text-white mt-10 mb-6">Recent Orders</h3>
                ${renderOrdersTable(orders)}`;
        },
        orders: async () => {
            const [orders] = await fetchData();
            contentEl.innerHTML = `<h2 class="text-3xl font-bold tracking-tighter text-white mb-6">Manage Orders</h2>${renderOrdersTable(orders)}`;
        },
        users: async () => {
            const [, users] = await fetchData();
            contentEl.innerHTML = `<div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold tracking-tighter text-white">Manage Users</h2>
                <button id="create-user-btn" class="bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg">Create New User</button>
            </div>${renderUsersTable(users)}`;
            document.getElementById('create-user-btn').addEventListener('click', () => {
                showModal('Create New User', `
                    <form id="create-user-form" class="space-y-4">
                        <input name="name" required placeholder="Full Name" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3">
                        <input name="email" type="email" required placeholder="Email" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3">
                        <input name="mobile" type="tel" required placeholder="Mobile" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3">
                        <input name="password" type="password" required placeholder="Password" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3">
                        <select name="role" class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3"><option value="shopkeeper">Shopkeeper</option><option value="delivery">Delivery</option></select>
                        <button type="submit" class="w-full bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg">Create User</button>
                    </form>
                `, () => switchView('users'));
                document.getElementById('create-user-form').addEventListener('submit', async e => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(e.target).entries());
                    try {
                        await apiFetch('/admin/users', {method: 'POST', body: JSON.stringify(data)});
                        showToast('User created!', 'success');
                        modalContainer.innerHTML = '';
                        switchView('users');
                    } catch(err) { showToast(err.message, 'error'); }
                });
            });
        }
    };

    const switchView = (view) => {
        navEl.querySelectorAll('button').forEach(btn => btn.className = 'px-4 py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white');
        navEl.querySelector(`[data-view=${view}]`).className = 'px-4 py-3 text-sm font-medium border-b-2 border-sky-500 text-sky-400';
        contentEl.innerHTML = renderSpinner();
        views[view]();
    };
    navEl.addEventListener('click', e => { if(e.target.matches('button')) switchView(e.target.dataset.view); });
    switchView('dashboard');
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', router.render);
