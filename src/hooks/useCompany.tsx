import { useContext } from 'react'
import { CompanyContext } from 'src/context/CompanyContext'

export const useCompany = () => useContext(CompanyContext)
