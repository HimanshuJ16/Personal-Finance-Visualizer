"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import type { Transaction, Budget } from "@/lib/types"

interface SummaryCardsProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export function SummaryCards({ transactions, budgets }: SummaryCardsProps) {
  const currentMonth = new Date().toISOString().slice(0, 7)

  const currentMonthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth))

  const totalIncome = currentMonthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)

  const budgetRemaining = totalBudget - totalExpenses

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getMostSpentCategory = () => {
    const categoryTotals: Record<string, number> = {}

    currentMonthTransactions
      .filter((t) => t.type === "expense")
      .forEach((transaction) => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount
      })

    const entries = Object.entries(categoryTotals)
    if (entries.length === 0) return "None"

    return entries.reduce((max, [category, amount]) => (amount > max.amount ? { category, amount } : max), {
      category: entries[0][0],
      amount: entries[0][1],
    }).category
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${budgetRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(budgetRemaining)}
          </div>
          <p className="text-xs text-muted-foreground">{budgetRemaining >= 0 ? "Under budget" : "Over budget"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getMostSpentCategory()}</div>
          <p className="text-xs text-muted-foreground">Highest spending</p>
        </CardContent>
      </Card>
    </div>
  )
}
