import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUser = {
    id: 1,
    name: 'Jane Doe',
    username: 'janed',
    email: 'jane@example.com',
    phone: '12345',
    website: 'jane.com',
    address: {
      street: '',
      suite: '',
      city: 'Paris',
      zipcode: '12345',
      geo: { lat: '', lng: '' },
    },
    company: { name: 'Company X', catchPhrase: '', bs: '' },
  };

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserByID']);

    TestBed.configureTestingModule({
      imports: [
        UserDetailsComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user detail on init', () => {
    userService.getUserByID.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(userService.getUserByID).toHaveBeenCalledWith(1);
    expect(component.user?.name).toBe('Jane Doe');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error during fetch', () => {
    spyOn(console, 'error');

    userService.getUserByID.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.ngOnInit();

    expect(userService.getUserByID).toHaveBeenCalledWith(1);
    expect(component.user).toBeNull();
    expect(component.isLoading).toBeFalse();
  });
});
