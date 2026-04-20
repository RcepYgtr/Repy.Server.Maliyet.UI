export interface PrinterDto {
  id: string;
  name: string;
  connectionType: number;
}

export interface PrinterListResponse {
  printers: PrinterDto[];
}

