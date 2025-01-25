"use client"

import { useUser } from "@auth0/nextjs-auth0"

export const WelcomeMessage = () => {
  const { user } = useUser()

  return (
    <div className="space-y-2 mb-4">
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
        Ласкаво просимо
        {user ? ", " + user?.nickname : ", увійдіть до системи"}
      </h2>
      {user && (
        <p className="text-sm lg:text-base text-emerald-300">
          Ваш фінансовий звіт
        </p>
      )}
    </div>
  )
}
