import { createContext, useEffect, useState, ReactNode } from 'react'
import UserService from 'src/modules/user/user-service'
import Company from 'src/modules/company/interfaces/company'
import { useAuth } from 'src/hooks/useAuth'
import CompanyService from 'src/modules/company/services/company-service'

export type DefaultCompanyProviderData = {
  loading: boolean
  ready: boolean
  company: Company | null
  service: CompanyService
  setLoading: (value: boolean) => void
  setCompany: (value: Company | null) => void
}

// ** Defaults
const defaultProvider: DefaultCompanyProviderData = {
  company: null,
  service: new CompanyService(),
  loading: false,
  ready: false,
  setCompany: () => null,
  setLoading: () => Boolean
}

const CompanyContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const CompanyProvider = ({ children }: Props) => {
  const { user } = useAuth()

  // ** States
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [ready, setReady] = useState<boolean>(false)
  const [company, setCompany] = useState<Company | null>(null)

  const service = new CompanyService()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _ = new URL(window.location.href).hostname
      if (company === null && _ !== '') {
        service.getCompanyByUrl(_).then(data => {
          if (data) setCompany(data)
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initProvider = async () => {
    setReady(false)
    setLoading(true)
    if (user) {
      const userService = new UserService()
      setCompany(await userService.getUserCompany())
    }
    setReady(true)
    setLoading(false)
  }

  useEffect(() => {
    if (!ready) initProvider()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const values = {
    company,
    service,
    loading,
    ready,
    setCompany,
    setLoading
  }

  return <CompanyContext.Provider value={values}>{children}</CompanyContext.Provider>
}

export { CompanyContext, CompanyProvider }
