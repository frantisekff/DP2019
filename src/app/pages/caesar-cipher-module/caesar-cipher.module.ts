import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaesarCipher } from './caesar-cipher-component/caesar-cipher.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CaesarCipherService } from './caesar-cipher.service';

const caesarRoutes: Routes = [
  { path: '', component: CaesarCipher },
];

@NgModule({
  declarations: [
    CaesarCipher
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(caesarRoutes),
    SharedModule
  ],
  providers: [CaesarCipherService]

})
export class CaesarCipherModule { }
