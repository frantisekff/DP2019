import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonoalphCipher } from './monoalphabetic-cipher-component/monoalphabetic-cipher-component.component';
import { Routes, Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const monoalphRoutes: Routes = [
  { path: '', component: MonoalphCipher},
];


@NgModule({
  declarations: [MonoalphCipher],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(monoalphRoutes)
  ]
})
export class MonoalphCipherModule { }
