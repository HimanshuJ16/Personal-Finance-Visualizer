import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("finance_tracker")

    const currentMonth = new Date().toISOString().slice(0, 7)

    const budgets = await db.collection("budgets").find({ month: currentMonth }).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, amount } = body

    // Validation
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("finance_tracker")

    const currentMonth = new Date().toISOString().slice(0, 7)

    const budget = {
      category,
      amount: Number.parseFloat(amount),
      month: currentMonth,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Upsert - update if exists, insert if not
    const result = await db.collection("budgets").findOneAndUpdate(
      { category, month: currentMonth },
      {
        $set: {
          ...budget,
          updatedAt: new Date().toISOString(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    )

    const newBudget = {
      _id: result?._id.toString(),
      ...result,
    }

    return NextResponse.json(newBudget, { status: 201 })
  } catch (error) {
    console.error("Error creating budget:", error)
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
  }
}
