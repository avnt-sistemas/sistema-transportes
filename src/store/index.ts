// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import company from 'src/modules/company/store'

export const store = configureStore({
  reducer: {
    company
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
