import i18next from 'i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt-BR',

    ns: ['default'],
    defaultNS: 'default',

    supportedLngs: ['pt-BR', 'en'],

    backend: {
      loadPath: '/i18n/{{lng}}.json' // Caminho relativo aos arquivos de tradução no diretório /public/i18n/
    }
  })
