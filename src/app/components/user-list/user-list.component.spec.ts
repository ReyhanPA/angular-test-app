import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/user';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const dummyUsers: User[] = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: { lat: '-37.3159', lng: '81.1496' },
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: '',
        bs: '',
      },
    },
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: LiveAnnouncer, useValue: { announce: jasmine.createSpy() } },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on on init', () => {
    mockUserService.getUsers.and.returnValue(of(dummyUsers));
    fixture.detectChanges();

    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Leanne Graham');
    expect(component.isLoading).toBeFalse();
  });

  it('should apply filter', () => {
    component.dataSource = new MatTableDataSource(dummyUsers);
    component.filterText = 'Leanne';
    component.applyFilter();
    expect(component.dataSource.filter).toBe('leanne');
  });

  it('should clear filter', () => {
    component.filterText = 'something';
    spyOn(component, 'applyFilter');
    component.clearFilter();
    expect(component.filterText).toBe('');
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it('should handle error during fetch', () => {
    spyOn(console, 'error');

    mockUserService.getUsers.and.returnValue(
      throwError(() => new Error('Fetch error'))
    );

    fixture.detectChanges();

    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.dataSource.data.length).toBe(0);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching users',
      jasmine.any(Error)
    );
  });
});
