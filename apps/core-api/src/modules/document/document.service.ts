import type { DesignKey, DocumentTemplateData } from '@flow-ledger/document-templates';
import { DESIGNS, renderDesign } from '@flow-ledger/document-templates';
import { Injectable, NotFoundException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  private async fetchTemplateData(documentId: string): Promise<DocumentTemplateData> {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { tenantSnapshot: true, customer: true, items: { include: { supplier: true } } },
    });

    if (!doc) throw new NotFoundException(`Document ${documentId} not found`);
    if (!doc.tenantSnapshot) throw new NotFoundException(`Tenant snapshot missing for document ${documentId}`);

    return {
      type: doc.type,
      number: doc.number,
      issueDate: doc.issueDate,
      dueDate: doc.dueDate,
      notes: doc.notes,
      subtotal: doc.subtotal,
      totalAmount: doc.totalAmount,
      tenant: {
        name: doc.tenantSnapshot.name,
        email: doc.tenantSnapshot.email,
        phone: doc.tenantSnapshot.phone,
        address: doc.tenantSnapshot.address,
        city: doc.tenantSnapshot.city,
        country: doc.tenantSnapshot.country,
        logoUrl: doc.tenantSnapshot.logoUrl,
      },
      customer: doc.customer ? { name: doc.customer.name, phone: doc.customer.phone, email: doc.customer.email, address: doc.customer.address } : null,
      items: doc.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        supplier: item.supplier ? { name: item.supplier.name } : null,
      })),
    };
  }

  async renderHtml(documentId: string, design: DesignKey = 'A'): Promise<string> {
    const data = await this.fetchTemplateData(documentId);
    const key = DESIGNS.includes(design) ? design : 'A';
    return renderDesign(key, data);
  }

  async generatePdf(documentId: string, design: DesignKey = 'A'): Promise<Buffer> {
    const html = await this.renderHtml(documentId, design);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
