"use client"

import { useUser } from "@auth0/nextjs-auth0"
import { LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filters } from "@/components/filters/Filters"
import { HeaderLogo } from "@/components/HeaderLogo"
import { Navigation } from "@/components/Navigation"
import { WelcomeMessage } from "@/components/WelcomeMessage"

export const Header = () => {
  const { user, isLoading } = useUser()

  return (
    <div className="bg-gradient-to-b from-emerald-700 to-emerald-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            {user ? (
              <HeaderLogo />
            ) : (
              <p className="font-semibold text-white text-2xl">Money Manager</p>
            )}
            {user && <Navigation />}
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  {user && !isLoading && <AvatarImage src={user.picture!} />}
                  <AvatarFallback>
                    {user && !isLoading
                      ? user.email!.charAt(0).toUpperCase()
                      : "..."}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user && user.nickname}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild key="logout">
                  <a href="/auth/logout">
                    <LogOut />
                    <span>Вийти з системи</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <WelcomeMessage />
        {user && <Filters />}
      </div>
    </div>
  )
}
