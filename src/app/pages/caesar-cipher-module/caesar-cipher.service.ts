import { A_ASCII, ALPHABET } from 'src/app/constants/language.constants';

export class CaesarCipherService {

  encrypt(formatedMessage: string, key: number): string {
    let encryptedText = '';
    for (const letter of formatedMessage) {
      const letterAscii = letter.charCodeAt(0);
      const encryptedLetter: number =
        ((letterAscii -
          A_ASCII +
         key +
          26) %
          26) +
        A_ASCII;

      encryptedText += String.fromCharCode(encryptedLetter);
    }
    return encryptedText;
  }

  decrypt(inputKey: number, encryptedText: string): string {
    let decryptedText = '';

    for (const letter of encryptedText) {
      const letterAscii = letter.charCodeAt(0);
      const decryptedLetter: number =
        ((letterAscii - A_ASCII - inputKey + 26) % 26) + A_ASCII;
      decryptedText += String.fromCharCode(decryptedLetter);
    }
    return decryptedText;
  }

  public decryptForEveryKey(encryptedText: string): Array<string> {
    const decryptedTexts = [];
    for (let key = 1; key <= ALPHABET.length; key++) {
      decryptedTexts.push(
        this.decrypt(key, encryptedText)
      );
    }
    return decryptedTexts;
  }

}
