"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { MonthlyExpensesChart } from "@/components/monthly-expenses-chart"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { BudgetComparison } from "@/components/budget-comparison"
import { BudgetForm } from "@/components/budget-form"
import { SummaryCards } from "@/components/summary-cards"
import { SpendingInsights } from "@/components/spending-insights"
import { useToast } from "@/hooks/use-toast"
import type { Transaction, Budget } from "@/lib/types"

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
    fetchBudgets()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions")
      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      setTransactions(data)
    } catch (err) {
      setError("Failed to load transactions")
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets")
      if (!response.ok) throw new Error("Failed to fetch budgets")
      const data = await response.json()
      setBudgets(data)
    } catch (err) {
      console.error("Failed to load budgets:", err)
    }
  }

  const handleTransactionAdded = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev])
    toast({
      title: "Success",
      description: "Transaction added successfully",
    })
  }

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t._id === updatedTransaction._id ? updatedTransaction : t)))
    toast({
      title: "Success",
      description: "Transaction updated successfully",
    })
  }

  const handleTransactionDeleted = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t._id !== id))
    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    })
  }

  const handleBudgetAdded = (budget: Budget) => {
    setBudgets((prev) => [...prev.filter((b) => b.category !== budget.category), budget])
    toast({
      title: "Success",
      description: "Budget updated successfully",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <SummaryCards transactions={transactions} budgets={budgets} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>Your spending over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyExpensesChart transactions={transactions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Breakdown of your spending</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryPieChart transactions={transactions} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual</CardTitle>
              <CardDescription>How you're doing against your budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetComparison transactions={transactions} budgets={budgets} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>Record a new expense or income</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionList
                  transactions={transactions}
                  onTransactionUpdated={handleTransactionUpdated}
                  onTransactionDeleted={handleTransactionDeleted}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Set Budget</CardTitle>
                <CardDescription>Set monthly spending limits by category</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetForm onBudgetAdded={handleBudgetAdded} budgets={budgets} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Your current budget status</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetComparison transactions={transactions} budgets={budgets} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <SpendingInsights transactions={transactions} budgets={budgets} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
