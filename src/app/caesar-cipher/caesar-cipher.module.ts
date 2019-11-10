import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaesarCipher } from './caesar-cipher-enc-dec/caesarCipher.component';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule} from '@angular/forms';

const appRoutes: Routes = [
  { path: '', component: CaesarCipher},
 
];

@NgModule({
  declarations: [
    CaesarCipher
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    MatInputModule,
    FormsModule
  ]
})
export class CaesarCipherModule { }
