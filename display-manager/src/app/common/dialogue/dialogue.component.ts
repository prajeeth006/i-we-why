import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:
  {title?: string, message:string}) { }

  ngOnInit(): void {
  }

}
