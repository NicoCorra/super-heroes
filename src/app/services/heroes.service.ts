import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Heroe } from '../interfaces/heroe.interface';
import { environments } from '../../environments/environments';
import { Utils } from '../shared/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  http = inject(HttpClient) // asi es como se declara la inyeccion de dependencias en angular 18*

  getHeroes():Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroeById(id: string): Observable<Heroe | undefined> {
    return this.http.get<Heroe>(`${this.baseUrl}/heroes/${id}`).pipe(
      catchError(error => {
        return of(undefined);
      })
    );
  }

  getSuggestions(query: string): Observable<Heroe[]> {
    if (query.trim().length < 2) {
      return of([]);
    }

    return this.http.get<Heroe[]>(`${this.baseUrl}/heroes`)
      .pipe(
        map(heroes => {
          // Ordenamos los héroes por nombre (superhero)
          heroes.sort((a, b) => a.superhero.localeCompare(b.superhero));

          // Buscamos coincidencias utilizando búsqueda binaria
          const result = Utils.binarySearch(heroes, query);
          return result;
        })
      );
  }

  addHeroe( Heroe: Heroe ): Observable<Heroe> {
    return this.http.post<Heroe>(`${ this.baseUrl }/heroes`, Heroe );
  }

  updateHeroe(Heroe: Heroe): Observable<Heroe> {
    if (!Heroe.id) {
      throw new Error('Heroe id is required');
    }

    return this.http.patch<Heroe>(`${this.baseUrl}/heroes/${Heroe.id}`, Heroe);
  }

  deleteHeroeById(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/heroes/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Error al eliminar el héroe con ID ${id}:`, error);
        return of(false);
      })
    );
  }

  checkHeroeExists(superhero: string): Observable<boolean> {
    const heroName = superhero.toLowerCase();

    return this.http.get<any[]>(`${this.baseUrl}/heroes?superhero=${heroName}`).pipe(
      map(heroes => {
        return heroes.length > 0;
      })
    );
  }
}

