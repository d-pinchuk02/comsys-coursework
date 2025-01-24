import { useOpenAccount } from "@/features/accounts/hooks/useOpenAccount"

import { cn } from "@/lib/utils"

type Props = {
  account: string
  accountId: string | number
}

export const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen: onOpenAccount } = useOpenAccount()

  const onClick = () => {
    onOpenAccount(accountId as string)
  }

  return (
    <div
      onClick={onClick}
      className={cn("flex items-center cursor-pointer hover:underline")}
    >
      {account}
    </div>
  )
}
