import { Component } from '@angular/core';
import { HeaderService } from 'src/app/components/header/header.service';

@Component({
    selector: 'app-transpositioncipher',
    templateUrl: 'transposition-cipher.component.html',
})
export class TranspositioncipherComponent {
    constructor(headerService: HeaderService) {
        headerService.showInfoPanel.next(true);
        headerService.cipherName.next('Transposition Cipher');
        headerService.cipherType.next('Transposition');
      }
}