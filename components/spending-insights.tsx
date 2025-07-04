"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import type { Transaction, Budget } from "@/lib/types"

interface SpendingInsightsProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

  const currentMonthExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0)

  const lastMonthExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(lastMonth))
    .reduce((sum, t) => sum + t.amount, 0)

  const spendingTrend =
    lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0

  const getBudgetInsights = () => {
    const currentMonthByCategory: Record<string, number> = {}

    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .forEach((transaction) => {
        currentMonthByCategory[transaction.category] =
          (currentMonthByCategory[transaction.category] || 0) + transaction.amount
      })

    return budgets
      .map((budget) => {
        const spent = currentMonthByCategory[budget.category] || 0
        const percentage = (spent / budget.amount) * 100

        return {
          category: budget.category,
          budget: budget.amount,
          spent,
          percentage,
          status: percentage > 100 ? "over" : percentage > 80 ? "warning" : "good",
        }
      })
      .sort((a, b) => b.percentage - a.percentage)
  }

  const budgetInsights = getBudgetInsights()

  const getTopSpendingCategories = () => {
    const categoryTotals: Record<string, number> = {}

    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .forEach((transaction) => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount
      })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }

  const topCategories = getTopSpendingCategories()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {spendingTrend > 0 ? (
              <TrendingUp className="h-5 w-5 text-red-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-green-500" />
            )}
            Spending Trend
          </CardTitle>
          <CardDescription>Compared to last month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>This month:</span>
              <span className="font-bold">{formatCurrency(currentMonthExpenses)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last month:</span>
              <span className="font-bold">{formatCurrency(lastMonthExpenses)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Change:</span>
              <Badge variant={spendingTrend > 0 ? "destructive" : "default"}>
                {spendingTrend > 0 ? "+" : ""}
                {spendingTrend.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
          <CardDescription>This month's highest expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCategories.length > 0 ? (
              topCategories.map((item, index) => (
                <div key={item.category} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span>{item.category}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(item.amount)}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No expenses this month</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Budget Status
          </CardTitle>
          <CardDescription>How you're tracking against your budgets</CardDescription>
        </CardHeader>
        <CardContent>
          {budgetInsights.length > 0 ? (
            <div className="space-y-4">
              {budgetInsights.map((insight) => (
                <div key={insight.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{insight.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {formatCurrency(insight.spent)} / {formatCurrency(insight.budget)}
                      </span>
                      <Badge
                        variant={
                          insight.status === "over"
                            ? "destructive"
                            : insight.status === "warning"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {insight.percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={Math.min(insight.percentage, 100)} className="h-2" />
                  {insight.status === "over" && (
                    <p className="text-sm text-destructive">
                      Over budget by {formatCurrency(insight.spent - insight.budget)}
                    </p>
                  )}
                  {insight.status === "warning" && <p className="text-sm text-yellow-600">Approaching budget limit</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Set up budgets to see insights</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
