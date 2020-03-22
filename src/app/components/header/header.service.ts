import { Subject } from 'rxjs';

export class HeaderService {
    cipherName = new Subject<string>();
    cipherType = new Subject<string>();
}