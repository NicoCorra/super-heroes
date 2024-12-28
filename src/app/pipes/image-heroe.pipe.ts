import { Pipe, PipeTransform } from '@angular/core';
import { Heroe } from '../interfaces/heroe.interface';

@Pipe({
  name: 'imageHeroe',
  standalone: true
})
export class ImageHeroePipe implements PipeTransform {

  transform( heroe: Heroe ): string {

    if (!heroe.alt_img || heroe.alt_img.trim() === '') {
      return './assets/no-image.png';
    }

    return `./assets/heroes/${ heroe.id }.jpg`;
  }
}
