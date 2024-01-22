import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  IImageResponse,
  ISwapi,
  ListOfSections,
  TypeListOfSections,
} from '@services/swapi/swapiService.types';
import {
  IFilms,
  IPeople,
  IStarships,
  IVehicles,
} from '@services/swapi/swapiSections.types';

@Injectable({ providedIn: 'root' })
export class SwapiService {
  private swapiUrl = 'https://swapi.dev/api/';

  constructor(private http: HttpClient) {}

  getAllStarships(search?: string): Observable<ISwapi<IStarships[]>> {
    return this.fetchAllFactory(ListOfSections.Starships, search);
  }
  getAllFilms(search?: string): Observable<ISwapi<IFilms[]>> {
    return this.fetchAllFactory(ListOfSections.Films, search);
  }

  getAllVehicles(search?: string): Observable<ISwapi<IVehicles[]>> {
    return this.fetchAllFactory(ListOfSections.Vehicles, search);
  }
  getPearsonById(id: string) {
    return this.http
      .get<IPeople>(`${this.swapiUrl}/people/${id}`)
      .pipe(
        catchError(this.handleError<IPeople>('getPearsonById', [] as never)),
      );
  }

  private fetchAllFactory<T extends TypeListOfSections>(
    sections: ListOfSections,
    search?: string,
  ) {
    return this.http
      .get<
        ISwapi<T>
      >(`${this.swapiUrl}/${sections}${search && `?search=${search}`}`)
      .pipe(
        catchError(this.handleError<ISwapi<T>>('fetchAllFactory', [] as never)),
      );
  }
  getImageByName(imageName: string) {
    const CLIENT_ID = '7E8YIpAUemGyBQ1hymL_xdBZ6Ceiv4ojE_GpRLxs2Ic';
    const URL = `https://api.unsplash.com/search/photos?page=1&query=${imageName}&client_id=${CLIENT_ID}&content_filter=high`;
    return this.http.get<IImageResponse>(URL);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
