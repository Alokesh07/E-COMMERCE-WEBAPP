const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'shopx_secret_key_2024';
const TOKEN_EXPIRY = '7d';
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'token';

// Helper function to create in-app notification
const createPasswordNotification = async (userId, type, message) => {
  try {
    const notification = new Notification({
      userId,
      type: 'general',
      title: type === 'reset_request' ? 'Password Reset Request' : 'Password Changed Successfully',
      message,
    });
    await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, username, dob } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      username,
      email: normalizedEmail,
      password,
      phone,
      dob: dob ? new Date(dob) : undefined,
      addresses: []
    });

    await user.save();

    // Generate token and set HttpOnly cookie
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        addresses: user.addresses,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const normalizedEmail = String(email).toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token and set cookie
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    };

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Logout user - clear auth cookie
exports.logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    };
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, avatar },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Add address
exports.addAddress = async (req, res) => {
  try {
    const { name, address, city, state, zip, phone, isDefault, type } = req.body;
    const user = await User.findById(req.user.userId);

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress = {
      id: 'addr_' + Date.now(),
      name,
      address,
      city,
      state,
      zip,
      phone,
      type: type || 'Home',
      isDefault: isDefault || user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    await user.save();

    res.json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { name, address, city, state, zip, phone, isDefault, type } = req.body;
    const user = await User.findById(req.user.userId);

    const addrIndex = user.addresses.findIndex(a => a.id === addressId);
    if (addrIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses[addrIndex] = {
      ...user.addresses[addrIndex].toObject(),
      name,
      address,
      city,
      state,
      zip,
      phone,
      type: type || user.addresses[addrIndex].type || 'Home',
      isDefault: isDefault || false
    };

    await user.save();
    res.json({ message: 'Address updated successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.userId);

    user.addresses = user.addresses.filter(a => a.id !== addressId);
    await user.save();

    res.json({ message: 'Address deleted successfully', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};

// Forgot password - Find user by email or phone and generate reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ message: 'Please provide email or phone number' });
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      // Don't reveal that user doesn't exist for security
      return res.status(200).json({ 
        message: 'If an account exists with this email/phone, you will receive a password reset link shortly.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Simulate sending email/SMS notification
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    // Log the reset link (in production, send actual email/SMS)
    console.log('========================================');
    console.log('PASSWORD RESET LINK (Simulated Email/SMS)');
    console.log('========================================');
    console.log(`To: ${user.email} ${user.phone ? `(${user.phone})` : ''}`);
    console.log(`Subject: Password Reset Request`);
    console.log(`Message: You requested a password reset. Click the link below to reset your password:`);
    console.log(`Reset Link: ${resetLink}`);
    console.log(`Token: ${resetToken}`);
    console.log(`Expires in: 1 hour`);
    console.log('========================================');

    // Create in-app notification
    await createPasswordNotification(
      user._id,
      'reset_request',
      `A password reset request was initiated for your account. If you didn't make this request, please ignore this message.`
    );

    res.status(200).json({ 
      message: 'If an account exists with this email/phone, you will receive a password reset link shortly.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
};

// Reset password - Validate token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Store old email for notification
    const userEmail = user.email;
    const userPhone = user.phone;
    const userId = user._id;

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Simulate sending confirmation email/SMS
    console.log('========================================');
    console.log('PASSWORD CHANGED CONFIRMATION (Simulated)');
    console.log('========================================');
    console.log(`To: ${userEmail} ${userPhone ? `(${userPhone})` : ''}`);
    console.log(`Subject: Password Changed Successfully`);
    console.log(`Message: Your password has been successfully changed.`);
    console.log(`If you didn't make this change, please contact support immediately.`);
    console.log('========================================');

    // Create in-app notification
    await createPasswordNotification(
      userId,
      'password_changed',
      `Your password has been successfully changed. If you didn't make this change, please contact support immediately.`
    );

    res.status(200).json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};
