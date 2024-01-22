import { Component, Input } from '@angular/core';
import {
  ISwapiSectionsParsedTypes,
  TListOfSectionsItem,
  TtypeA,
} from '@services/swapi/swapiService.types';
import { SwapiService } from '@services/swapi/SwapiService';
import { forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tab-group',
  standalone: true,
  imports: [
    TabViewModule,
    CardModule,
    DataViewModule,
    ButtonModule,
    NgIf,
    DialogModule,
  ],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css',
})
export class TabGroupComponent {
  @Input() sectionData!: ISwapiSectionsParsedTypes;
  moreDetailsInfo: TListOfSectionsItem | TtypeA | undefined;
  isModlaWindowOpen = true;
  constructor(private swapiService: SwapiService) {}

  getItemName(item: TListOfSectionsItem | TtypeA) {
    if ('name' in item) {
      return item?.name;
    } else if ('title' in item) {
      return item?.title;
    }
    return '';
  }

  getSubHeaderTitle(item: TListOfSectionsItem | TtypeA) {
    if ('manufacturer' in item) {
      return item?.manufacturer;
    } else if ('producer' in item) {
      return item?.producer;
    }
    return '';
  }
  getMoreDetails(sectionName: string, id: number) {
    const selectedItem = this.sectionData.filter(
      (section) => section.name === sectionName,
    )[0].results[id];

    this.moreDetailsInfo = selectedItem;
    this.isModlaWindowOpen = true;
    for (const key in selectedItem) {
      const isPilot =
        key === 'pilots' &&
        'pilots' in selectedItem &&
        selectedItem[key].length;

      if (isPilot) {
        this.moreDetailsInfo = {
          ...selectedItem,
          pilots: 'data is loading...',
        };

        const pil = selectedItem[key].map((item: string) => {
          const pilotIds = item.match(/\d+/)?.join('');
          return this.swapiService.getPearsonById(pilotIds!);
        });

        forkJoin([...pil]).subscribe((data) => {
          this.moreDetailsInfo = {
            ...selectedItem,
            pilots: data.map((item) => item.name).join(','),
          };
        });
      }
    }

    const name = this.getItemName(this.moreDetailsInfo) as string;
    this.swapiService.getImageByName(name).subscribe((data) => {
      this.moreDetailsInfo = {
        ...selectedItem,
        image: data.results[0].urls.regular,
      };
    });
  }

  protected readonly Object = Object;
}
