"use client"

import { useUser } from "@auth0/nextjs-auth0/client"

export const WelcomeMessage = () => {
  const { user, isLoading } = useUser()

  return <div className="space-y-2 mb-4">
    <h2 className="text-2xl lg:text-4xl text-white font-medium">
      Ласкаво просимо{isLoading ? " " : ", "}{user?.nickname}
    </h2>
    <p className="text-sm lg:text-base text-emerald-300">
      Ваш фінансовий звіт
    </p>
  </div>
}
