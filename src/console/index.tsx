import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';

import { console$, pushConsoleStack, clearConsoleStack, filterAll, filterError, filterInfo, filterLog, filterWarn } from '../rxstore/console.store';

type consoleType = { type: string, data: any }

export let btnCon$ = ( ) => Observable.fromEvent( document.querySelector('#btn-consle'), 'click');

export class Console {

    originConsole = window.console;
    consoleData: Array<consoleType> = [ ];

    constructor( ) {
        setTimeout(( ) => { this.initEvent( )}, 1200)
        // 必须等待Dom加载完成
        window.onload = ( ) => {
            this.subscribe( );
            this.catchError( );
        }
    }

    private initEvent( ) {
        Observable.fromEvent( document.querySelector('#csb-clear'), 'click')
            .subscribe(( ) => { clearConsoleStack( );this.initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-all'), 'click')
            .subscribe(( e ) => { filterAll( );this.initEvent( );})
        Observable.fromEvent( document.querySelector('#csb-error'), 'click')
            .subscribe(( ) => { filterError( );this.initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-warn'), 'click')
            .subscribe(( ) => { filterWarn( );this.initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-info'), 'click')
            .subscribe(( ) => { filterInfo( );this.initEvent( )})
        Observable.fromEvent( document.querySelector('#csb-log'), 'click')
            .subscribe(( ) => { filterLog( );this.initEvent( )})
    }


    private catchError( ) {
        Observable.fromEvent(window, 'error')
            .subscribe(( $e ) => console.error( $e ))
    }

    private subscribe( ) {
        console$.subscribe(( data: Array<consoleType> ) => {
            this.consoleData = data;
            let arr = this.consoleData.map(( data ) => {
                return this.mapStringToLi( data )
            })
            document.querySelector('#show-area').innerHTML = `<div class="console">${this.consoleSelectBar( ).concat('<ul>').concat(arr.join('')).concat('</ul>')}</div>`;
        })
    }

    private consoleSelectBar( ) {
        return `<div class="console-select-bar" id="console-select-bar">
            <a id="csb-clear"><span>清除</span></a>
            <a id="csb-all"><span>All</span></a>
            <a id="csb-error"><span>Error</span></a>
            <a id="csb-warn"><span>Warn</span></a>
            <a id="csb-info"><span>Info</span></a>
            <a id="csb-log"><span>Log</span></a>
        </div>`
    }
    
    showDom( ): string {
        let arr = this.consoleData.map(( data ) => {
            return this.mapStringToLi( data )
        })
        setTimeout(( ) => {
            this.initEvent( );
        }, 18);
        return `<div class="console">${this.consoleSelectBar( ).concat('<ul>').concat(arr.join('')).concat('</ul>')}</div>`;
    }

    mapStringToLi( data: consoleType ) {
        let parseData = ( data ) => typeof data === 'function' ? data.toString( ) : JSON.stringify( data );
        return data ? `<li class="${data.type} console">> [${data.type}] <span>${parseData(data.data)}</span></li>` : ''
    }

    log( msg: string ): void {
        this.originConsole.log( JSON.stringify( msg ));
        pushConsoleStack({
            type: 'log',
            data: msg
        })
    }

    error( msg: string ): void {
        let _err = JSON.stringify( msg );
        if ( _err !== `{"isTrusted":true}`) {
            this.originConsole.error( JSON.stringify( msg ));
            pushConsoleStack({
                type: 'error',
                data: msg
            })
        }
    }

    info( msg: string ): void {
        this.originConsole.info( JSON.stringify( msg ));
        pushConsoleStack({
            type: 'info',
            data: msg
        })
    }

    warn( msg: string ): void {
        this.originConsole.warn( JSON.stringify( msg ));
        pushConsoleStack({
            type: 'warn',
            data: msg
        })
    }

}



