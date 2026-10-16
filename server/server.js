require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const connectDB = require('./config/db')
const healthRoutes = require('./routes/healthRoutes')
const scoreRoutes = require('./routes/scoreRoutes')
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/score', scoreRoutes)
const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()
