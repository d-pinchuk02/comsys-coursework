import { Suspense } from "react"
import { FaUserLock, FaUserPlus } from "react-icons/fa6"

import { auth0 } from "@/lib/auth0"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataGrid } from "@/components/DataGrid"
import { DataCharts } from "@/components/DataCharts"

export default async function DashboardPage() {
  const session = await auth0.getSession()

  if (!session) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-2 mb-8">
          <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl line-clamp-1">Вхід</CardTitle>
              </div>
              <div className="shrink-0 rounded-md p-3 bg-blue-500/20">
                <FaUserLock className="size-6 fill-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/auth/login"
                className={buttonVariants({ variant: "default" })}
              >
                Увійти до системи
              </a>
            </CardContent>
          </Card>
          <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl line-clamp-1">
                  Реєстрація
                </CardTitle>
              </div>
              <div className="shrink-0 rounded-md p-3 bg-emerald-500/20">
                <FaUserPlus className="size-6 fill-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/auth/login?screen_hint=signup"
                className={buttonVariants({ variant: "default" })}
              >
                Зареєструватись
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Suspense>
        <DataGrid />
        <DataCharts />
      </Suspense>
    </div>
  )
}
