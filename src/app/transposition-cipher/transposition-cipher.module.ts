import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranspositioncipherComponent} from './transposition-cipher-enc-dec/transpositionCipher.component';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
const transpRoutes: Routes = [
  { path: '', component: TranspositioncipherComponent}
];

@NgModule({
  declarations: [
    TranspositioncipherComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(transpRoutes),
    MatInputModule,
    FormsModule
  ]
})
export class TranspositionCipherModule { }
