// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'
import { AnyAbility } from '@casl/ability'
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

function canOne(ability: AnyAbility, actions: string | string[], subjects: string | string[]) {
  if (typeof actions === 'string') actions = [actions]
  if (typeof subjects === 'string') subjects = [subjects]

  return ability && subjects.filter(subject => ability.can(actions, subject)).length > 0
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props

  const auth = useAuth()

  // ** Hook
  const ability = useContext(AbilityContext)

  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else if (navTitle && navTitle.of_company && !auth.user?.company_id) {
    return null
  } else {
    return canOne(ability, navTitle?.action || '', navTitle?.subject || '') ? <>{children}</> : null
  }
}

export default CanViewNavSectionTitle
