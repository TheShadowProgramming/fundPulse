const express = require("express")
const prisma = require("../lib/prisma")
const authMiddleware = require("../middleware/auth")
const validate = require("../middleware/validate")
const { mutualFundSchema, mutualFundUpdateSchema } = require("../validators/schemas")

const router = express.Router()

router.use(authMiddleware)

router.get("/", async (req, res) => {
  try {
    const funds = await prisma.mutualFund.findMany({
      where: { userId: req.userId },
      include: { prices: { orderBy: { month: "asc" } } },
      orderBy: { createdAt: "desc" },
    })

    const result = funds.map((fund) => ({
      ...fund,
      currentValue: fund.currentPrice * fund.units,
      gainLoss: (fund.currentPrice - fund.entryPrice) * fund.units,
      gainLossPercent: ((fund.currentPrice - fund.entryPrice) / fund.entryPrice) * 100,
    }))

    res.json({ funds: result })
  } catch (error) {
    console.error("Get funds error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const fund = await prisma.mutualFund.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { prices: { orderBy: { month: "asc" } } },
    })

    if (!fund) {
      return res.status(404).json({ error: "Mutual fund not found" })
    }

    res.json({
      fund: {
        ...fund,
        currentValue: fund.currentPrice * fund.units,
        gainLoss: (fund.currentPrice - fund.entryPrice) * fund.units,
        gainLossPercent: ((fund.currentPrice - fund.entryPrice) / fund.entryPrice) * 100,
      },
    })
  } catch (error) {
    console.error("Get fund error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/", validate(mutualFundSchema), async (req, res) => {
  try {
    const { name, category, entryPrice, currentPrice, units, investedAmount, prices } = req.validatedBody

    const fund = await prisma.mutualFund.create({
      data: {
        userId: req.userId,
        name,
        category,
        entryPrice,
        currentPrice,
        units,
        investedAmount,
        prices: {
          create: prices.map((p) => ({
            month: new Date(p.month),
            price: p.price,
          })),
        },
      },
      include: { prices: { orderBy: { month: "asc" } } },
    })

    res.status(201).json({
      message: "Mutual fund added successfully",
      fund: {
        ...fund,
        currentValue: currentPrice * units,
        gainLoss: (currentPrice - entryPrice) * units,
        gainLossPercent: ((currentPrice - entryPrice) / entryPrice) * 100,
      },
    })
  } catch (error) {
    console.error("Create fund error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.put("/:id", validate(mutualFundUpdateSchema), async (req, res) => {
  try {
    const existing = await prisma.mutualFund.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!existing) {
      return res.status(404).json({ error: "Mutual fund not found" })
    }

    const { prices, ...fundData } = req.validatedBody

    const updateData = {}
    if (fundData.name !== undefined) updateData.name = fundData.name
    if (fundData.category !== undefined) updateData.category = fundData.category
    if (fundData.entryPrice !== undefined) updateData.entryPrice = fundData.entryPrice
    if (fundData.currentPrice !== undefined) updateData.currentPrice = fundData.currentPrice
    if (fundData.units !== undefined) updateData.units = fundData.units
    if (fundData.investedAmount !== undefined) updateData.investedAmount = fundData.investedAmount

    if (prices && prices.length > 0) {
      await prisma.mutualFundPrice.deleteMany({ where: { mutualFundId: req.params.id } })
      await prisma.mutualFundPrice.createMany({
        data: prices.map((p) => ({
          mutualFundId: req.params.id,
          month: new Date(p.month),
          price: p.price,
        })),
      })
    }

    const fund = await prisma.mutualFund.update({
      where: { id: req.params.id },
      data: updateData,
      include: { prices: { orderBy: { month: "asc" } } },
    })

    res.json({
      message: "Mutual fund updated successfully",
      fund: {
        ...fund,
        currentValue: fund.currentPrice * fund.units,
        gainLoss: (fund.currentPrice - fund.entryPrice) * fund.units,
        gainLossPercent: ((fund.currentPrice - fund.entryPrice) / fund.entryPrice) * 100,
      },
    })
  } catch (error) {
    console.error("Update fund error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.mutualFund.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!existing) {
      return res.status(404).json({ error: "Mutual fund not found" })
    }

    await prisma.mutualFund.delete({ where: { id: req.params.id } })

    res.json({ message: "Mutual fund deleted successfully" })
  } catch (error) {
    console.error("Delete fund error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
