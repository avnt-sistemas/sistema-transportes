import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Entity from 'src/modules/common/interfaces/entity'
import UpdateModelPage from 'src/modules/common/views/page/update-page'
import { getModule } from 'src/navigation/common/modules'

export async function getServerSideProps({ params }: any) {
  const { module, id } = params

  return {
    props: {
      module,
      id
    }
  }
}

export default function ModulePage({ module, id }: { module: string; id: string }) {
  const { t } = useTranslation()

  const [entity, setEntity] = useState<Entity<any> | undefined>(undefined)
  const [data, setData] = useState<any | undefined>(undefined)

  function getEntity() {
    const ModuleClass = getModule(module).class

    setEntity(new ModuleClass(t))
  }

  useEffect(() => {
    if (module && id) getEntity()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, id])

  useEffect(() => {
    if (entity !== undefined) {
      if (id !== 'create') {
        const resp = entity.get(id)
        if (resp instanceof Promise) {
          resp.then(record => setData(record))
        } else setData(resp)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity])

  return (
    entity !== undefined &&
    entity.plural === module && <UpdateModelPage data={data} model={entity} key={module + '-form-page'} />
  )
}
