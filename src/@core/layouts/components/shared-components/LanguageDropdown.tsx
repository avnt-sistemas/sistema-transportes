// ** React Import
import { useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

import * as yup from 'yup'
import { pt } from 'yup-locale-pt'
import { useRouter } from 'next/router'

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()
  const router = useRouter()

  const handleLangItemClick = (lang: 'en' | 'pt-BR') => {
    i18n.changeLanguage(lang)
    if (i18n.language === 'pt-BR') yup.setLocale(pt)
    else router.reload()
  }

  useEffect(() => {
    if (i18n.language === 'pt-BR') yup.setLocale(pt)
    else yup.setLocale(yup.defaultLocale)
  }, [i18n.language])

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language])

  function getSelectedIcon(): string {
    switch (i18n.language) {
      case 'pt-BR':
        return 'emojione-v1:flag-for-brazil'
      case 'en':
        return 'twemoji:flag-us-outlying-islands'
    }

    return 'tabler:language'
  }

  return (
    <OptionsMenu
      iconButtonProps={{ color: 'inherit' }}
      icon={<Icon fontSize='1.625rem' icon={getSelectedIcon()} />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
      options={[
        {
          text: 'English',
          icon: <Icon fontSize='1.625rem' icon='twemoji:flag-us-outlying-islands' style={{ marginRight: 10 }} />,
          menuItemProps: {
            sx: { py: 2, display: 'flex', justifyContent: 'space-between' },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Português do Brasil',
          icon: <Icon fontSize='1.625rem' icon='emojione-v1:flag-for-brazil' style={{ marginRight: 10 }} />,
          menuItemProps: {
            sx: { py: 2, display: 'flex', justifyContent: 'space-between' },
            selected: i18n.language === 'pt-BR',
            onClick: () => {
              handleLangItemClick('pt-BR')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
