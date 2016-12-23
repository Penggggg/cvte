import { Observable } from 'rxjs/Observable';
import { localStorage$, cookieStorage$, getAllLSData, ckType, lsType, deleteLSData, deleteCKData, deleteAllLSData, getAllCKData, deleteAllCKData } from '../rxstore/storage.store'


export let btnSto$ = ( ) => Observable.fromEvent( document.querySelector('#btn-storage'), 'click');

export class Storage {

    lsData: Array< lsType > = [];
    ckData: Array< ckType > = [];
    constructor( ) {    
        localStorage$.subscribe(( data: Array< lsType >) => {
            setTimeout(( ) => { try{  this.mapLSDataToLi( data ) } catch ( e) { }}, 300)
        });
        cookieStorage$.subscribe(( data: Array< ckType >) => {
            setTimeout(( ) => { try{  this.mapCKDataToLi( data ) } catch ( e) { }}, 300)
        });
        this.lsData = getAllLSData( );
        this.ckData = getAllCKData( );
    }

    private addEvent( i: HTMLSpanElement, key: string, type: 'ls' | 'ck' ){
        Observable.fromEvent( i, 'click')
            .subscribe((  ) => {
                   let res = confirm('Are you sure?')
                   if ( res && type === 'ls' ) { 
                       deleteLSData(key) 
                   } else if ( res && type === 'ck' ) {
                       deleteCKData(key)
                   }
            })
    }

    private addDeleteAllEvent( i: HTMLSpanElement, type: 'ls' | 'ck' ) {
        Observable.fromEvent( i, 'click')
            .subscribe(( ) => {
                let res = confirm('Are you sure?');
                if ( res && type === 'ls' ) { 
                    deleteAllLSData( ); 
                } else if ( res && type === 'ck' ) {
                    deleteAllCKData( );
                }
            })
    }

    private makeTitleDom( type: 'ls' | 'ck' ) {
        let cEle = document.createElement('DIV')
        let hEle = document.createElement('H3');
        let spanEle = document.createElement('SPAN');
        hEle.className = 'title';
        hEle.innerHTML = type ===  'ls' ? 'LocalStorage' : 'Cookies';
        spanEle.innerHTML = 'X';
        cEle.appendChild( hEle );
        cEle.appendChild( spanEle );
        if ( type === 'ls' ) {
            setTimeout(( ) => this.addDeleteAllEvent(spanEle, 'ls'), 200);
        } else {
            setTimeout(( ) => this.addDeleteAllEvent(spanEle, 'ck'), 200);
        }
        setTimeout(( ) => {
            try { 
                if ( type === 'ls') {
                    document.querySelector('#ls-title').appendChild( cEle );
                } else {
                    document.querySelector('#ck-title').appendChild( cEle );
                }
            } catch ( e) { }
        }, 100)
    }

    private mapLSDataToLi( data: Array< lsType >) {
        let liEles = data.map(( i, index ) => {
            let liEle = document.createElement('LI');
            let bEle = document.createElement('B');
            bEle.innerHTML = 'X';
            liEle.innerHTML = `<span class="key">${i.key}</span><span class="value">${i.value}</span>`;
            liEle.className = 'ls-item';
            liEle.appendChild( bEle );
            setTimeout(( ) => { this.addEvent( bEle, i.key, 'ls' );}, 200)
            return liEle;
        })
        setTimeout(( ) => {
            try {
                document.querySelector('#ls-list').innerHTML = '';
                liEles.forEach(( i ) => {
                    document.querySelector('#ls-list').appendChild( i );
                })
            } catch( e) { }
        }, 100)
    }

    private mapCKDataToLi( data: Array< ckType >) {
        let liEles = data.map(( i, index ) => {
            let liEle = document.createElement('LI');
            let bEle = document.createElement('B');
            bEle.innerHTML = 'X';
            liEle.innerHTML = `<span class="key">${i.key}</span><span class="value">${i.value}<span>`;
            liEle.className = 'ls-item';
            liEle.appendChild( bEle );
            setTimeout(( ) => { this.addEvent( bEle, i.key, 'ck' );}, 200)
            return liEle;
        })
        setTimeout(( ) => {
            try {
                document.querySelector('#ck-list').innerHTML = '';
                liEles.forEach(( i ) => {
                    document.querySelector('#ck-list').appendChild( i );
                })
            } catch( e) { }
        }, 100)
    }
    
    showDom( ): string {
        setTimeout(( ) => {
            this.makeTitleDom('ls');
            this.makeTitleDom('ck');
            this.mapLSDataToLi(getAllLSData( ));
            this.mapCKDataToLi(getAllCKData( ));
        }, 100);
        return `<div class="storage">
            <div id="ck-title" class="list-title">    
            </div>
            <ul class="ck-list storage-list" id="ck-list"></ul>
            <div id="ls-title" class="list-title">    
            </div>
            <ul class="ls-list storage-list" id="ls-list"></ul>
        </div>`
    }

}
