import { Observable } from 'rxjs/Observable';

type consoleType = { type: string, data: any }

let consoleData: Array<consoleType> = [];
let emitter;
let currentState: 'all' | 'error' | 'log' | 'info' | 'warn' = 'all';

export let console$ = Observable.create(( observer ) => {
    emitter = observer;
    observer.next( consoleData );
})

let  initEvent = ( ) => {
        Observable.fromEvent( document.querySelector('#csb-clear'), 'click')
            .subscribe(( ) => { clearConsoleStack( );initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-all'), 'click')
            .subscribe(( ) => { filterAll( );initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-error'), 'click')
            .subscribe(( ) => { filterError( );initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-warn'), 'click')
            .subscribe(( ) => { filterWarn( );initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-info'), 'click')
            .subscribe(( ) => { filterInfo( );initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-log'), 'click')
            .subscribe(( ) => { filterLog( );initEvent( )})
    }

export let pushConsoleStack = ( data: consoleType ) => {
    consoleData.push( data );
    if ( currentState === data.type ) {
        switch( data.type ) {
            case 'all': filterAll( );break;
            case 'error': filterError( );break;
            case 'log': filterLog( );break;
            case 'info': filterInfo( );break;
            case 'warn': filterWarn( );break;
            default: filterAll( ); break;
        }
    }
}

export let clearConsoleStack = ( ) => {
    consoleData.length = 0;
    emitter.next( consoleData );
    initEvent( );
}


export let filterAll = ( ) => {
    currentState = 'all';
    emitter.next( consoleData );
    initEvent( );
}

export let filterError = ( ) => {
    currentState = 'error';
    let Err: Array<consoleType> = [];
    consoleData.forEach(( i ) => {
        if ( i.type === 'error') { Err.push(i) }
    })
    emitter.next( Err );
    initEvent( )
}

export let filterLog = ( ) => {
    currentState = 'log';
    let Log: Array<consoleType> = [];
    consoleData.forEach(( i ) => {
        if ( i.type === 'log') {Log.push(i) }
    })
    emitter.next( Log );
    initEvent( )
}

export let filterInfo= ( ) => {
    currentState = 'info';
    let Info: Array<consoleType> = [];
    consoleData.forEach(( i ) => {
        if ( i.type === 'info') {Info.push(i) }
    })
    emitter.next( Info );
    initEvent( )
}

export let filterWarn= ( ) => {
    currentState = 'warn';
    let Warn: Array<consoleType> = [];
    consoleData.forEach(( i ) => {
        if ( i.type === 'warn') {Warn.push(i) }
    })
    emitter.next( Warn );
    initEvent( )
}

let originOnerror = window.onerror || null;

window.onerror = ( msg, file, line ) => {
    console.error(`${msg}. in file: ${decodeURI(file)}. in line:${line}.`);
    if ( originOnerror !== null || originOnerror !== undefined ) {
       try {  originOnerror( msg, file, line ); } catch ( e ) { }
    }
}



