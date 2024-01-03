// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
// import { useRouter } from 'next/router'

// ** Config
import { FirebaseCredentials } from 'src/configs/auth'

// ** Types
import { LoginParams } from './types'

// ** Firebase Auth
import { initializeApp } from 'firebase/app'
import { Auth, UserCredential, getAuth } from 'firebase/auth'
import User from 'src/modules/user/interfaces/user'
import UserService from 'src/modules/user/user-service'

export type AuthValuesType = {
  loading: boolean
  ready: boolean
  logout: () => Promise<void>
  user: User | null
  firebase?: Auth
  updatePassword: (value: string) => Promise<any>
  setLoading: (value: boolean) => void
  setUser: (value: User | null) => void
  login: (params: LoginParams) => Promise<UserCredential | void>
}

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: false,
  ready: false,
  setUser: () => null,
  setLoading: () => Boolean,
  updatePassword: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<User | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [ready, setReady] = useState<boolean>(false)

  // ** Hooks
  // const router = useRouter()

  const firebaseApp = initializeApp(FirebaseCredentials)
  const firebaseAuth = getAuth(firebaseApp)
  const userService = new UserService()

  const initAuth = async () => {
    setReady(false)
    changeUser(await userService.getLoggedUser())
    setReady(true)
  }

  useEffect(() => {
    initAuth()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseAuth.currentUser])

  const changeUser = (userData: any) => {
    if (userData && userData.active) window.localStorage.setItem('userData', JSON.stringify(userData))
    else localStorage.removeItem('userData')

    if (userData && !userData.active) {
      handleLogout()
    }

    setUser({ ...userData })
  }

  const handleLogin = async (params: LoginParams) => {
    if (params.email) return userService.login(params.email, params.password!)
    if (params.document) return userService.loginWithDocument(params.document)
  }

  const handleLogout = () => {
    changeUser(null)

    return userService.logout()
  }

  const handleUpdatePassword = (password: string) => {
    return userService.put(user!.id!, { ...user!, password })
  }

  const values = {
    user,
    loading,
    ready,
    setUser,
    setLoading,
    updatePassword: handleUpdatePassword,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
