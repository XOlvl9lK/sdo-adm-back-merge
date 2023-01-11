import { Content, ContentTable, TDocumentDefinitions } from 'pdfmake/interfaces';
import { join } from 'path';

const PdfPrinter = require('pdfmake')

type GeneratePdfTableProps = {
  contentTable: ContentTable,
  generateDate: string,
  title: string,
  total: number
  filters?: Content[]
}

export const generatePdfTable = ({ generateDate, contentTable, filters, title, total }: GeneratePdfTableProps) => {
  const docDefinition: TDocumentDefinitions = {
    content: [
      generateDate,
      {
        text: title,
        style: 'header',
        margin: [0, 5]
      },
      ...(filters ? filters : []),
      {
        text: [
          { text: 'Всего записей: ', style: 'boldText', margin: [3, 0, 10, 0] },
          total + '',
        ],
      },
      contentTable
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      boldText: {
        bold: true
      }
    },
    pageMargins: [5, 5, 5, 5]
  }

  const printer = new PdfPrinter({
    Roboto: {
      normal: join(process.cwd(), 'fonts', 'Times New Roman.ttf'),
      bold: join(process.cwd(), 'fonts', 'Times New Roman Bold.ttf'),
    }
  })
  return printer.createPdfKitDocument(docDefinition)
}