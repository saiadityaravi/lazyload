import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-phonepal',
  templateUrl: './phonepal.component.html',
  styleUrls: ['./phonepal.component.scss']
})
export class PhonepalComponent implements OnInit {

  constructor(private messageService:SharedService) { }

  ngOnInit() {
  }

}
