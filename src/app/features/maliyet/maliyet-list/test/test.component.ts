import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { DimentionService } from '../../../../../libs/core/api/dimention.service';
import { KabinCostService } from '../../../../../libs/core/api/kabin/kabin-cost.service';
import { debounceTime } from 'rxjs';
import { KabinTypeService } from '../../../../../libs/core/api/kabin/kabin-type.service';
export interface CapacityCost {
  capacity: number;
  totalCost: number;
  laborCost: number;
  materialCost: number;
}

export interface ModelCost {
  modelName: string;
  minCost: number;
  maxCost: number;
  capacities: CapacityCost[];
}

export const MOCK_DATAS: ModelCost[] = [
  {
    modelName: 'Beluga ',
    minCost: 10000,
    maxCost: 15000,
    capacities: [
      { capacity: 320, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 430, totalCost: 20000, laborCost: 3000, materialCost: 7000 },
      { capacity: 480, totalCost: 30000, laborCost: 3000, materialCost: 7000 },
      { capacity: 630, totalCost: 40000, laborCost: 3000, materialCost: 7000 },
      { capacity: 800, totalCost: 12500, laborCost: 4000, materialCost: 8500 },
      { capacity: 1000, totalCost: 15000, laborCost: 5500, materialCost: 9500 },
      { capacity: 1200, totalCost: 16000, laborCost: 5600, materialCost: 9600 },
      { capacity: 1400, totalCost: 17000, laborCost: 5700, materialCost: 9700 },
      { capacity: 1600, totalCost: 18000, laborCost: 5800, materialCost: 9800 },
    ]
  },
  {
    modelName: 'Satine Paslanmaz ',
    minCost: 10000,
    maxCost: 15000,
    capacities: [
      { capacity: 320, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 430, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 480, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 630, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 800, totalCost: 12500, laborCost: 4000, materialCost: 8500 },
      { capacity: 1000, totalCost: 15000, laborCost: 5500, materialCost: 9500 },
      { capacity: 1200, totalCost: 16000, laborCost: 5600, materialCost: 9600 },
      { capacity: 1400, totalCost: 17000, laborCost: 5700, materialCost: 9700 },
      { capacity: 1600, totalCost: 18000, laborCost: 5800, materialCost: 9800 },
    ]
  },
  {
    modelName: 'Vatoz',
    minCost: 10000,
    maxCost: 15000,
    capacities: [
      { capacity: 320, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 430, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 480, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 630, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 800, totalCost: 12500, laborCost: 4000, materialCost: 8500 },
      { capacity: 1000, totalCost: 15000, laborCost: 5500, materialCost: 9500 },
      { capacity: 1200, totalCost: 16000, laborCost: 5600, materialCost: 9600 },
      { capacity: 1400, totalCost: 17000, laborCost: 5700, materialCost: 9700 },
      { capacity: 1600, totalCost: 18000, laborCost: 5800, materialCost: 9800 },
    ]
  },
  {
    modelName: 'Orfoz',
    minCost: 10000,
    maxCost: 15000,
    capacities: [
      { capacity: 320, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 430, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 480, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 630, totalCost: 10000, laborCost: 3000, materialCost: 7000 },
      { capacity: 800, totalCost: 12500, laborCost: 4000, materialCost: 8500 },
      { capacity: 1000, totalCost: 15000, laborCost: 5500, materialCost: 9500 },
      { capacity: 1200, totalCost: 16000, laborCost: 5600, materialCost: 9600 },
      { capacity: 1400, totalCost: 17000, laborCost: 5700, materialCost: 9700 },
      { capacity: 1600, totalCost: 18000, laborCost: 5800, materialCost: 9800 },
    ]
  }

];
@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
  ngOnInit(): void {
    this.selectModel(this.models[0]); // 🔥 default yükle
  }



  datas: ModelCost[] = MOCK_DATAS;

  selectedDetail?: {
    model: string;
    data: CapacityCost;
  };

  openDetail(model: string, data: CapacityCost) {
    this.selectedDetail = { model, data };
  }


  // accounts = [
  //   {
  //     name: 'Beluga Model',
  //     prev: 10923510,
  //     current: 3389700,
  //     forecast: 11126300,
  //     capacities: [
  //       { capasite: 320, total: 1000, material: 3400, labor: 124124 },
  //       { capasite: 480, total: 1000, material: 3400, labor: 124124 },
  //       { capasite: 630, total: 1000, material: 3400, labor: 124124 },
  //       { capasite: 800, total: 1000, material: 3400, labor: 124124 },
  //       { capasite: 1000, total: 1500, material: 5000, labor: 2000 },
  //       { capasite: 1200, total: 2000, material: 7000, labor: 3000 },
  //       { capasite: 1400, total: 2000, material: 7000, labor: 3000 },
  //       { capasite: 1600, total: 2000, material: 7000, labor: 3000 }
  //     ],
  //     chartData: {
  //       labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  //       datasets: [
  //         {
  //           data: [10000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000],
  //           backgroundColor: '#e6b87d'
  //         }
  //       ]
  //     }
  //   },

  // ];

  filters = {
    askiTipi: '',
    rayArasi: null,
    kapasite: null
  };

  askiTipleri = ['2:1', '1:1', '4:1'];
  kapasiteList = [320, 480, 630, 800, 1000];
  applyFilter() {
    if (!this.selectedModel) return;

    // örnek: kapasite filtre
    let filtered = [...this.account.capacities];

    if (this.filters.kapasite) {
      filtered = filtered.filter(x => x.capasite == this.filters.kapasite);
    }

    // örnek: ray arası etkisi (simülasyon)
    if (this.filters.rayArasi) {
      filtered = filtered.map(x => ({
        ...x,
        total: x.total + (this.filters.rayArasi * 2)
      }));
    }

    // 👉 tablo güncelle
    this.account.capacities = filtered;

    // 👉 chart güncelle
    this.account.chartData = {
      ...this.createChart(filtered.map(x => x.total))
    };
  }

  resetFilter() {
    this.filters = {
      askiTipi: '',
      rayArasi: null,
      kapasite: null
    };

    // modeli tekrar yükle
    this.selectModel(this.selectedModel);
  }
  account: any = null;   // 🔥 TEK OBJE

  models = [
    { model: 'Beluga' },
    { model: 'Satine paslanmaz' },
  ];

  selectedModel: any = null;
  selectModel(item: any) {
    this.selectedModel = item;

    if (item.model === 'Beluga') {
      this.account =
      {
        name: 'Beluga Model',
        prev: 10923510,
        current: 3389700,
        forecast: 11126300,
        capacities: [
          { capasite: 320, total: 1000, material: 3400, labor: 124124 },
          { capasite: 480, total: 1000, material: 3400, labor: 124124 },
          { capasite: 630, total: 1000, material: 3400, labor: 124124 },
          { capasite: 800, total: 1000, material: 3400, labor: 124124 },
          { capasite: 1000, total: 1500, material: 5000, labor: 2000 },
          { capasite: 1200, total: 2000, material: 7000, labor: 3000 },
          { capasite: 1400, total: 2000, material: 7000, labor: 3000 },
          { capasite: 1600, total: 2000, material: 7000, labor: 3000 }
        ],
        chartData: {
          labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
          datasets: [
            {
              data: [10000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000],
              backgroundColor: '#e6b87d'
            }
          ]
        }
      }
    }

    if (item.model === 'Satine paslanmaz') {
      this.account = {
        name: 'Satine Model',
        prev: 5000000,
        current: 2000000,
        forecast: 7000000,
        capacities: [
          { capasite: 630, total: 2000, material: 4000, labor: 1500 }
        ],
        chartData: {
          labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
          datasets: [
            {
              data: [10000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000],
              backgroundColor: '#e6b87d'
            }
          ]
        }
      };
    }
  }

  createChart(values: number[]) {
    return {
      labels: ['Ocak', 'Şubat', 'Mart'],
      datasets: [
        {
          data: values,
          backgroundColor: '#e6b87d'
        }
      ]
    };
  }

}