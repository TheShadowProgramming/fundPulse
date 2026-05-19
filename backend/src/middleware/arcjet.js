const arcjet = require("@arcjet/node")

let aj = null

function getArcjetMiddleware() {
  if (!process.env.ARCJET_KEY) {
    return (req, res, next) => next()
  }

  if (!aj) {
    aj = arcjet.default({
      key: process.env.ARCJET_KEY,
      rules: [
        arcjet.fixedWindow({
          mode: "LIVE",
          window: "60s",
          max: 100,
        }),
      ],
    })
  }

  return async (req, res, next) => {
    try {
      const decision = await aj.protect(req)
      if (decision.isDenied()) {
        return res.status(429).json({ error: "Too many requests. Please try again later." })
      }
      next()
    } catch (error) {
      console.error("Arcjet error:", error.message)
      next()
    }
  }
}

function getAuthRateLimiter() {
  if (!process.env.ARCJET_KEY) {
    return (req, res, next) => next()
  }

  const authAj = arcjet.default({
    key: process.env.ARCJET_KEY,
    rules: [
      arcjet.fixedWindow({
        mode: "LIVE",
        window: "60s",
        max: 10,
      }),
    ],
  })

  return async (req, res, next) => {
    try {
      const decision = await authAj.protect(req)
      if (decision.isDenied()) {
        return res.status(429).json({ error: "Too many login attempts. Please try again later." })
      }
      next()
    } catch (error) {
      console.error("Arcjet auth error:", error.message)
      next()
    }
  }
}

module.exports = { getArcjetMiddleware, getAuthRateLimiter }
