require("dotenv").config()
const { Pool } = require("pg")
const { PrismaPg } = require("@prisma/adapter-pg")
const { PrismaClient } = require("../../generated/prisma")

// strip sslmode from url or aiven throws a cert error
const rawUrl = process.env.DATABASE_PROD_URL
const dbUrl = new URL(rawUrl)
dbUrl.searchParams.delete("sslmode")

const pool = new Pool({
  connectionString: dbUrl.toString(),
  ssl: { rejectUnauthorized: false },
  max: 10,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
})

module.exports = prisma
