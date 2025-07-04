"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { Transaction } from "@/lib/types"

interface CategoryPieChartProps {
  transactions: Transaction[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
]

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const getCategoryData = () => {
    const categoryTotals: Record<string, number> = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((transaction) => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount
      })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: Math.round(amount * 100) / 100,
      }))
      .sort((a, b) => b.value - a.value)
  }

  const data = getCategoryData()

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">No expense data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : `${name}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
