import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {}
