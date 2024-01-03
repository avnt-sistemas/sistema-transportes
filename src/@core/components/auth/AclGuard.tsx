// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Util Import
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'
import { getModule } from 'src/navigation/common/modules'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { children, guestGuard = false, authGuard = true } = props

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  // ** Vars
  let ability: AppAbility

  function isModule() {
    return router.route.includes('[module]')
  }

  useEffect(() => {
    if (authGuard && auth.user && auth.user.role && !guestGuard && router.route === '/') {
      const homeRoute = getHomeRoute(auth.user.company_id)
      router.replace(homeRoute)
    }
  }, [auth.user, authGuard, guestGuard, router])

  // If guest guard or no guard is true or any error page
  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    // If user is logged in and his ability is built
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // If user is not logged in (render pages like login, register etc..)
      return <>{children}</>
    }
  }

  // User is logged in, build ability for the user based on his role
  if (authGuard && auth.user && !ability && !guestGuard) {
    ability = buildAbilityFor(auth.user.role)
    if (router.route === '/') {
      return <Spinner />
    }
  }

  if (isModule()) {
    const path = router.asPath
    const match = path.match(/^\/([^/]+)/)
    const modulePath = match ? match[1] : null
    if (modulePath) {
      const m = getModule(modulePath)

      // Check the access of current user and render pages
      if (m && authGuard && ability && auth.user && ability.can('read', m.subject)) {
        if (router.route === '/') {
          return <Spinner />
        }

        return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
      }
    }
  } else if (authGuard && ability && auth.user) {
    if (router.route === '/') {
      return <Spinner />
    }

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // If user is not logged in (render pages like login, register etc..)
  return <>{children}</>

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
