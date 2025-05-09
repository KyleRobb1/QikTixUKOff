const supabase = require('../config/supabaseClient');

// Render signup page
exports.getSignup = (req, res) => {
    res.render('auth/signup', { 
        title: 'Sign Up',
        error: null // Pass null initially
    });
};

// Handle signup form submission
exports.postSignup = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('auth/signup', { title: 'Sign Up', error: 'Passwords do not match.' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            // Add options like email confirmation if desired in Supabase settings
            // options: {
            //     emailRedirectTo: 'http://localhost:3000/welcome',
            // }
        });

        if (error) {
            console.error("Supabase signup error:", error.message);
            // Check for specific errors like user already registered
            let errorMessage = 'Could not sign up. Please try again.';
            if (error.message.includes("User already registered")) {
                 errorMessage = 'This email is already registered. Please log in.';
            }
             // Render signup page again with specific error
            return res.render('auth/signup', { title: 'Sign Up', error: errorMessage });
        }

        // On successful signup (user object might be null until confirmed depending on settings)
        // Redirect to login or a confirmation pending page
        console.log('Signup successful (check email if confirmation enabled):', data);
        res.redirect('/login?signup=success'); // Redirect to login page

    } catch (err) {
        console.error("Server signup error:", err);
        next(err); // Pass to general error handler
    }
};

// Render login page
exports.getLogin = (req, res) => {
    // Check for query parameter indicating successful signup
    const signupSuccess = req.query.signup === 'success';
    res.render('auth/login', { 
        title: 'Login', 
        error: null,
        info: signupSuccess ? 'Signup successful! Please log in.' : null 
    });
};

// Handle login form submission
exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error("Supabase login error:", error.message);
            // Render login page again with error
            return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.', info: null });
        }

        // Supabase client library automatically handles setting the session cookie
        console.log('Login successful:', data.user.email);
        res.redirect('/'); // Redirect to home page on successful login

    } catch (err) {
        console.error("Server login error:", err);
        next(err);
    }
};

// Handle logout
exports.postLogout = async (req, res, next) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Supabase logout error:", error.message);
            // Still redirect, but log the error
        }
        
        console.log('Logout successful');
        res.redirect('/'); // Redirect to home page after logout

    } catch (err) {
        console.error("Server logout error:", err);
        next(err);
    }
}; 