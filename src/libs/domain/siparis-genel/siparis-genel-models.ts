export enum ProjeType {
  // Kabin = 1,
  // Buton = 2,
  // Suspansiyon = 3,
  // LKarkas = 4,
  // Agirlik = 5,
  // Makine = 6

  KABIN = 1,
  BUTON = 2,
  SUSPANSIYON = 3,
  LKARKAS = 4,
  AGIRLIK = 5,
  MAKINE = 6
}

export interface GrafikSeries {
  title: string;
  data: { [key: string]: number };
}

export interface GrafikResult {
  series: GrafikSeries[];
}







export interface GrafikSeriesDto {
  title: string;
  data: { [key: string]: number };
}

export interface GrafikResultDto {
  series: GrafikSeriesDto[];
  detailAnalysis:any;
}
export interface ModelBreakdown {
  name: string;
  thisYearCount: number;
  lastYearCount: number;
  difference: number;
  differencePercent: number;
}

export interface CreateImalatFormuExcelQueryResponse {
  fileContent: string;   // base64 gelir
  firma: string;
  seriNo: number;
  referans: string;
  siparisTarihi?: string;
  teslimTarihi?: string;
}