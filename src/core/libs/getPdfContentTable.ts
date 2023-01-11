import { ContentTable, Size } from 'pdfmake/interfaces';

type GetPdfContentTableProps<Data> = {
  header: string[]
  data: Data[]
  getDataRow: (data: Data) => string[]
  widths?: '*' | 'auto' | Size[]
}

export const getPdfContentTable = <Data>({ getDataRow, header, data, widths }: GetPdfContentTableProps<Data>) => {
  const contentTable: ContentTable = {
    table: {
      widths,
      body: [
        header
      ]
    }
  }

  data.forEach((d, i) => {
    const row = getDataRow(d)
    contentTable.table.body.push([i + 1, ...row])
  })

  return contentTable
}