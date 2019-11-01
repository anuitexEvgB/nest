import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { UpserNotePage } from 'src/app/pages/upser-note/upser-note.page';

const routes: Routes = [
  {
    path: '',
    component: UpserNotePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [UpserNotePage],
  declarations: [UpserNotePage]
})
export class UpserNotePageModule {}
