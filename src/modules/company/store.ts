import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ModelService from '../common/service/model.service'
import Company from './interfaces/company'

const companyService = new ModelService<Company>('companies')

export const fetchCompanies = createAsyncThunk('company/fetchCompanies', async () => {
  const companies = await companyService.fetch()

  return companies
})

export const createCompany = createAsyncThunk('company/createCompany', async (company: Company) => {
  const newCompany = await companyService.store(company)

  return newCompany
})

export const updateCompany = createAsyncThunk('company/updateCompany', async (company: Company) => {
  const updatedCompany = await companyService.update(company.id!, company)

  return updatedCompany
})

export const deleteCompany = createAsyncThunk('company/deleteCompany', async (id: string) => {
  const result = await companyService.delete(id)

  return result
})

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [] as Company[] | Company[],
    status: 'idle',
    error: null as null | any
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCompanies.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.companies = action.payload
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.companies.push(action.payload)
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const updatedCompany = action.payload
        const existingCompanyIndex = state.companies.findIndex(c => c.id === updatedCompany.id)
        if (existingCompanyIndex !== -1) {
          state.companies[existingCompanyIndex] = updatedCompany
        }
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.status = 'succeeded'

        if (action.payload) {
          const id = action.meta.arg
          state.companies = state.companies.filter(c => c.id !== id)
        }
      })
  }
})

export default companySlice.reducer
