const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
const { format } = require('date-fns');

class User {
  constructor(data) {
    this.user_id = data.user_id;
    this.email = data.email;
    this.password = data.password;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.profile_image = data.profile_image;
    this.created_at = data.created_at;
  }

  // Format user data (remove sensitive fields)
  formatted() {
    const userData = { ...this };
    delete userData.password;
    return {
      ...userData,
      created_at: this.created_at ? format(new Date(this.created_at), 'PPpp') : null
    };
  }

  // Get all users
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        throw new Error(`Error fetching users: ${error.message}`);
      }

      return data.map(user => new User(user).formatted());
    } catch (err) {
      console.error('Error in getAll:', err);
      throw err;
    }
  }

  // Get user by ID
  static async getById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw new Error(`Error fetching user: ${error.message}`);
      }

      return new User(data).formatted();
    } catch (err) {
      console.error('Error in getById:', err);
      throw err;
    }
  }

  // Get user by email
  static async getByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw new Error(`Error fetching user by email: ${error.message}`);
      }

      return data ? new User(data) : null;
    } catch (err) {
      console.error('Error in getByEmail:', err);
      throw err;
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Insert into database
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          first_name: userData.first_name,
          last_name: userData.last_name,
          profile_image: userData.profile_image || null
        }])
        .select();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Email already exists');
        }
        throw new Error(`Error creating user: ${error.message}`);
      }

      return new User(data[0]).formatted();
    } catch (err) {
      console.error('Error in create:', err);
      throw err;
    }
  }

  // Update user
  static async update(userId, updates) {
    try {
      // If updating password, hash it first
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }

      // Update email to lowercase if provided
      if (updates.email) {
        updates.email = updates.email.toLowerCase();
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Email already exists');
        }
        throw new Error(`Error updating user: ${error.message}`);
      }

      return new User(data[0]).formatted();
    } catch (err) {
      console.error('Error in update:', err);
      throw err;
    }
  }

  // Delete user
  static async delete(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Error deleting user: ${error.message}`);
      }

      return true;
    } catch (err) {
      console.error('Error in delete:', err);
      throw err;
    }
  }

  // Authenticate user
  static async authenticate(email, password) {
    try {
      // Get user by email
      const user = await this.getByEmail(email);
      
      if (!user) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Create JWT token
      const payload = {
        user: {
          id: user.user_id
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      return {
        success: true,
        token,
        user: user.formatted()
      };
    } catch (err) {
      console.error('Error in authenticate:', err);
      throw err;
    }
  }
}

module.exports = User; 