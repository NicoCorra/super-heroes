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

  onSubmit():void {

    if ( this.heroeForm.invalid ) return;

    if ( this.currentHeroe.id ) {
      this.heroesService.updateHeroe( this.currentHeroe )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.superhero } updated!`);
        });

      return;
    }

    this.heroesService.addHeroe( this.currentHeroe )
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id ]);
        this.showSnackbar(`${ hero.superhero } created!`);
      });
  }

  onDeleteHero() {
    if ( !this.currentHeroe.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.heroeForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.heroesService.deleteHeroeById( this.currentHeroe.id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
      });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) return;

      this.heroesService.deleteHeroeById( this.currentHeroe.id )
      .subscribe( wasDeleted => {
        if ( wasDeleted )
          this.router.navigate(['/heroes']);
      })
    });
  }


  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}
