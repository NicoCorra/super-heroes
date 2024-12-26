import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../environments/environments';
import { Heroe } from '../interfaces/heroe.interface';


@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }


  getHeroes():Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroeById( id: string ): Observable<Heroe|undefined> {
    return this.http.get<Heroe>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${ this.baseUrl }/Heroees?q=${ query }&_limit=6`);
  }


  addHeroe( Heroe: Heroe ): Observable<Heroe> {
    return this.http.post<Heroe>(`${ this.baseUrl }/heroes`, Heroe );
  }

  updateHeroe( Heroe: Heroe ): Observable<Heroe> {
    if ( !Heroe.id ) throw Error('Heroe id is required');

    return this.http.patch<Heroe>(`${ this.baseUrl }/heroes/${ Heroe.id }`, Heroe );
  }

  deleteHeroeById( id: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }


}
