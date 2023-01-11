import { join } from 'path';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';

export type GetOdsRowFn<Data> = (data: Data) => (string | number)[]

export class ManualOdsLibrary {
  private readonly encodingSettings = { encoding: 'utf8' as BufferEncoding }
  // Путь к папке с распакованными ods файлами
  private unzipFolderPath = join(process.cwd(), 'excel-unzip')
  // Путь к конкретному распакованному ods файлу
  private readonly unzippedOdsPath: string
  // Путь к файлу content.xml
  private readonly contentPath: string

  // Номер п/п последней строки
  private indexNumber: number = 0

  // Последняя часть в content.xml
  private lastPart: string = ''

  constructor(folderName: string) {
    this.unzippedOdsPath = join(this.unzipFolderPath, folderName)
    this.contentPath = join(this.unzippedOdsPath, 'content.xml')
  }

  async prepareToEdit() {
    let content = readFileSync(this.contentPath, this.encodingSettings)

    const endIndex = content.indexOf('</table:table>')
    this.lastPart = content.slice(endIndex, content.length)
    writeFileSync(this.contentPath, content.slice(0, endIndex), this.encodingSettings)
  }

  // По переданной data формируем тэги и добавляем их к content.xml
  appendData<Data>(data: Data[], getRowData: GetOdsRowFn<Data>) {
    let contentTags = ''
    data.forEach(d => {
      this.indexNumber++
      const columns = getRowData(d)
      contentTags += this.getTableRow(columns.map(c => this.sanitizeValue(c)))
    })
    this.appendToContent(contentTags)
  }

  end() {
    this.appendToContent(this.lastPart)
  }

  // Добавляет тэги к content.xml
  private appendToContent(tags: string) {
    appendFileSync(this.contentPath, tags)
  }

  private getTableRow(columns: string[]) {
    return `<table:table-row>
      <table:table-cell office:value-type="float" office:value="${this.indexNumber}">
        <text:p>${this.indexNumber}</text:p>
      </table:table-cell>
      ${columns.map(c =>
        `<table:table-cell office:value-type="string">
          <text:p>${c}</text:p>
        </table:table-cell>`)
        .join('')}
    </table:table-row>`
  }

  private sanitizeValue(data: string | number) {
    const lt = /</gm
    const gt = />/gm
    const ampersand = /&/gm
    const singleQuote = /'/gm
    const doubleQuote = /"/gm
    return (data + '')
      .replace(lt, '&#60;')
      .replace(gt, '&#62;')
      .replace(ampersand, '&#38;')
      .replace(singleQuote, '&#39;')
      .replace(doubleQuote, '&#34;')
  }
}