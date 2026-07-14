backend/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── messageController.js
│   │   ├── studySessionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validate.js
│   ├── models/
│   │   ├── Message.js
│   │   ├── StudySession.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── studySessionRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── moderateMessage.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── messageValidator.js
│   │   └── userValidator.js
│   ├── app.js.
│   └── server.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json

frontend/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── StudyReminder.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Chat.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── Study.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── styles/
│   │   ├── App.css
│   │   ├── Auth.css
│   │   ├── Chat.css
│   │   ├── Dashboard.css
│   │   ├── Features.css
│   │   ├── Footer.css
│   │   ├── Hero.css
│   │   ├── Navbar.css
│   │   ├── Page.css
│   │   ├── Profile.css
│   │   ├── Sidebar.css
│   │   ├── StudySession.css
│   │   └── Study.css
│   │
│   ├── utils/
│   │   └── formatName.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
└── Project_Folder_Structure.txt