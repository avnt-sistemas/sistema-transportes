// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useContext(AbilityContext)
  const { user } = useAuth()

  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else {
    return ability && ability.can(navLink?.action, navLink?.subject) && (!navLink?.of_company || user?.company_id) ? (
      <>{children}</>
    ) : null
  }
}

export default CanViewNavLink
