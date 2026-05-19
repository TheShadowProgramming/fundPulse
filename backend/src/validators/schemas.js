const { z } = require("zod")

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  firstName: z.string().min(1, "First name is required").max(50).trim(),
  lastName: z.string().min(1, "Last name is required").max(50).trim(),
  phone: z.string().regex(/^\+?[1-9]\d{6,14}$/, "Invalid phone number").optional().or(z.literal("")),
})

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const mutualFundSchema = z.object({
  name: z.string().min(1, "Mutual fund name is required").max(200).trim(),
  category: z.enum(["Equity", "Debt", "Hybrid", "Solution Oriented", "Index Fund", "ELSS", "Liquid", "Other"]),
  entryPrice: z.number().positive("Entry price must be positive"),
  currentPrice: z.number().positive("Current price must be positive"),
  units: z.number().positive("Units must be positive"),
  investedAmount: z.number().positive("Invested amount must be positive"),
  prices: z
    .array(
      z.object({
        month: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
        price: z.number().positive("Price must be positive"),
      })
    )
    .min(2, "At least 2 monthly prices are required"),
})

const mutualFundUpdateSchema = mutualFundSchema.partial()

module.exports = { signupSchema, loginSchema, mutualFundSchema, mutualFundUpdateSchema }
