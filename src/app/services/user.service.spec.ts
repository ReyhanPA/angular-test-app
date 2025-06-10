import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      address: {
        street: '',
        suite: '',
        city: 'City',
        zipcode: '',
        geo: { lat: '', lng: '' },
      },
      phone: '123456789',
      website: 'www.johndoe.com',
      company: {
        name: 'Doe Inc.',
        catchPhrase: 'Catch Phrase',
        bs: 'Business',
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiURL}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch user by ID', () => {
    const userId = 1;

    service.getUserByID(userId).subscribe((user) => {
      expect(user).toEqual(mockUsers[0]);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers[0]);
  });
});
