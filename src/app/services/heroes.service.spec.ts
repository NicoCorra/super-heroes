import { TestBed, waitForAsync } from '@angular/core/testing';

import { HeroesService } from './heroes.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom, of } from 'rxjs';
import { environments } from '../../environments/environments';
import { Utils } from '../shared/utils/utils';
import { Heroe, Publisher } from '../interfaces/heroe.interface';

const heroesListMock: Heroe[] = [
  {
    id: "dc-batman",
    superhero: "Batman",
    publisher: Publisher.DCComics,
    alter_ego: "Bruce Wayne",
    first_appearance: "Detective Comics #27",
    characters: "Bruce Wayne"
  },
  {
    id: "dc-superman",
    superhero: "Superman",
    publisher: Publisher.DCComics,
    alter_ego: "Kal-El",
    first_appearance: "Action Comics #1",
    characters: "Kal-El"
  },
  {
    id: "dc-flash",
    superhero: "Flash",
    publisher: Publisher.DCComics,
    alter_ego: "Jay Garrick",
    first_appearance: "Flash Comics #1",
    characters: "Jay Garrick, Barry Allen, Wally West, Bart Allen"
  }
];

const newHero: Heroe = {
  id: 'dc-wonderwoman',
  superhero: 'Wonder Woman',
  publisher: Publisher.DCComics,
  alter_ego: 'Diana Prince',
  first_appearance: 'All Star Comics #8',
  characters: 'Diana Prince, Wonder Woman',
};

const addedHeroResponse: Heroe = { ...newHero, id: 'dc-wonderwoman' };

const baseUrl: string = environments.baseUrl;

const updatedHero: Heroe = {
  id: 'dc-batman',
  superhero: 'Batman',
  publisher: Publisher.DCComics,
  alter_ego: 'Bruce Wayne',
  first_appearance: 'Detective Comics #27',
  characters: 'Bruce Wayne',
};

const updatedHeroResponse: Heroe = { ...updatedHero };

