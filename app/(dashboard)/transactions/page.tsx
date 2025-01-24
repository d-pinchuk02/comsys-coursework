"use client"

import { Loader2, Plus } from "lucide-react"

import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/DataTable"
import { useNewTransaction } from "@/features/transactions/hooks/useNewTransaction"
import { useGetTransactions } from "@/features/transactions/api/useGetTransactions"
import { useBulkDeleteTransactions } from "@/features/transactions/api/useBulkDeleteTransactions"

const TransactionsPage = () => {
  const newTransaction = useNewTransaction()
  const deleteTransactions = useBulkDeleteTransactions()
  const transactionsQuery = useGetTransactions()
  const transactions = transactionsQuery.data || []

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="w-48 h-8" />
          </CardHeader>
          <CardContent>
            <div className="w-full h-[500px] flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Транзакції</CardTitle>
          <Button onClick={newTransaction.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Створити
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="notes"
            columns={columns}
            data={transactions}
            onDelete={(row) => {
              const ids = row.map((r) => Number(r.original.id))
              deleteTransactions.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionsPage
