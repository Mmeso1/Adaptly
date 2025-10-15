// Type definitions for pdfjs-dist
declare module "pdfjs-dist" {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }

  export interface TextContent {
    items: TextItem[];
  }

  export interface TextItem {
    str: string;
    transform: number[];
    width: number;
    height: number;
    dir: string;
    fontName: string;
  }

  export interface LoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export function getDocument(src: { data: ArrayBuffer }): LoadingTask;
}
