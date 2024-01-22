import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwapiService } from '@services/swapi/SwapiService';
import { TabGroupComponent } from './components/tab-group/tab-group.component';
import { FieldsetModule } from 'primeng/fieldset';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { forkJoin } from 'rxjs';
import { ISwapiSectionsParsedTypes } from '@services/swapi/swapiService.types';
import { NgIf } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TabGroupComponent,
    FieldsetModule,
    ToolbarModule,
    ButtonModule,
    ChipsModule,
    NgIf,
    InputGroupModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  swapiSections: ISwapiSectionsParsedTypes | null = null;
  searchValue: string = '';
  isLoading = false;
  constructor(private swapiService: SwapiService) {}
  ngOnInit(): void {
    this.hydration();
  }
  hydration() {
    const localSwapiSections = localStorage.getItem('swapiSections');
    if (!localSwapiSections) {
      this.getAllData();
    } else {
      this.swapiSections = JSON.parse(localSwapiSections);
    }
  }
  onSearch() {
    this.getAllData(this.searchValue, false);
  }
  onReset() {
    this.hydration();
    this.searchValue = '';
  }
  getAllData(search = '', updateLocal = true) {
    this.isLoading = true;

    forkJoin([
      this.swapiService.getAllVehicles(search),
      this.swapiService.getAllStarships(search),
      this.swapiService.getAllFilms(search),
    ]).subscribe(([vehicles, starships, films]) => {
      const swapiResponse = { vehicles, starships, films };

      this.swapiSections = Object.keys(swapiResponse).map((item) => ({
        ...swapiResponse[item as keyof typeof swapiResponse],
        ...{ name: item },
      })) as ISwapiSectionsParsedTypes;

      if (updateLocal) {
        localStorage.setItem(
          'swapiSections',
          JSON.stringify(this.swapiSections),
        );
      }
      this.isLoading = false;
    });
  }
  protected readonly Boolean = Boolean;
}
