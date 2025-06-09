import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from '../../models/menu-item';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  title = 'Angular Test App';
  menu: MenuItem[] = [
    { name: 'Users', path: '/' }
  ];
}
