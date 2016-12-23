import { Observable } from 'rxjs/Observable';
import { pushNetworkStack, network$, networkType, resource$, resourceType, getResourcePerformance }from '../rxstore/network.store';

export let btnNet$ = ( ) => Observable.fromEvent( document.querySelector('#btn-network'), 'click');

declare let window: any

export class NetWork {

    networkData: Array<networkType> = [ ];
    resourceData: Array<resourceType> = [ ];
    constructor( ) {
        network$.subscribe(( data: Array<networkType> ) => {
            this.networkData = data;
            try{ setTimeout(() => this.mapXhrDataToLi( data ), 300) } catch( e ) {  }
        })
        resource$.subscribe(( data: Array<resourceType>) => {
            try{ setTimeout(() => this.mapResDataToLi( data ), 300) } catch( e ) {  }
        })
        this.resourceData = getResourcePerformance( );
    }

    private mapXhrDataToLi( data: Array<networkType> ) {
        let liEles = data.map(( i ) => {
            let liEle = document.createElement('LI');
            liEle.className = (i.status === 200 || i.status === 304) ? '' : 'error';
            let html =  `${i.status} ${i.method} ${i.timing}ms <span>${i.url}</span>`;
            liEle.innerHTML = html;
            return liEle
        })
        try{
            document.querySelector('#network-list').innerHTML = '';
            liEles.forEach(( i ) => document.querySelector('#network-list').appendChild( i ));
            setTimeout(( ) => {
                liEles.forEach(( i, index ) => {
                    Observable.fromEvent( i, 'click')
                        .subscribe(( ) => this.refreshAreaDom(this.createItemDom( index )))
                })
            }, 100)
        } catch ( e ) { }
    }

    private mapResDataToLi( data: Array<resourceType> ) {
        let liString = data.map(( i ) => {
            return `<li>${i.name} ${i.timing}ms <span> ${i.url}</span></li>`
        }).join('');
        try {
            document.querySelector('#resource-list').innerHTML = liString;
        } catch ( e ) { }
    }
    
    showDom( ): string {
        setTimeout(( ) => {
            this.mapXhrDataToLi( this.networkData )
            this.mapResDataToLi( this.resourceData );
        }, 100);
        return `<div class="network">
                    <h3 class="title">Resource Timing</h3>
                    <ul id="resource-list" class="network-list"></ul>
                    <h3 class="title">XMLHttpRequest</h3>
                    <ul id="network-list" class="network-list"></ul>
        </div>`;
    }

    private createItemDom( index: number ) {
        let target = this.networkData[ index ];
        let showParams = ( req ) => req === '' ? '' : `<li>Params: ${req}</li> `;
        let showCookies = ( coo ) => coo === '' ? '' : `<li>Cookies: ${coo}</li> `;
        let bar: string = `<div class="title-bar">< ${target.method} | ${target.url}</div>`;
        let req: string = `<div><h3 class="title">Request</h3><ul>
            <li>URL: ${target.url}</li>
            <li>Method: ${target.method}</li>
            ${showParams(target.params.req)}
            ${showCookies(target.params.cookies)} 
        </ul></div>`;
        let res: string = `<div><h3 class="title">Response</h3><ul>
            <li>Status Code: ${target.status}</li>
            <li class="body">Body: </li>
            <li>${target.body}</li>
        </ul></div>`
        return `<div class="network-detail">${bar}${req}${res}</div>`
    }

     /**
     * 刷新Area DOM
     */
    private refreshAreaDom( dom: string ) {
        document.querySelector('#show-area').innerHTML = dom;
    }

}


let send = window.XMLHttpRequest.prototype.send;
let open = window.XMLHttpRequest.prototype.open;

function openReplacement( ) {
     let method = arguments[0];
     let url = arguments[1];
     let timeStart: number = 0;
     let timeEnd: number = 0;

     Observable.fromEvent( this, 'loadstart')
        .subscribe(( ) => timeStart = (new Date( )).getTime( ))

     Observable.fromEvent( this, 'loadend')
        .subscribe(( e ) => {
            timeEnd = (new Date( )).getTime( );
            let delTime = timeEnd  - timeStart;
            let body = this.responseText || '';
            if ( String( this.status).indexOf('4' ) === 0 || String( this.status).indexOf('0' ) === 0 || String( this.status).indexOf('5' ) === 0) {
                console.error(`${method} ${this.status} ${this.statusText} ${url}`)
            }
            pushNetworkStack( url, method, delTime, this.status, body, this.sendReqData );
        })
   
     return open.apply(this, arguments);
 }

function sendReplacement( ) {
    this.sendReqData = arguments[0];
    return send.apply(this, arguments);
}

window.XMLHttpRequest.prototype.send = sendReplacement;
window.XMLHttpRequest.prototype.open = openReplacement;

