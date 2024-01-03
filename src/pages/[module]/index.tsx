import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Entity from 'src/modules/common/interfaces/entity'
import ModelList from 'src/modules/common/views/list'
import { getModule } from 'src/navigation/common/modules'

export async function getServerSideProps({ params }: any) {
  const { module } = params

  return {
    props: {
      module
    }
  }
}

export default function ModulePage({ module }: { module: string }) {
  const { t } = useTranslation()
  const router = useRouter()

  const [entity, setEntity] = useState<Entity<any> | undefined>(undefined)

  function getEntity() {
    const ModuleClass = getModule(module).class

    setEntity(new ModuleClass(t))
  }

  useEffect(() => {
    if (!router.isReady) return

    if (module) getEntity()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, router])

  return entity !== undefined && entity.plural === module && <ModelList model={entity} key={module + '-list'} />
}
