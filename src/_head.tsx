import { useSettings } from './@core/hooks/useSettings'
import themeConfig from 'src/configs/themeConfig'
import Head from 'next/head'

export default function AppHead() {
  const { settings } = useSettings()

  return (
    <Head>
      <title>{`${settings.title || themeConfig.templateName}`}</title>
      <meta name='description' content={`${themeConfig.templateName}`} />
      <meta name='viewport' content='initial-scale=1, width=device-width' />
    </Head>
  )
}
