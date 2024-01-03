import { capitalize } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  text: string
  params?: any
  noCapitalize?: boolean
}

const Translations = ({ text, params, noCapitalize = false }: Props) => {
  const { t } = useTranslation()

  const translatedText = noCapitalize ? t(text, params) : capitalize(t(text, params) as unknown as string)

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: translatedText
      }}
    ></span>
  )
}

export default Translations
