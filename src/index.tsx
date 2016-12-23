import './index.less';

import { panel$ } from './rxstore/panel.store';
import { btnCon$, Console } from './console/index';
import { btnNet$, NetWork } from './network/index';
import { btnSto$, Storage } from './storage/index';
import { filterAll } from './rxstore/console.store';

declare let window: any
declare let require: any

class FastConsole {

    myConsole = new Console( );
    myNetWork = new NetWork( );
    myStorage = new Storage( );

    /**faseConsole的状态 表示是否打开 */
    private panelOpen: boolean = false;

    /**
     * 初始化dom
     */
    private initDom( ) {
        let container = document.createElement('DIV');
        let container2 = document.createElement('DIV');
        let btnDom = `
            <div class="fc_btn" id="fc_btn"><img src="${require('../assets/debug.svg')}" /></div>
        `;
        let panelDom =  `
            <div class="fc_panel" id="fc_panel" >
                <div class="nav-bar" id="nav-bar">
                    <a class="active" id="btn-consle">Console</a>
                    <a id="btn-network">NetWork</a>
                    <a id="btn-storage">Storage</a>
                </div>
                <div class="show-area" id="show-area"></div>
            </div>
        `;
        container.innerHTML = btnDom;
        container2.innerHTML = panelDom;
        document.querySelector('body').appendChild( container );
        document.querySelector('body').appendChild( container2 );
        this.refreshAreaDom( this.myConsole.showDom( ))
    }

    /**
     * 初始化事件监听
     */
    private initEvent( ) {
        panel$( ).subscribe(( ) => {
            this.panelOpen = ! this.panelOpen;
            this.refreshPanelDom( this.panelOpen );
            this.refreshNav( 0 );
        })
        btnCon$( ).subscribe(( ) => {
            this.refreshAreaDom( this.myConsole.showDom( ));
            this.refreshNav( 0 );
        })
        btnNet$( ).subscribe(( ) => {
            this.refreshAreaDom( this.myNetWork.showDom( ));
            this.refreshNav( 1 );
        })
        btnSto$( ).subscribe(( ) => {
            this.refreshAreaDom( this.myStorage.showDom( ));
            this.refreshNav( 2 );
        })
    }

    /**
     * 刷新Panel Dom
     */
    private refreshPanelDom( open: boolean ) {
        document.querySelector('#fc_panel').className = open ? "show fc_panel" : "fc_panel";
        document.querySelector('#fc_btn').innerHTML = `<img src="${require('../assets/debug.svg')}" />`;
        filterAll( );
    }
    

    /**
     * 刷新Area DOM
     */
    private refreshAreaDom( dom: string ) {
        document.querySelector('#show-area').innerHTML = dom;
    }

    /**
     * 刷新nav-bar
     */
    private refreshNav( index: number ) {
       let { children } =  document.querySelector('#nav-bar');
       for( let c in children ) {
          try {
              children[ c ].className = ''
          } catch( e ) {  }
       }
       children[ index ].className = 'active'
       
    }

    /**初始化 
     * 1. 初始化console与network
     * 2. 初始化dom
     * 3. append dom
    */
    init( ) {
        window.console = this.myConsole;
        this.initDom( );
        this.initEvent( );
    }

    

}

let fastConsole = new FastConsole( );
fastConsole.init( );



