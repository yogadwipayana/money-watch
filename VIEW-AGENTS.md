# AGENT.md - Stock Portfolio Management System

## Deskripsi Proyek
Aplikasi manajemen portfolio saham dengan multi-broker support menggunakan Astro framework.

## Tech Stack
- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Backend**: External REST API (Node.js/Express/Laravel)
- **Database**: PostgreSQL (managed by backend)
- **Authentication**: JWT Bearer Token
- **State Management**: Astro built-in (props & server-side rendering)

---

## Struktur Halaman & Routing

### 1. `/login` - Halaman Login
**Komponen**: `src/pages/login.astro`

**UI Elements**:
- Logo aplikasi di tengah atas
- Form login dengan:
  - Input email/username
  - Input password (dengan toggle show/hide)
  - Checkbox "Remember me"
  - Button "Login" (hijau, full width)
  - Link "Forgot password?"
  - Link "Don't have account? Register"
- Background: Navy dark (#1a202c atau similar)
- Card: Semi-transparent dengan backdrop blur

**Validasi**:
- Email format validation
- Required fields
- Error message display

---

### 2. `/register` - Halaman Register
**Komponen**: `src/pages/register.astro`

**UI Elements**:
- Logo aplikasi di tengah atas
- Form register dengan:
  - Input full name
  - Input email
  - Input password (dengan strength indicator)
  - Input confirm password
  - Checkbox "Agree to Terms & Conditions"
  - Button "Register" (hijau, full width)
  - Link "Already have account? Login"
- Background: Navy dark
- Card: Semi-transparent dengan backdrop blur

**Validasi**:
- Email format & uniqueness
- Password strength (min 8 chars, 1 uppercase, 1 number)
- Password confirmation match
- Terms acceptance required

---

### 3. `/dashboard` - Dashboard Utama
**Komponen**: `src/pages/dashboard.astro`

**Design Reference**: Mirip dengan Mercury/Mobbin dashboard - clean, modern, dengan sidebar navigation

**Layout**: 
- **Sidebar (Kiri)**: Fixed width 240px
  - Logo + brand name di atas
  - Main Navigation:
    - Home (dengan icon home)
    - Dashboard (aktif - dengan background highlight)
    - Brokers (dengan icon briefcase)
  - Section "Quick Actions":
    - Add Broker
    - View All Transactions
  - User profile di bawah (avatar + name + settings icon)

- **Main Content Area**:
  - **Top Header Bar**:
    - Search bar global dengan icon (placeholder: "Search for anything" dengan shortcut ⌘ K)
    - Quick action buttons: "Move Money" dropdown
    - Notification icon dengan badge (jika ada notif)
    - Theme toggle (Sun/Moon icon untuk light/dark mode)
    - User avatar dengan dropdown

  - **Welcome Section**:
    - "Welcome," heading
    - Action buttons horizontal scroll/wrap:
      - Add Broker (primary blue)
      - Add Transaction
      - View Reports
      - Settings

  - **Portfolio Summary Card** (opsional, bisa di atas grid):
    - Total portfolio value across all brokers
    - Today's change (dengan percentage dan chart mini)
    - Filter dropdown "Last 30 days"

**UI Elements**:
- Grid cards (responsive: 1 col mobile, 2 cols tablet, 3 cols desktop)
- Cards dengan shadow lebih subtle, border radius 16px

**Broker Card** (untuk setiap broker):
- Background: White (light mode) / Dark card (dark mode)
- Border: Subtle 1px border
- Border radius: 16px
- Hover effect: Subtle lift (translateY -2px) + shadow
- Arrow icon kanan atas dalam circle button
- Content:
  - **Broker Name** (heading text-xl font-semibold)
  - Icon broker (circular badge dengan initial atau logo)
  - **Total Equity** label (text-sm text-gray-500)
  - **Rp XX.XXX.XXX** (nilai total equity, text-2xl font-bold)
  - Divider line
  - **Cash** dan **Invested** (2 kolom dalam card footer):
    - Label text-xs uppercase text-gray-400
    - Nilai rupiah text-sm font-semibold
  - Sparkline chart mini (opsional) untuk trend

**Add Broker Modal**:
- Backdrop blur-sm
- Modal slide from bottom (mobile) atau center scale (desktop)
- Form fields dengan floating labels:
  - Broker Name (text input, required)
  - Cash Balance (number input, format Rupiah dengan currency mask, required)
  - Initial Investment Date (date picker, opsional)
- Button group:
  - "Cancel" (ghost button)
  - "Add Broker" (primary blue)

**Theme System**:
- Light mode:
  - Background: gray-50/white
  - Cards: white dengan shadow-sm
  - Text: gray-900/gray-600
  - Border: gray-200
- Dark mode:
  - Background: #1a202c
  - Cards: #2d3748
  - Text: white/gray-300
  - Border: gray-700

**Perhitungan**:
```
Total Equity = Cash Balance + Total Invested
Total Invested = Sum of (Stock Quantity × Current Price) for all stocks
```

---

### 4. `/broker/[brokerName]` - Detail Broker
**Komponen**: `src/pages/broker/[brokerName].astro`

**Layout**:
- Header navbar sama seperti dashboard
- 2 cards section (kiri & kanan atau stack di mobile)
- Stock list table/cards

**Left Card - Portfolio Summary**:
- Background: Dark card
- **Portofolio** heading
- **Rp X.XXX.XXX** (total portfolio value)
- **Return Today**: Rp X (X.XX%)
  - Warna hijau jika positif, merah jika negatif

**Right Card - Financial Details**:
- Background: Dark card
- 4 data points dalam grid 2×2:
  - **Cash**: Rp X.XXX.XXX
  - **Invested**: Rp X.XXX.XXX
  - **P&L** (Profit & Loss): Rp X.XXX.XXX
  - **Profit**: XX.XX%
- Color coding: hijau untuk profit, merah untuk loss

**Action Buttons** (posisi atas kanan):
- "Add Transaction" (hijau)
- "Remove stockbit" (merah) - untuk hapus broker

**Stock List Section**:
- Table atau cards untuk setiap saham
- Columns/Fields:
  - **Stock Code** (e.g., BBRI)
  - **Total Value**: Rp X.XXX.XXX
  - **P&L**: Rp X.XXX.XXX (XX%)
  - **Quantity**: X.XXX | Avg X.XXX
  - **Return Today**: X (X.XX%)
- Clickable row → redirect ke `/broker/[brokerName]/[stockCode]`

**Add Transaction Modal**:
- Trigger: Click "Add Transaction"
- Form fields:
  - **Transaction Type**: Radio/Select (Buy, Sell, Deposit, Withdrawal)
  - **Date**: Date picker (default today)
  - **Stock Code**: Text input (hanya untuk Buy/Sell, disabled untuk Deposit/Withdrawal)
  - **Quantity**: Number input (untuk Buy/Sell)
  - **Price**: Number input (untuk Buy/Sell)
  - **Amount**: Number input (untuk Deposit/Withdrawal)
  - **Notes**: Textarea (optional)
- Button "Cancel" & "Add Transaction"

**Remove Broker Confirmation**:
- Trigger: Click "Remove stockbit"
- Confirmation dialog:
  - Warning message
  - "Are you sure? This will delete all stocks and transactions"
  - Button "Cancel" & "Delete Broker" (merah)

---

### 5. `/broker/[brokerName]/transaction` - Transaction History
**Komponen**: `src/pages/broker/[brokerName]/transaction.astro`

**Layout**:
- Header navbar
- Filter section
- Transaction list

**Filter Section** (horizontal layout):
- **Search**: Input untuk cari stock code
- **Date Range**: 
  - Start date picker
  - End date picker
- **Category Filter**: Dropdown/Select
  - All
  - Buy
  - Sell
  - Deposit
  - Withdrawal
- **Apply Button** (hijau)

**Transaction List**:
- Table atau cards (responsive)
- Columns:
  - **Date**: DD/MM/YYYY HH:mm
  - **Type**: Badge dengan warna (Buy=biru, Sell=orange, Deposit=hijau, Withdrawal=merah)
  - **Stock Code**: Ticker symbol (kosong untuk Deposit/Withdrawal)
  - **Quantity**: Jumlah lot/shares
  - **Price**: Harga per unit (untuk Buy/Sell)
  - **Amount**: Total nilai transaksi
  - **Notes**: Catatan transaksi
  - **Actions**: 
    - Edit icon (optional)
    - Delete icon (dengan confirmation)

**Sorting**:
- Default: Tanggal descending (terbaru di atas)
- Clickable column headers untuk sorting

---

## Business Logic & Calculations

### Portfolio Value Calculation
```javascript
// Total Portfolio = Cash + Total Invested
totalPortfolio = broker.cash_balance + getTotalInvested(broker.id)

// Total Invested = Sum of all stock positions
totalInvested = stocks.reduce((sum, stock) => {
  return sum + (stock.quantity * stock.current_price * 100) // *100 untuk lot
}, 0)
```

### P&L (Profit & Loss) Calculation
```javascript
// Per Stock
stockPL = (current_price - average_price) * quantity * 100

// Total P&L
totalPL = stocks.reduce((sum, stock) => {
  return sum + ((stock.current_price - stock.average_price) * stock.quantity * 100)
}, 0)

// Profit Percentage
profitPercent = (totalPL / totalInvested) * 100
```

### Average Price Calculation (saat transaksi)
```javascript
// Buy Transaction
newAvgPrice = ((currentQty * currentAvgPrice) + (buyQty * buyPrice)) / (currentQty + buyQty)
newQuantity = currentQty + buyQty

// Sell Transaction
newQuantity = currentQty - sellQty
// Average price tetap sama
```

### Cash Balance Update
```javascript
// Buy: Kurangi cash
newCash = currentCash - (buyPrice * buyQty * 100)

// Sell: Tambah cash
newCash = currentCash + (sellPrice * sellQty * 100)

// Deposit: Tambah cash
newCash = currentCash + depositAmount

// Withdrawal: Kurangi cash
newCash = currentCash - withdrawalAmount
```

---

## Komponen Reusable

### 1. `Sidebar.astro`
- Fixed width 240px (desktop), drawer di mobile
- Props: currentPath (untuk active state)
- Sections: Main nav, Quick actions, User profile
- Collapse/expand functionality

### 2. `Navbar.astro` (Top Header)
- Props: user, notifications
- Components: Search bar, action buttons, theme toggle, user menu
- Sticky positioning dengan blur backdrop

### 3. `Button.astro`
Props: 
- variant (primary/secondary/danger/ghost/outline)
- size (sm/md/lg)
- disabled, loading, icon
- fullWidth

### 4. `Card.astro`
Props: 
- variant (default/bordered/elevated)
- padding (sm/md/lg)
- hover (boolean)
- clickable (boolean)

### 5. `Modal.astro`
Props: 
- isOpen, title, size (sm/md/lg/xl/full)
- onClose, closeOnBackdrop
Slots: 
- header (custom header)
- default (content)
- footer (actions)

### 6. `Input.astro`
Props: 
- type, label, error, required
- placeholder, helper text
- prefix icon, suffix icon
- disabled, readonly

### 7. `Select.astro`
Props: 
- label, options, value
- error, required, placeholder
- multiple, searchable

### 8. `DatePicker.astro`
Props:
- label, value, error
- minDate, maxDate
- format (DD/MM/YYYY)
- presets (array of preset ranges)

### 9. `Badge.astro`
Props: 
- variant (default/success/danger/warning/info)
- size (sm/md/lg)
- rounded (boolean)
- icon (optional)

### 10. `ThemeToggle.astro`
- Switch between light/dark mode
- Persists to localStorage
- Smooth transition animation
- Sun/Moon icon toggle

### 11. `Breadcrumb.astro`
Props:
- items (array of {label, href})
- separator (default: '/')

### 12. `Table.astro`
Props:
- columns, data, loading
- sortable, striped, hoverable
- stickyHeader
- onSort callback

### 13. `Pagination.astro`
Props:
- currentPage, totalPages, totalItems
- itemsPerPage, onPageChange
- showItemsPerPage (boolean)

### 14. `EmptyState.astro`
Props:
- icon, title, description
- action (button config)

### 15. `Toast.astro`
Props:
- variant (success/error/info/warning)
- title, message, duration
- position (top-right/top-center/bottom-right/etc)

---

## Color Palette

### Light Mode
```css
/* Background */
--bg-primary: #f9fafb (gray-50)
--bg-secondary: #ffffff (white)
--bg-tertiary: #f3f4f6 (gray-100)
--bg-hover: #f3f4f6

/* Text */
--text-primary: #111827 (gray-900)
--text-secondary: #6b7280 (gray-500)
--text-muted: #9ca3af (gray-400)

/* Border */
--border-primary: #e5e7eb (gray-200)
--border-secondary: #d1d5db (gray-300)

/* Accent */
--accent-primary: #3b82f6 (blue-500)
--accent-primary-hover: #2563eb (blue-600)
--accent-danger: #ef4444 (red-500)
--accent-warning: #f59e0b (amber-500)
--accent-success: #10b981 (emerald-500)

/* Card */
--card-bg: #ffffff
--card-border: #e5e7eb
--card-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)
```

### Dark Mode
```css
/* Background */
--bg-primary: #1a202c (navy dark)
--bg-secondary: #2d3748 (card background)
--bg-tertiary: #374151 (gray-700)
--bg-hover: #4a5568

/* Text */
--text-primary: #ffffff
--text-secondary: #a0aec0 (gray-400)
--text-muted: #718096 (gray-500)

/* Border */
--border-primary: #4b5563 (gray-600)
--border-secondary: #374151 (gray-700)

/* Accent */
--accent-primary: #60a5fa (blue-400)
--accent-primary-hover: #3b82f6 (blue-500)
--accent-danger: #ef4444 (red-500)
--accent-warning: #fbbf24 (amber-400)
--accent-success: #34d399 (emerald-400)

/* Card */
--card-bg: #2d3748
--card-border: #4b5563
--card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3)
```

### Status Colors (Both Modes)
```css
/* Transaction Types */
--type-buy: #3b82f6 (blue)
--type-sell: #f59e0b (orange)
--type-deposit: #10b981 (green)
--type-withdraw: #ef4444 (red)

/* Profit/Loss */
--profit: #22c55e (green-500)
--loss: #ef4444 (red-500)
```

---

## File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   ├── Modal.astro
│   │   ├── Input.astro
│   │   ├── Select.astro
│   │   └── Badge.astro
│   ├── Navbar.astro
│   ├── BrokerCard.astro
│   ├── StockListItem.astro
│   ├── TransactionListItem.astro
│   └── AddBrokerModal.astro
├── layouts/
│   ├── BaseLayout.astro
│   └── DashboardLayout.astro
├── pages/
│   ├── index.astro (redirect to dashboard or login)
│   ├── login.astro
│   ├── register.astro
│   ├── dashboard.astro
│   └── broker/
│       ├── [brokerName].astro
│       └── [brokerName]/
│           └── transaction.astro
├── utils/
│   ├── auth.js (JWT token management & validation)
│   ├── api.js (API client helper functions)
│   ├── calculations.js (portfolio calculations - client-side)
│   └── format.js (number formatting utilities)
├── middlewares/
│   └── (custom middleware files)
└── middleware.ts (global middleware - route protection)
```

---

## API Endpoints (External REST API)

### Authentication
```
POST   /login
POST   /register
POST   /logout (optional - mainly client-side token removal)
```

**Request/Response Schema**:
- Login/Register returns JWT token in response
- Token stored in client-side cookie/localStorage
- All subsequent requests include `Authorization: Bearer {token}` header

### Brokers Management
```
GET    /broker
POST   /broker
DELETE /broker/:id
GET    /broker/:id (optional - get single broker detail)
PUT    /broker/:id (optional - update broker)
```

**Database Schema Reference**:
- Table: `brokers`
- Fields: `id`, `user_id`, `broker_name`, `cash_balance`, `created_at`, `updated_at`

### Holdings (Stock Positions)
```
GET    /holding?broker_id={id}
GET    /holding/:id (optional - get single holding)
POST   /holding (optional - if manual stock position creation is needed)
PUT    /holding/:id (optional - update holding)
DELETE /holding/:id (optional - delete holding)
```

**Database Schema Reference**:
- Table: `holdings`
- Fields: `id`, `broker_id`, `stock_code`, `quantity`, `average_price`, `last_updated`
- Note: Holdings are automatically calculated/updated from transactions

### Transactions
```
GET    /transaction?broker_id={id}&date_from={date}&date_to={date}&type={type}
POST   /transaction
DELETE /transaction/:id
PUT    /transaction/:id (optional - edit transaction)
```

**Database Schema Reference**:
- Table: `transactions`
- Fields: `id`, `broker_id`, `transaction_type`, `stock_code`, `quantity`, `price`, `total_amount`, `transaction_date`
- Transaction Types: `buy`, `sell`, `deposit`, `withdrawal`

**Business Logic**:
- When transaction is created/deleted, backend should automatically:
  - Update `holdings` table (recalculate quantity and average_price)
  - Update `brokers.cash_balance`

### User Profile (Optional)
```
GET    /user/profile
PUT    /user/profile
```

**Database Schema Reference**:
- Table: `users`
- Fields: `id`, `email`, `name`, `password_hash`, `created_at`, `updated_at`, `last_login`, `is_active`

---

## Features Checklist

### Authentication
- [x] Login page dengan validation
- [x] Register page dengan validation
- [x] Session management (JWT)
- [x] Logout functionality

### Dashboard
- [x] List semua brokers user
- [x] Display total equity per broker
- [x] Display cash & invested per broker
- [x] Add broker modal
- [x] Navigate to broker detail

### Broker Detail
- [x] Portfolio summary (total value, return today)
- [x] Financial details (cash, invested, P&L, profit %)
- [x] Stock list dengan calculations
- [x] Add transaction (buy/sell/deposit/withdrawal)
- [x] Remove broker dengan confirmation
- [x] Navigate to transaction history

### Transaction History
- [x] List all transactions for broker
- [x] Search by stock code
- [x] Filter by date range
- [x] Filter by transaction type
- [x] Delete transaction dengan confirmation
- [x] Pagination (optional)

### UI/UX
- [x] Responsive design (mobile, tablet, desktop)
- [x] Dark theme
- [x] Loading states
- [x] Error handling & messages
- [x] Success notifications
- [x] Smooth transitions
- [x] Accessible forms

---

## Styling Guidelines

### Layout
- Max width container: 1280px (xl)
- Sidebar width: 240px (fixed)
- Main content padding: 24px (mobile), 32px (tablet), 40px (desktop)
- Section gaps: 32px (mobile), 40px (desktop)

### Cards
- Border radius: 16px (untuk card utama), 12px (untuk card kecil)
- Padding: 20px (sm), 24px (md), 32px (lg)
- Background: var(--card-bg)
- Border: 1px solid var(--card-border)
- Shadow: var(--card-shadow)
- Hover: translateY(-2px) + shadow-lg (untuk clickable cards)

### Buttons
- **Primary**: Blue background, white text, px-5 py-2.5
- **Secondary**: Gray outline, gray text
- **Danger**: Red background, white text
- **Ghost**: Transparent, text color, hover background
- Border radius: 8px (normal), 12px (large)
- Hover: Darken/lighten 10% + shadow
- Transition: all 150ms ease

### Typography
- **Headings**: 
  - H1: text-3xl font-bold (30px)
  - H2: text-2xl font-semibold (24px)
  - H3: text-xl font-semibold (20px)
  - H4: text-lg font-medium (18px)
- **Body**: text-base font-normal (16px)
- **Small**: text-sm (14px)
- **Tiny**: text-xs (12px)
- **Numbers/Currency**: font-mono untuk consistency
- Line height: 1.5 (body), 1.2 (headings)

### Spacing
- Component gaps: 
  - Tight: 12px (space-y-3)
  - Normal: 16px (space-y-4)
  - Relaxed: 24px (space-y-6)
- Form field spacing: 16px
- Card internal padding: 24px
- Section margins: 32px-40px

### Borders & Dividers
- Width: 1px
- Color: var(--border-primary)
- Radius: 8px (inputs), 12px (cards), 16px (modals)

### Shadows
- **None**: shadow-none
- **Small**: shadow-sm (subtle lift)
- **Medium**: shadow-md (default cards)
- **Large**: shadow-lg (modals, hover states)
- **Extra Large**: shadow-xl (popovers)

### Animations & Transitions
- **Hover**: transition-all duration-200 ease
- **Page transitions**: Astro View Transitions API
- **Modal enter**: opacity 0→1, scale 0.95→1, duration 200ms
- **Modal exit**: opacity 1→0, scale 1→0.95, duration 150ms
- **Slide up**: translateY(10px)→0, duration 300ms
- **Fade**: opacity 0→1, duration 200ms

### Theme Toggle Animation
```css
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Responsive Breakpoints
```css
/* Mobile first approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Z-Index Scale
```css
--z-base: 0
--z-dropdown: 10
--z-sticky: 20
--z-navbar: 30
--z-sidebar: 40
--z-modal-backdrop: 50
--z-modal: 60
--z-toast: 70
--z-tooltip: 80
```

---

## Validations & Error Handling

### Form Validations
- Required fields harus diisi
- Email format valid
- Password minimum 8 characters
- Numbers harus positif
- Date tidak boleh future date

### Error Messages
- Display di bawah input field
- Toast notification untuk success/error actions
- Modal confirmation untuk destructive actions

### Edge Cases
- Cash insufficient untuk buy
- Quantity insufficient untuk sell
- Broker name duplicate
- Stock code format validation

---

## Performance Optimization

- Lazy load stock prices (jika fetch dari API eksternal)
- Debounce search input
- Paginate transaction history
- Cache calculations yang complex
- Optimize database queries dengan indexes
- Use Astro partial hydration untuk interactive components

---

## Security Considerations

- CSRF protection
- SQL injection prevention (use parameterized queries)
- XSS prevention (sanitize inputs)
- Rate limiting untuk API endpoints
- Session timeout
- Input validation server-side
- Authorization checks (user hanya bisa akses data sendiri)

---

## Future Enhancements

- [ ] Stock price API integration (real-time prices)
- [ ] Charts & graphs (portfolio performance over time)
- [ ] Export to CSV/Excel
- [ ] Multi-currency support
- [ ] Email notifications
- [ ] Mobile app (React Native / Flutter)
- [ ] Dividend tracking
- [ ] Tax report generation
- [ ] Portfolio comparison with benchmarks
- [ ] Social features (share portfolio)

---

## Notes

- Semua nominal menggunakan format Rupiah: `Rp 1.234.567`
- Quantity saham dalam satuan lot (1 lot = 100 shares)
- Timestamp menggunakan timezone Asia/Jakarta (WIB)
- Broker name harus unique per user
- Stock code uppercase (BBRI bukan bbri)
- Decimal precision: 2 untuk harga, 0 untuk quantity
