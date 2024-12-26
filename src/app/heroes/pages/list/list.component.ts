import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { HeroesService } from '../../../services/heroes.service';
import { Heroe } from '../../../interfaces/heroe.interface';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../components/card/card.component';
import { PaginatorComponent } from '../../../components/paginator/paginator.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MaterialModule, CommonModule, CardComponent, PaginatorComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ListComponent implements OnInit {

  protected heroes: Heroe[] = [];
  protected heroesToShow: Heroe[] = [];
  protected length: number = 0;
  protected pageSize: number = 6;
  protected pageIndex: number = 0;

  constructor(private heroesService: HeroesService) { }

  ngOnInit(): void {
    this.heroesService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.length = heroes.length;

      this.updateHeroesToShow();
    });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updateHeroesToShow();
  }

  private updateHeroesToShow(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.heroesToShow = this.heroes.slice(startIndex, endIndex);
  }
}
