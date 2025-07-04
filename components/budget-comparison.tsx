"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { Transaction, Budget } from "@/lib/types"

interface BudgetComparisonProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export function BudgetComparison({ transactions, budgets }: BudgetComparisonProps) {
  const getCurrentMonthData = () => {
    const currentMonth = new Date().toISOString().slice(0, 7)

    // Calculate actual spending by category for current month
    const actualSpending: Record<string, number> = {}
    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .forEach((transaction) => {
        actualSpending[transaction.category] = (actualSpending[transaction.category] || 0) + transaction.amount
      })

    // Combine with budget data
    const data = budgets.map((budget) => ({
      category: budget.category,
      budget: budget.amount,
      actual: actualSpending[budget.category] || 0,
      remaining: Math.max(0, budget.amount - (actualSpending[budget.category] || 0)),
    }))

    return data
  }

  const data = getCurrentMonthData()

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No budget data available. Set up your budgets to see comparisons.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip
          formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Legend />
        <Bar dataKey="budget" fill="hsl(var(--primary))" name="Budget" />
        <Bar dataKey="actual" fill="hsl(var(--destructive))" name="Actual" />
      </BarChart>
    </ResponsiveContainer>
  )
}
