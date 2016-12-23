import { Observable } from 'rxjs/Observable';

export type lsType = {
    key?: string,
    value?: string
}

export type ckType = {
    key?: string,
    value?: string
}

let emitterLS: any;
let emitterCK: any
let lsData: Array< lsType > = [ ];
let ckData: Array< ckType > = [ ]; 

export let localStorage$ = Observable.create(( observer ) => {
    emitterLS = observer;
    observer.next( lsData );
})

export let cookieStorage$ = Observable.create(( observer ) => {
    emitterCK = observer;
    observer.next( ckData );
})

export let getAllCKData = ( ) => {
    let dc = document.cookie
    let cookiesArr = dc === '' ? [] : dc.split(';');
    ckData.length = 0;
    cookiesArr.forEach(( i ) => {
        let o: ckType = { };
        o.key = i.split('=')[ 0 ];
        o.value = i.split('=')[ 1 ];
        ckData.push( o );
    })
    emitterCK.next( ckData );
    return ckData;
}

export let getAllLSData = ( ) => {
    let windowLS: any = window.localStorage;
    lsData.length = 0;
    for( let i in windowLS ) {
        let o: lsType = { };
        let own = windowLS.hasOwnProperty( i );
        if ( own ) {
            o.key = i; o.value = windowLS[ i ];
            lsData.push( o );
        }
    }
    emitterLS.next( lsData );
    return lsData;
}

export let deleteLSData = ( key ) => {
    let index = 0;
    window.localStorage.removeItem( key );
    lsData.forEach(( i, index ) => {
        index = i.key === key ? index : 0;
    })
    lsData.splice( index, 1 );
    emitterLS.next( lsData );
}

export let deleteCKData = ( key ) => {
    let index = 0;
    ckData.forEach(( i, index ) => {
        index = i.key === key ? index : 0;
    })
    ckData.splice( index, 1 );
    emitterCK.next( ckData );

    let time: any = new Date( );
    document.cookie = `${key}=; expires=${time.toGMTString( )}`
}

export let deleteAllLSData = ( ) => {
    window.localStorage.clear( );
    lsData.length = 0;
    emitterLS.next( lsData );
}

export let deleteAllCKData = ( ) => {
    ckData.forEach(( i ) => {
        let time: any = new Date( );
        document.cookie = `${i.key}=; expires=${time.toGMTString( )}`
    })
    ckData.length = 0;
    emitterCK.next( ckData );
}

Observable.fromEvent(window, 'storage')
    .subscribe(( ) => getAllLSData( ))
