import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-caesarcipher',
    templateUrl: './caesarCipher.component.html'
})
export class CaesarCipher implements OnInit {
    private alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
     'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    private key = 2;
    private message = '';
    private encryptedText = '';
    private decryptedText = '';
    private aAscii: number = 'a'.charCodeAt(0);


    ngOnInit(): void {
        //  ---------------   Ceaser Cipher  -------------
        console.log(" ------------ Ceaser Cipher ------------");
        this.encrypt();
        this.decrypt();
        const str = "sdsdsdabfdfafa";
        const splitted = str.split('a');
        let numOccurs = splitted.length;
        numOccurs -= 1;

        console.log(str);

        console.log(splitted);
        console.log(numOccurs);

    }

    public encrypt() {
        this.encryptedText = '';
        for (const letter of this.message) {
            const letterAscii = letter.charCodeAt(0);
            const encryptedLetter: number = (((letterAscii - this.aAscii) + this.key + 26) % 26) + this.aAscii;
            this.encryptedText += String.fromCharCode(encryptedLetter);
        }

        return this.encryptedText;
    }

    public decrypt() {
        this.decryptedText = '';
        for (const letter of this.encryptedText) {
            const letterAscii = letter.charCodeAt(0);
            const decryptedLetter: number = ((letterAscii - this.aAscii - this.key + 26) % 26) + this.aAscii;
            this.decryptedText += String.fromCharCode(decryptedLetter);
        }

        return this.decryptedText;
    }
}