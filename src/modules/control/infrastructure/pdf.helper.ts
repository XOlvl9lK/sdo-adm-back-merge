import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { compile } from 'handlebars';
import { launch, PDFOptions } from 'puppeteer';
import { Response } from 'express';

export class PdfHelper {
  private readonly options: PDFOptions;
  private document: string;
  private compiled: HandlebarsTemplateDelegate;

  constructor(options?: PDFOptions) {
    this.options = options || {};
  }

  template(templateName: string) {
    this.compiled = compile(readFileSync(join(process.cwd(), 'pdf-templates', templateName), 'utf8'));
    return this;
  }

  data(data: any) {
    this.document = this.compiled(data);
    return this;
  }

  async write(response: Response) {
    const browser = await launch({
      args: ['--no-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${this.document}`, {
      waitUntil: 'networkidle0',
    });
    const pdf = await page.pdf();
    response.end(pdf);
  }

  async writeRawString(html: string, response: Response) {
    const browser = await launch({
      args: ['--no-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: ['domcontentloaded', 'networkidle2', 'networkidle0'],
    });
    const pdf = await page.pdf(this.options);
    response.end(pdf);
  }
}
