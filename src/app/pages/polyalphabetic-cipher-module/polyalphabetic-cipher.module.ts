import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolyalphCipher } from './polyalphabetic-cipher-component/polyalph-cipher.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PolyalphCipherService } from './polyalphabetic-cipher.service';
import { PolyalphBoxesComponentComponent } from './polyalphabetic-cipher-component/polyalph-boxes-component/polyalph-boxes-component.component';

const polyalphRoutes: Routes = [
  { path: '', component: PolyalphCipher},
];

@NgModule({
  declarations: [
    PolyalphCipher,
    PolyalphBoxesComponentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(polyalphRoutes),
    SharedModule
  ],
  providers: [PolyalphCipherService]
})
export class PolyalphCipherModule { }
