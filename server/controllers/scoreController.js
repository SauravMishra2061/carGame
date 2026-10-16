const User = require('../models/User')

const updateHighScore = async (req, res) => {
  try {
    const { score } = req.body

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({
        message: 'Score must be a non-negative number',
      })
    }

    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (score <= user.highScore) {
      return res.json({
        message: 'Score did not beat the high score',
        highScore: user.highScore,
      })
    }

    user.highScore = score

    await user.save()

    res.json({
      message: 'New high score!',
      highScore: user.highScore,
    })
  } catch (error) {
    console.error('Update high score error:', error)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

module.exports = {
  updateHighScore,
}
