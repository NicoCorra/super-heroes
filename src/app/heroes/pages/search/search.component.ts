import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HeroesService } from '../../../services/heroes.service';
import { Heroe } from '../../../interfaces/heroe.interface';
import { MaterialModule } from '../../../material/material.module';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { UppercaseDirective } from '../../../directivas/uppercase.directive';
import { HeroeComponent } from '../heroe/heroe.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, UppercaseDirective, HeroeComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  public searchInput = new FormControl('');
  public heroes: Heroe[] = [];
  public selectedHero?: Heroe;
  public isLoading: boolean = false;

  constructor( private heroesService: HeroesService){
    this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => {
          if (!value || value.trim().length < 2) {
            this.heroes = [];
            return of([]);
          }

          this.isLoading = true;
          return this.heroesService.getSuggestions(value).pipe(
            catchError(error => {
              console.error('Error fetching heroes', error);
              this.isLoading = false;
              return of([]);
            })
          );
        })
      )
      .subscribe(heroes => {
        this.isLoading = false;
        this.heroes = heroes;
        if (!this.searchInput.value) {
          this.selectedHero = undefined;
        }
      });
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const heroe: Heroe = event.option.value;
    this.searchInput.setValue(heroe.superhero);

    this.selectedHero = heroe;
  }
}
