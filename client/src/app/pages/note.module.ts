import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { UpserNotePage } from 'src/app/pages/upser-note/upser-note.page';
import { HomePage } from 'src/app/pages/home/home.page';

const routes: Routes = [
    { path: 'home', loadChildren: '/src/app/pages/note.module#NotePageModule' },
    { path: 'upsert-note', loadChildren: '/src/app/pages/note.module#NotePageModule' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [UpserNotePage, HomePage],
  declarations: [UpserNotePage, HomePage]
})
export class NotePageModule {}
