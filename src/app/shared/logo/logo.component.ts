import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  imports: [CommonModule],
})
export class LogoComponent {
  @Input() mainText = 'taff CMS';
  @Input() highlight = 'S';
  @Input() mainColor = '';
}
