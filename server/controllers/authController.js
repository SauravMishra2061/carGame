const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required',
      })
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Username or email already exists',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await User.create({
      username,
      email,
      passwordHash,
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        highScore: user.highScore,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        highScore: user.highScore,
      },
    })
  } catch (error) {
    console.error('Login error:', error)

    res.status(500).json({
      message: 'Server error',
    })
  }
}
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        highScore: user.highScore,
      },
    })
  } catch (error) {
    console.error('Get current user error:', error)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
   getCurrentUser,
}
