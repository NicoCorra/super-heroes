import { Component, input, OnInit } from '@angular/core';
import { Heroe } from '../../interfaces/heroe.interface';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { ImageHeroePipe } from '../../pipes/image-heroe.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'heroes-heroe-card',
  standalone: true,
  imports: [CommonModule, MaterialModule, CommonModule, ImageHeroePipe, RouterLink],
  templateUrl: './card.component.html',
  styles: [],
})
export class CardComponent implements OnInit {

  public heroe = input.required<Heroe>();

  ngOnInit(): void {
    if ( !this.heroe ) throw Error('Hero property is required');
  }

}
