import {
  IFilms,
  IStarships,
  IVehicles,
} from '@services/swapi/swapiSections.types';

export type TypeListOfSections = IStarships[] | IFilms[] | IVehicles[];

export type TListOfSectionsItem = (IStarships | IFilms | IVehicles) & {
  image?: string;
};
export interface ISwapi<T extends TypeListOfSections> {
  count: number;
  next: string;
  previous: string;
  name: string;
  results: T & { image?: string };
}

export enum ListOfSections {
  Starships = 'starships',
  Films = 'films',
  Vehicles = 'vehicles',
}

export type ISwapiSectionsParsedTypes = (
  | ISwapi<IStarships[]>
  | ISwapi<IFilms[]>
  | ISwapi<IVehicles[]>
)[];

export interface IImageResponse {
  results: {
    urls: {
      full: string;
      raw: string;
      regular: string;
      small: string;
      small_s3: string;
      thumb: string;
    };
  }[];
}

export type TtypeA = (Omit<TListOfSectionsItem, 'pilots'>) & { pilots: string }
