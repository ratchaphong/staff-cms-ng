import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { LoginHistoryStore } from '../../store/login-log';
import { LoadingOverlay } from '../../shared/loading-overlay/loading-overlay';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-history',
  standalone: true,
  imports: [CommonModule, DatePipe, Sidebar, LoadingOverlay, RouterModule],
  templateUrl: './login-history.html',
  styleUrl: './login-history.scss',
})
export class LoginHistory implements OnInit {
  constructor(public store: LoginHistoryStore) {}

  ngOnInit(): void {
    this.store.fetchMyLogs();
    this.store.fetchAllLogs();
  }

  get loading() {
    return this.store.loading();
  }
}
