import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TabService } from '../libs/shared/ui/tabs/tab.service';
import { TabItem } from '../libs/shared/ui/tabs/tab-model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

 title = 'Repy.UI';
  ngOnInit(): void {
  }

  



}
