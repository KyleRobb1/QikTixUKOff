require('dotenv').config(); // Load environment variables first

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRoutes = require('./server/routes/index');
const authRoutes = require('./server/routes/auth');
// Import the Supabase client
const supabase = require('./server/config/supabaseClient');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Add cookie parser middleware
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to make user available in templates
app.use(async (req, res, next) => {
  res.locals.user = null; // Default to no user

  try {
    // Get the current session directly using getSession()
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
    } else if (session) {
      // If we have a valid session, set the user
      res.locals.user = session.user;
      console.log('Session found for user:', session.user.email);
    }
  } catch (err) {
    console.error('Error in user middleware:', err);
  }
  
  // Add user email to logs if available for easier debugging
  console.log('Request User:', res.locals.user ? res.locals.user.email : 'Guest');
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/', authRoutes);
// Later: app.use('/', authRoutes);

// Basic error handling (can be expanded later)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 