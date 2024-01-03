import { HorizontalNavItemsType } from 'src/@core/layouts/types'
import modules from '../common/modules'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    path: '/home',
    icon: 'tabler:smart-home'
  },
  ...modules.map(module => ({
    title: module.title,
    path: module.path,
    icon: module.icon
  }))
]

export default navigation
