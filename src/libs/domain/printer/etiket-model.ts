import { EtiketType } from "../../shared/enums/etiket-type";
import { ProcessType } from "../../shared/enums/process-type";

export interface KabinEtiketData {
  Firma: string;
  Referans: string;
  ParcaAdi: string;
  Kapasite: string;
  ImalatKodu: string;
}

export interface LabelField {
  type: string;
  field?: string;        // dynamic
  staticText?: string;   // sabit başlık
  x: number;
  y: number;
  fontSize: number;
}


export interface LabelLayout {
  etiketType: EtiketType,
  processType: ProcessType,
  widthMm: number;
  heightMm: number;
  dpi: number;
  fields: LabelField[];
}