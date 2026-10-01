SPORTSMEN HR MANAGEMENT SYSTEM — Frontend Prototype v1.0
=========================================================

HOW TO RUN
----------
1. Extract this archive.
2. Open "index.html" in any modern browser (Chrome, Edge, Firefox).
   No server or installation is required — all data is stored in the browser
   via localStorage.

DEMO LOGIN
----------
Username: admin
Password: admin123

FEATURES
--------
- Login page with show/hide password, remember-me, error handling
- Dashboard with statistic cards, sports-distribution chart, recent records
- Full personnel registration form (service / sports / personal sections)
- Profile photo upload with preview, change and remove
- Sportsmen records table: instant search, filters, sorting, pagination
- Advanced field-specific search page
- Detailed printable personnel profile with JSON export
- Edit mode (add-sportsman.html?edit=<id>)
- Delete confirmation modal (nothing is deleted without confirmation)
- Reports with charts, CSV export and print / save-as-PDF
- Dark / light mode, toast notifications, loading animation
- Responsive: desktop, laptop, tablet and mobile (hamburger sidebar)

FILE STRUCTURE
--------------
index.html            Login page
dashboard.html        Dashboard
sportsmen.html        Records table
add-sportsman.html    Registration form (also used for editing)
search.html           Advanced search
profile.html          Personnel profile
reports.html          Reports
settings.html         Settings & data management
css/style.css         Main stylesheet
css/responsive.css    Responsive rules
js/storage.js         Data layer (localStorage CRUD) — swap with API calls later
js/auth.js            Session, theme, toast, modal, chart helpers
js/dashboard.js       Dashboard logic
js/sportsmen.js       Table / filters / pagination / delete
js/form.js            Registration & edit form logic
js/profile.js         Profile page logic
js/reports.js         Reports logic

IMPORTANT — SECURITY NOTICE
---------------------------
This is a FRONTEND PROTOTYPE for demonstration. Authentication is simulated
client-side and data lives in localStorage. Before real deployment, connect a
secure backend (server-side authentication, encrypted database, role-based
access control, audit logging). All sample personnel data is clearly fictional.
