import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { DocumentService } from './document.service';
import type { DesignKey } from './templates/designs';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Query('design') design: string = 'A', @Res() res: Response): Promise<void> {
    const pdf = await this.documentService.generatePdf(id, design.toUpperCase() as DesignKey);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="document-${id}.pdf"`);
    res.setHeader('Content-Length', pdf.length);
    res.end(pdf);
  }

  /** Preview any design in the browser: GET /documents/:id/preview?design=A */
  @Get(':id/preview')
  async previewHtml(@Param('id') id: string, @Query('design') design: string = 'A', @Res() res: Response): Promise<void> {
    const html = await this.documentService.renderHtml(id, design.toUpperCase() as DesignKey);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  }
}
