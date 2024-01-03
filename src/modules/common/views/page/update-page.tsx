import UpdateForm, { DynamicField, DynamicFormProps } from 'src/components/form/update'
import { Card, CardContent, CardHeader, Collapse, Grid, IconButton, Theme, Typography, capitalize } from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import List from 'src/components/list'
import * as yup from 'yup'
import { pt } from 'yup-locale-pt'
import Icon from 'src/@core/components/icon'
import useMediaQuery from '@mui/material/useMediaQuery'
import Entity, { Relation } from '../../interfaces/entity'
import { useTranslation } from 'react-i18next'
import UpdateModelDialog from '../dialog/form-dialog'
import { useRouter } from 'next/router'
import { GridColDef } from '@mui/x-data-grid'

// ** Styled Tab component
const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5)
  }
}))

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary[theme.palette.mode],
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary[theme.palette.mode]
    }
  }
}))

yup.setLocale(pt)

interface RelationTab {
  relation: Relation
  selectedRecord?: any
  data: any[]
  opened: boolean
  columns: GridColDef[]
}

export default function UpdateModelPage({ model, data }: { model: Entity<any>; data: any }) {
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { t } = useTranslation()
  const router = useRouter()

  const withRelations = useCallback(() => {
    return model.relations && model.relations().length > 0 ? true : false
  }, [model])

  //States
  const [activeTab, setActiveTab] = useState<string>(withRelations() ? model.relations!()[0].name : '')
  const [showed, toggleCard] = useState<boolean>(true)
  const [relations, setRelations] = useState<RelationTab[]>([])

  const prepareRelations = async () => {
    if (model.relations) {
      const tabs: RelationTab[] = []
      await model.relations().forEach(async relation => {
        const columns = await relation.model.columns()
        tabs.push({
          relation,
          opened: false,
          data: relation.data,
          columns
        })
      })
      setRelations(tabs)
    }
  }

  useEffect(() => {
    prepareRelations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  useEffect(() => {
    if (data && model.relations) {
      prepareRelations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, model])

  function handleChange(event: SyntheticEvent, value: string) {
    setActiveTab(value)
  }

  function back() {
    router.push(`/${model.plural}`)
  }

  function onSubmit(data: any) {
    const dataWithRelations = { ...data }
    relations.forEach(({ relation }) => {
      dataWithRelations[relation.name] = model.data[relation.name]
    })
    model.setData(dataWithRelations)

    const promise = model.save()

    if (promise instanceof Promise) promise.finally(() => back())
    else back()

    return promise
  }

  const [fields, setFields] = useState<DynamicField[]>([])

  useEffect(() => {
    if (model) {
      const fields = model.fields()
      if (fields instanceof Promise) {
        fields.then(resp => setFields(resp))
      } else setFields(fields)
    }
  }, [model])

  const formProps: DynamicFormProps = {
    title: model.title('form'),
    yupSchema: model.schema ? model.schema() : undefined,
    fields,
    onSubmit
  }

  function toggleRelationForm(index: number) {
    const _ = [...relations]
    _[index].opened = !_[index].opened
    _[index].data = model.relations!()[index].data
    _[index].selectedRecord = model.relations!()[index].model
    setRelations(_)
  }

  function updateRelations(index: number) {
    const _ = [...relations]
    _[index].data = model.relations!()[index].data
    setRelations(_)
  }

  function handleCreateRelation(index: number) {
    model.relations!()[index].model.clear()
    toggleRelationForm(index)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton sx={{ mr: 1 }} onClick={() => back()}>
          <Icon icon='ion:chevron-back' />
        </IconButton>
        <Typography variant='h4'>{model.title('form')}</Typography>
      </Grid>
      <Grid item xs={12} {...(!!model.relations && { md: 5, lg: 4 })}>
        <Card sx={{ pb: 2 }}>
          <CardHeader
            title={capitalize(t('data'))}
            {...(hidden && {
              action: (
                <IconButton onClick={() => toggleCard(!showed)}>
                  <Icon icon={!showed ? 'mingcute:down-fill' : 'mingcute:up-fill'} fontSize={20} />
                </IconButton>
              )
            })}
          />
          <Collapse in={showed}>
            <CardContent sx={{ p: 0, pb: '0!important' }}>
              <UpdateForm key={model.name} {...formProps} record={data} />
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
      {withRelations() && (
        <Grid item xs={12} md={7} lg={8}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  allowScrollButtonsMobile={true}
                  onChange={handleChange}
                  aria-label='forced scroll tabs example'
                  sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                >
                  {relations.map((tab, index) => (
                    <Tab key={index} value={tab.relation.name} label={tab.relation.title} icon={tab.relation.icon} />
                  ))}
                </TabList>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                {relations.map((tab, index) => (
                  <TabPanel sx={{ p: 0 }} value={tab.relation.name} key={index}>
                    <List
                      columns={tab.columns}
                      data={tab.data || []}
                      key={tab.relation.name}
                      model={tab.relation.model}
                      addButtonText={capitalize(t('new'))}
                      hideActionColumn={tab.relation.readOnly}
                      handleCreate={tab.relation.readOnly ? undefined : () => handleCreateRelation(index)}
                      afterUpdate={tab.relation.readOnly ? undefined : () => toggleRelationForm(index)}
                      afterRemove={tab.relation.readOnly ? undefined : () => updateRelations(index)}
                    />

                    <UpdateModelDialog
                      key={tab.relation.name + '-relation-form'}
                      opened={tab.opened}
                      model={tab.selectedRecord || tab.relation.model}
                      onClose={() => toggleRelationForm(index)}
                      afterSave={() => toggleRelationForm(index)}
                    />
                  </TabPanel>
                ))}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}
