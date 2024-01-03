import { useTranslation } from 'react-i18next'
import Entity, { Relation } from '../interfaces/entity'
import UpdateForm, { DynamicField, DynamicFormProps } from 'src/components/form/update'
import { Card, CardContent, CardHeader, Collapse, Grid, IconButton, Theme, capitalize } from '@mui/material'
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

function UpdateModel({ model }: { model: Entity<any> }) {
  //Hooks
  const { t, i18n } = useTranslation()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const withRelations = useCallback(() => {
    return model.relations && model.relations().length > 0 ? true : false
  }, [model])

  //States
  const [activeTab, setActiveTab] = useState<string>(withRelations() ? model.relations!()[0].name : '')
  const [showed, showCard] = useState<boolean>(true)
  const [fields, setFields] = useState<DynamicField[]>([])
  const [columns, setColumns] = useState<GridColDef[]>([])

  useEffect(() => {
    if (i18n.language === 'pt-BR') yup.setLocale(pt)
  }, [i18n.language])

  useEffect(() => {
    if (model) {
      const fields = model.fields()
      if (fields instanceof Promise) {
        fields.then(resp => setFields(resp))
      } else setFields(fields)

      const c = model.columns()
      if (c instanceof Promise) {
        c.then(resp => setColumns(resp))
      } else setColumns(c)
    }
  }, [model])

  function handleChange(event: SyntheticEvent, value: string) {
    setActiveTab(value)
  }

  function onSubmit(data: any) {
    model.setData(data)

    return model.save()
  }

  const formProps: DynamicFormProps = {
    title: model.title('form', t),
    yupSchema: model.schema ? model.schema() : undefined,
    record: model,
    fields,
    onSubmit
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} {...(!!model.relations && { md: 5, lg: 4 })}>
        <Card>
          <CardHeader
            title={model.title('form', t)}
            {...(hidden
              ? {}
              : {
                  action: (
                    <IconButton onClick={() => showCard(!showed)}>
                      <Icon icon={!showed ? 'mingcute:down-fill' : 'mingcute:up-fill'} fontSize={20} />
                    </IconButton>
                  )
                })}
          />
          <Collapse in={showed}>
            <CardContent sx={{ p: 0 }}>
              <UpdateForm {...formProps} />
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
                  {model.relations!().map((tab: Relation, index: number) => (
                    <Tab key={index} value={tab.name} label={tab.title || capitalize(t(tab.name))} icon={tab.icon} />
                  ))}
                </TabList>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                {model.relations!().map((tab: Relation, index: number) => (
                  <TabPanel sx={{ p: 0 }} value={tab.name} key={index}>
                    {tab.title}
                    <List columns={columns} data={tab.data || []} searchTerms='' />
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

export default UpdateModel
