import { DataGrid } from "@/components/DataGrid"
import { DataCharts } from "@/components/DataCharts"
import { Suspense } from "react"

export default function DashboardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Suspense>
        <DataGrid />
        <DataCharts />
      </Suspense>
    </div>
  )
}
