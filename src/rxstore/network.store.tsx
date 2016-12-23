import { Observable } from 'rxjs/Observable';

export type networkType = {
    url: string
    method: string,
    timing: number,
    status: number,
    body: string,
    params?: {
        req?: any
        cookies?: any
    }
}

export type resourceType = {
    name?: string,
    timing?: number,
    url?: string
}

let networkData: Array<networkType> = [ ];
let resourceData: Array<resourceType> = [ ];
let emitter: any;
let emitterRes: any;

export let network$ = Observable.create(( observer ) => {
    emitter = observer;
    observer.next( networkData );
})

export let resource$ = Observable.create(( observer ) => {
    emitterRes = observer;
    observer.next( resourceData );
})

export let pushNetworkStack = ( url: string, method: string, timing: number, status: number, body: string, reqData: any = '', reqCookies:any = '' ) => {
    let params: any = { };
    params.req = reqData;
    params.cookies = reqCookies;
    networkData.push({ url, method, timing, status, body, params });
    emitter.next( networkData );
}

export let getResourcePerformance = ( ) => {
    let result: Array< resourceType > = [];
    let resourceArr: Array< any > = window.performance.getEntries( );
    resourceArr.forEach(( i ) => {
        let _arr = i.name.split('/');
        let judge = ( /\./g.test(_arr[ _arr.length -1 ])) ;
        if ( judge ) {
            let o: resourceType = { };
            o.url = i.name; 
            o.timing = parseInt( i.responseEnd ) - parseInt( i.requestStart );
            let arr = i.name.split('/');
            o.name = arr[ arr.length -1 ];
            result.push( o );
        }

    })
    emitterRes.next( result );
    return result
}

setInterval(( ) => {
    getResourcePerformance( );
}, 4000)

