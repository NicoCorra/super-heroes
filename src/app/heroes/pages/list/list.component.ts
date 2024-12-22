import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { HeroesService } from '../../../services/heroes.service';
import { Heroe } from '../../../interfaces/heroe.interface';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/card/card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MaterialModule, CommonModule, CardComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ListComponent implements OnInit {

  protected heroes: Heroe[] = [];

  constructor(private heroesService: HeroesService) { }

  ngOnInit(): void {
    this.heroesService.getHeroes()
      .subscribe( heroes => this.heroes = heroes );
  }
}
