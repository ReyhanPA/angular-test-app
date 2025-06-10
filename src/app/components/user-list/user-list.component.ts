import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormField,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  displayedColumns = [
    'name',
    'email',
    'website',
    'city',
    'companyName',
    'action',
  ];
  dataSource = new MatTableDataSource<User>();
  filterText = '';
  isLoading = true;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private userService: UserService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;

        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          if (this.sort) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor =
              this.sortingAccessor.bind(this);
          }
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.isLoading = false;
      },
    });
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterText.trim().toLowerCase();
  }

  clearFilter(): void {
    this.filterText = '';
    this.applyFilter();
  }

  private sortingAccessor(item: User, property: string): string {
    switch (property) {
      case 'city':
        return item.address?.city || '';
      case 'companyName':
        return item.company?.name || '';
      default:
        return item[property as keyof User] as string;
    }
  }
}
