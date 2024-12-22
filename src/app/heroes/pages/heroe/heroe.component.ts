import { Component, OnInit } from '@angular/core';
import { Heroe } from '../../../interfaces/heroe.interface';
import { HeroesService } from '../../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { ImageHeroePipe } from '../../../pipes/image-heroe.pipe';

@Component({
  selector: 'app-heroe',
  standalone: true,
  imports: [MaterialModule, CommonModule, ImageHeroePipe],
  templateUrl: './heroe.component.html',
  styleUrl: './heroe.component.css'
})
export class HeroeComponent implements OnInit {

  public heroe?: Heroe;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroeById( id )),
      )
      .subscribe( heroe => {

        if ( !heroe ) return this.router.navigate([ '/heroes/list' ]);

        this.heroe = heroe;
        console.log( this.heroe);
        return;
      })
  }

  goBack():void {
    this.router.navigateByUrl('heroes/list')
  }
}