const heroId = 'dc-batman';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HeroesService);
    httpTesting = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTesting.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sould be the heroes list', async () => {
    const mockResponse = heroesListMock

    const heroes$ = service.getHeroes();
    const heroesPromise = firstValueFrom(heroes$);

    const req = httpTesting.expectOne(`${ baseUrl }/heroes`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
    expect(await heroesPromise).toEqual(mockResponse)
  });

  it('should return the hero by id', async () => {
    const heroId = 'dc-batman';
    const expectedHero = heroesListMock.find(hero => hero.id === heroId) || {};

    const hero$ = service.getHeroeById(heroId);
    const heroPromise = firstValueFrom(hero$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedHero);

    const hero = await heroPromise;
    expect(hero).toEqual(expectedHero);
  });

  it('should return undefined if the hero is not found', async () => {
    const invalidHeroId = 'dc-unknown';

    const hero$ = service.getHeroeById(invalidHeroId);
    const heroPromise = firstValueFrom(hero$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${invalidHeroId}`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    const hero = await heroPromise;
    expect(hero).toBeUndefined();
  });

  it('should return the sorted and filtered heroes if the query has 2 or more characters', async () => {
    const query = 'Fl';
    const sortedHeroes = heroesListMock.sort((a, b) => a.superhero.localeCompare(b.superhero));
    const filteredHeroes = Utils.binarySearch(sortedHeroes, query);

    service.getSuggestions(query).subscribe((suggestions) => {
      expect(suggestions).toEqual(filteredHeroes);
    });

    const req = await httpTesting.expectOne(`${service['baseUrl']}/heroes`);
    expect(req.request.method).toBe('GET');
    req.flush(sortedHeroes);
  });

  it('should return an empty array when query length is less than 2', async () => {
    const query = ' '

    service.getSuggestions(query).subscribe(response => {
      expect(response).toEqual([]);
    });

    await httpTesting.verify();
  });

  it('should return heroes when query length is more than 2', async () => {
    const query = 'Bat';
    const heroesMock: Heroe[] = [
      { id: 'dc-batman',
        superhero: 'Batman',
        publisher: Publisher.DCComics,
        alter_ego: 'Bruce Wayne',
        first_appearance: 'Detective Comics #27',
        characters: 'Bruce Wayne' }
    ];

    service.getSuggestions(query).subscribe(response => {
      expect(response.length).toBeGreaterThan(0);
      expect(response).toEqual(heroesMock);
    });

    const req = await httpTesting.expectOne(`${baseUrl}/heroes`);
    expect(req.request.method).toBe('GET');
    req.flush(heroesListMock);

    httpTesting.verify();
  });

  it('should add a hero successfully', async () => {
    service.addHeroe(newHero).subscribe(response => {
      expect(response).toEqual(addedHeroResponse);
    });

    const req = httpTesting.expectOne(`${baseUrl}/heroes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);

    req.flush(addedHeroResponse);
  });

  it('should throw an error if hero id is missing', () => {
    const heroWithoutId: Heroe = {
      id: '',
      superhero: 'Batman',
      alter_ego: 'Rich',
      publisher: Publisher.DCComics,
      first_appearance: '',
      characters: ''
    };

    expect(() => service.updateHeroe(heroWithoutId)).toThrow(new Error('Heroe id is required'));
  });


  it('should update a hero successfully', async () => {
    const heroWithId: Heroe = {
      id: 'dc-batman',
      superhero: 'Batman',
      alter_ego: 'Rich',
      publisher: Publisher.DCComics,
      first_appearance: '',
      characters: '' };
    const updatedHeroResponse: Heroe = {
      id: 'dc-batman',
      superhero: 'Batman',
      alter_ego: 'Rich',
      publisher: Publisher.DCComics,
      first_appearance: '',
      characters: '' };

    const heroes$ = service.updateHeroe(heroWithId);
    const heroPromise = firstValueFrom(heroes$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/dc-batman`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(heroWithId);

    req.flush(updatedHeroResponse);

    expect(await heroPromise).toEqual(updatedHeroResponse);
  });


  it('should handle error if update hero fails', async () => {
    const heroWithId: Heroe = { id: 'dc-batman',
      superhero: 'Batman',
      alter_ego: 'Rich',
      publisher: Publisher.DCComics,
      first_appearance: '',
      characters: '' };

    const errorResponse = { status: 500, statusText: 'Server Error' };

    const heroes$ = service.updateHeroe(heroWithId);
    const heroPromise = firstValueFrom(heroes$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/dc-batman`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(heroWithId);

    req.flush('Error', errorResponse);

    try {
      await heroPromise;
      fail('Expected error, but got a response');
    } catch (error) {
      expect(errorResponse.status).toBe(500);
      expect(errorResponse.statusText).toBe('Server Error');
    }
  });

  it('should delete a hero successfully', async () => {
    const heroId = 'dc-batman';

    const deleteHero$ = service.deleteHeroeById(heroId);
    const deleteHeroPromise = firstValueFrom(deleteHero$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);

    expect(await deleteHeroPromise).toBe(true);
  });

  it('should handle error and return false if delete fails', async () => {
    const heroId = 'dc-batman';

    const deleteHero$ = service.deleteHeroeById(heroId);
    const deleteHeroPromise = firstValueFrom(deleteHero$);

    const req = httpTesting.expectOne(`${baseUrl}/heroes/${heroId}`);
    expect(req.request.method).toBe('DELETE');

    const errorResponse = { status: 500, statusText: 'Server Error' };
    req.flush('Error', errorResponse);

    expect(await deleteHeroPromise).toBe(false);
  });

  it('should return true if hero exists', () => {
    const superhero = 'Batman';
    const mockHeroes = [
      {
        id: 'dc-batman',
        superhero: 'Batman',
        publisher: 'DC Comics',
        alter_ego: 'Bruce Wayne',
        first_appearance: 'Detective Comics #27',
        characters: 'Bruce Wayne'
      }
    ];

    service.checkHeroeExists(superhero).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpTesting.expectOne(`${baseUrl}/heroes?superhero=batman`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('should return false if hero does not exist', () => {
    const superhero = 'NonExistentHero';
    const mockHeroes: any[] = [];

    service.checkHeroeExists(superhero).subscribe(result => {
      expect(result).toBe(false);
    });

    const req = httpTesting.expectOne(`${baseUrl}/heroes?superhero=nonexistenthero`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('should handle HTTP errors gracefully', () => {
    const superhero = 'Batman';

    service.checkHeroeExists(superhero).subscribe({
      next: (result) => {
        expect(result).toBe(false);
      },
      error: (error) => {
        fail('Expected no error, but got: ' + error);
      }
    });

    const req = httpTesting.expectOne(`${baseUrl}/heroes?superhero=batman`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('NetworkError'));
  });
});
