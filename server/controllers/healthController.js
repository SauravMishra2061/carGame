const getHealth = (req, res) => {
  res.json({
    status: 'OK',
    message: 'CarGame API is healthy',
  })
}

module.exports = {
  getHealth,
}
