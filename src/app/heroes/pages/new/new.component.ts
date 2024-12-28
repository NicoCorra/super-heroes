import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Heroe, Publisher } from '../../../interfaces/heroe.interface';
import { HeroesService } from '../../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { ImageHeroePipe } from '../../../pipes/image-heroe.pipe';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { UppercaseDirective } from '../../../directivas/uppercase.directive';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [MaterialModule, CommonModule, ImageHeroePipe, ReactiveFormsModule, UppercaseDirective],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent implements OnInit{
  heroeForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img:new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];


  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  get currentHeroe(): Heroe {
    const hero = this.heroeForm.value as Heroe;
    return hero;
  }

  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroeById( id ) ),
      ).subscribe( hero => {

        if ( !hero ) {
          return this.router.navigateByUrl('/');
        }

        this.heroeForm.reset( hero );
        return;
      });

  }

  onSubmit(): void {
    if (this.heroeForm.invalid) return;

    this.currentHeroe.superhero = this.currentHeroe.superhero.toUpperCase();

    if (this.currentHeroe.alt_img) {
      this.currentHeroe.alt_img = this.currentHeroe.alt_img.toLowerCase();
    }

    if ( this.router.url.includes('edit') ){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: `¿Quieres editar el heroe ${this.currentHeroe.superhero}?`
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.heroesService.updateHeroe( this.currentHeroe )
          .subscribe( hero => {
            this.showSnackbar(`${ hero.superhero } updated!`);
          });
          this.router.navigate(['/heroes']);
        } else {
          this.showSnackbar('Operación cancelada.');
          this.router.navigate(['/heroes']);
        }
      });

    } else {
      this.heroesService.addHeroe(this.currentHeroe)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} creado!`);
          this.router.navigate(['/heroes']);
        });
    };
  }

  onDeleteHero(): void {
    if (!this.currentHeroe.id) {
      throw Error('Hero id is required');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que quieres eliminar al héroe ${this.currentHeroe.superhero}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroesService.deleteHeroeById(this.currentHeroe.id)
          .subscribe(wasDeleted => {
            if (wasDeleted) {
              this.showSnackbar(`${this.currentHeroe.superhero} ha sido eliminado.`);
              this.router.navigate(['/heroes']);
            } else {
              this.showSnackbar('Hubo un problema al eliminar el héroe.');
            }
          });
      } else {
        this.showSnackbar('Operación de eliminación cancelada.');
      }
    });
  }


  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}
