// ** Type import
import { NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'
import modules from '../common/modules'

let lastSection = ''

const navigation: VerticalNavItemsType = [
  {
    title: 'home',
    path: '/home',
    icon: 'tabler:smart-home'
  }
]

modules.forEach(module => {
  if (lastSection !== module.section) {
    navigation.push({
      sectionTitle: module.section,
      action: 'read',
      subject: [module.subject],
      of_company: module.of_company
    })

    lastSection = module.section
  } else {
    const index = navigation.findIndex(item => (item as any).sectionTitle && (item as any).sectionTitle === lastSection)
    if (index >= 0) {
      const section = navigation[index] as NavSectionTitle
      const subject: string[] = section.subject as string[]
      if (!section.of_company) section.of_company = module.of_company
      if (!subject.includes(module.subject)) subject.push(module.subject)
    }
  }

  navigation.push({
    title: module.title,
    path: module.path,
    icon: module.icon,
    of_company: module.of_company,
    action: 'read',
    subject: module.subject
  })
})

export default () => navigation
