'use client'

import dynamic from 'next/dynamic'

function ToolLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )
}

const toolMap = {
  'pdf-to-word':       dynamic(() => import('@/components/tools/PdfToWord')),
  'word-to-pdf':       dynamic(() => import('@/components/tools/WordToPdf')),
  'image-to-pdf':      dynamic(() => import('@/components/tools/ImageToPdf')),
  'excel-pdf':         dynamic(() => import('@/components/tools/ExcelToPdf')),
  'text-to-pdf':       dynamic(() => import('@/components/tools/TextToPdf')),
  'pdf-to-jpg':        dynamic(() => import('@/components/tools/PdfToJpg')),
  'add-watermark':     dynamic(() => import('@/components/tools/AddWatermark')),
  'ppt-to-pdf':        dynamic(() => import('@/components/tools/PptToPdf')),
  'protect-pdf':       dynamic(() => import('@/components/tools/ProtectPdf')),
  'unlock-pdf':        dynamic(() => import('@/components/tools/UnlockPdf')),
  'rotate-pdf':        dynamic(() => import('@/components/tools/RotatePdf')),
  'sign-pdf':          dynamic(() => import('@/components/tools/SignPdf')),
  'ocr-pdf':           dynamic(() => import('@/components/tools/OCRPdf'), { ssr: false, loading: ToolLoading }),
  'edit-pdf':          dynamic(() => import('@/components/tools/EditPdf')),
  'pdf-to-excel':      dynamic(() => import('@/components/tools/PdfToExcel')),
  'remove-pages':      dynamic(() => import('@/components/tools/RemovePages')),
  'add-page-numbers':  dynamic(() => import('@/components/tools/AddPageNumbers')),
  'html-to-pdf':       dynamic(() => import('@/components/tools/HtmlToPdf'), { ssr: false, loading: ToolLoading }),
  'pdf-to-png':        dynamic(() => import('@/components/tools/PdfToPng')),
  'pdf-to-text':       dynamic(() => import('@/components/tools/PdfToText')),
  'organize-pdf':      dynamic(() => import('@/components/tools/OrganizePdf')),
  'crop-pdf':          dynamic(() => import('@/components/tools/CropPdf')),
  'extract-pdf':       dynamic(() => import('@/components/tools/ExtractPdf')),
  'redact-pdf':        dynamic(() => import('@/components/tools/RedactPdf')),
  'repair-pdf':        dynamic(() => import('@/components/tools/RepairPdf')),
  'pdf-to-powerpoint': dynamic(() => import('@/components/tools/PdfToPowerPoint')),
  'ai-summarize':      dynamic(() => import('@/components/tools/AiSummarize'), { ssr: false, loading: ToolLoading }),
  'translate-pdf':     dynamic(() => import('@/components/tools/AiTranslate'), { ssr: false, loading: ToolLoading }),
  'chat-with-pdf':     dynamic(() => import('@/components/tools/AiChat'), { ssr: false, loading: ToolLoading }),
}

export default function ToolLoader({ tool, seo }) {
  const Component = toolMap[tool]
  if (!Component) return null
  return <Component seo={seo} />
}