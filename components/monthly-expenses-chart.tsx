"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Transaction } from "@/lib/types"

interface MonthlyExpensesChartProps {
  transactions: Transaction[]
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const getMonthlyData = () => {
    const monthlyExpenses: Record<string, number> = {}

    // Get last 6 months
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toISOString().slice(0, 7) // YYYY-MM format
      monthlyExpenses[key] = 0
    }

    // Aggregate expenses by month
    transactions
      .filter((t) => t.type === "expense")
      .forEach((transaction) => {
        const monthKey = transaction.date.slice(0, 7)
        if (monthlyExpenses.hasOwnProperty(monthKey)) {
          monthlyExpenses[monthKey] += transaction.amount
        }
      })

    return Object.entries(monthlyExpenses).map(([month, amount]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      amount: Math.round(amount * 100) / 100,
    }))
  }

  const data = getMonthlyData()

  if (data.every((d) => d.amount === 0)) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">No expense data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Expenses"]}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Bar dataKey="amount" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
