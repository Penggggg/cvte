import { Observable } from 'rxjs/Observable';

/**
 * import Operator
 */

import 'rxjs/add/observable/fromEvent';

export let panel$ = ( ) => Observable.fromEvent( document.querySelector('#fc_btn'), 'click');