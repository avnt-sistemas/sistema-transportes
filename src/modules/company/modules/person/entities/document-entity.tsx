import Entity from 'src/modules/common/interfaces/entity'
import Document, { DocumentType, getDocumentsName } from 'src/modules/common/interfaces/document'

import TextField from 'src/modules/common/fields/text'
import { DynamicField } from 'src/components/form/update'
import TextColumn from 'src/modules/common/columns/text'
import { TFunction } from 'i18next'
import { Typography } from '@mui/material'
import { AnyObjectSchema } from 'yup'

import * as yup from 'yup'
import { GridColDef } from '@mui/x-data-grid'

import { HasDocuments } from 'src/modules/common/interfaces/relations/has-document'
import BaseEntity from 'src/modules/common/entities/base-entity'
import { clearNumber, formatCNPJ, formatCPF } from 'src/@core/utils/format'
import DocumentField from 'src/modules/common/fields/document'

export default class DocumentEntity extends BaseEntity implements Entity<Document> {
  name = 'document'
  plural = 'documents'

  data!: Document

  master: HasDocuments

  get id(): number {
    return this.data.id
  }

  constructor(t: TFunction<'translation', undefined, 'translation'>, master: HasDocuments, data?: Document) {
    super(t)
    this.master = master
    if (data) this.setData(data)
    else this.clear()
  }

  setData(data: Document) {
    this.data = {
      id: data.id || -1,
      type: data.type || 'other',
      value: ['cpf', 'cpnj'].includes(data.type) ? clearNumber(data.value || '') : data.value || ''
    }
  }

  clear() {
    this.data = {
      id: -1,
      type: 'other',
      value: ''
    }
  }

  fields(): DynamicField[] {
    return [
      {
        name: 'type',
        component: props => <TextField {...props} type='hidden' />
      },
      {
        name: 'value',
        component: props => <DocumentField {...props} required />
      }
    ]
  }

  columns(): GridColDef[] {
    return [
      TextColumn({
        name: 'type',
        t: this.t,
        width: 150,
        formatValue: row => (
          <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {getDocumentsName(row.type as DocumentType)}
          </Typography>
        )
      }),
      TextColumn({
        name: 'value',
        t: this.t,
        minWidth: 250,
        formatValue: row => {
          switch (row.type as DocumentType) {
            case 'cpf':
              return formatCPF(row.value)
            case 'cnpj':
              return formatCNPJ(row.value)
            case 'rg':
              return row.value
            case 'other':
              return row.value
          }
        }
      })
    ]
  }

  schema(): AnyObjectSchema {
    return yup.object().shape({
      value: yup.string().required()
    })
  }

  async get(i: number) {
    this.setData(this.master.document(i))
  }

  async save() {
    if (this.id >= 0) {
      this.master.setDocument(this.id, this.data)
    } else {
      const n = { ...this.data, id: this.master.documents.length + 1 }
      this.setData(n)
      this.master.addDocument(n)
    }
  }

  async delete() {
    if (this.id >= 0) this.master.removeDocument(this.id)
    else throw new Error('index is required for this!')

    return true
  }
}
