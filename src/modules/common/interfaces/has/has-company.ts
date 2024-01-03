import Company from 'src/modules/company/interfaces/company'

export default interface HasCompany {
  company_id: string | null

  company: Company | null
}
