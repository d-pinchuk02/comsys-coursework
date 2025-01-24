"use client"

import { useSearchParams } from "next/navigation"
import { FaPiggyBank } from "react-icons/fa"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"

import { formatDateRange } from "@/lib/utils"
import { useGetSummary } from "@/features/summary/api/useGetSummary"
import { DataCard, DataCardLoading } from "@/components/DataCard"

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary()

  const params = useSearchParams()
  const to = params.get("to") || undefined
  const from = params.get("from") || undefined

  const dateRangeLabel = formatDateRange({ to, from })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Залишок"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Доходи"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="success"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Витрати"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </div>
  )
}
