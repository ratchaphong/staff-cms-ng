import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User {}
