const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const prisma = require("../lib/prisma")
const validate = require("../middleware/validate")
const authMiddleware = require("../middleware/auth")
const { getAuthRateLimiter } = require("../middleware/arcjet")
const { signupSchema, loginSchema } = require("../validators/schemas")

const router = express.Router()
const authRateLimiter = getAuthRateLimiter()

router.post("/signup", authRateLimiter, validate(signupSchema), async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.validatedBody

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: "A user with this email already exists" })
    }

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        hasCompletedTutorial: true,
        createdAt: true,
      },
    })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({ message: "Account created successfully", user, token })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/login", authRateLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedBody

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        hasCompletedTutorial: user.hasCompletedTutorial,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        hasCompletedTutorial: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.patch("/tutorial", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { hasCompletedTutorial: true },
      select: { id: true, hasCompletedTutorial: true },
    })

    res.json({ message: "Tutorial completed", user })
  } catch (error) {
    console.error("Tutorial update error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
