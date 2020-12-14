var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function s(e){e.forEach(t)}function i(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function o(e,t,n,s){if(e){const i=l(e,t,n,s);return e[0](i)}}function l(e,t,n,s){return e[1]&&s?function(e,t){for(const n in t)e[n]=t[n];return e}(n.ctx.slice(),e[1](s(t))):n.ctx}function c(e,t,n,s,i,r,o){const c=function(e,t,n,s){if(e[2]&&s){const i=e[2](s(n));if(void 0===t.dirty)return i;if("object"==typeof i){const e=[],n=Math.max(t.dirty.length,i.length);for(let s=0;s<n;s+=1)e[s]=t.dirty[s]|i[s];return e}return t.dirty|i}return t.dirty}(t,s,i,r);if(c){const i=l(t,n,s,o);e.p(i,c)}}function u(e){return null==e?"":e}function a(e,t){e.appendChild(t)}function d(e,t,n){e.insertBefore(t,n||null)}function h(e){e.parentNode.removeChild(e)}function f(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function m(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function g(){return p(" ")}function $(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function E(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function b(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function y(e,t){e.value=null==t?"":t}function N(e,t,n){e.classList[n?"add":"remove"](t)}let v;function O(e){v=e}function R(){const e=function(){if(!v)throw new Error("Function called outside component initialization");return v}();return(t,n)=>{const s=e.$$.callbacks[t];if(s){const i=function(e,t){const n=document.createEvent("CustomEvent");return n.initCustomEvent(e,!1,!1,t),n}(t,n);s.slice().forEach((t=>{t.call(e,i)}))}}}function _(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach((e=>e(t)))}const w=[],C=[],D=[],x=[],L=Promise.resolve();let T=!1;function S(e){D.push(e)}let k=!1;const I=new Set;function A(){if(!k){k=!0;do{for(let e=0;e<w.length;e+=1){const t=w[e];O(t),U(t.$$)}for(O(null),w.length=0;C.length;)C.pop()();for(let e=0;e<D.length;e+=1){const t=D[e];I.has(t)||(I.add(t),t())}D.length=0}while(w.length);for(;x.length;)x.pop()();T=!1,k=!1,I.clear()}}function U(e){if(null!==e.fragment){e.update(),s(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(S)}}const M=new Set;let j;function K(){j={r:0,c:[],p:j}}function W(){j.r||s(j.c),j=j.p}function z(e,t){e&&e.i&&(M.delete(e),e.i(t))}function F(e,t,n,s){if(e&&e.o){if(M.has(e))return;M.add(e),j.c.push((()=>{M.delete(e),s&&(n&&e.d(1),s())})),e.o(t)}}function P(e){e&&e.c()}function V(e,n,r){const{fragment:o,on_mount:l,on_destroy:c,after_update:u}=e.$$;o&&o.m(n,r),S((()=>{const n=l.map(t).filter(i);c?c.push(...n):s(n),e.$$.on_mount=[]})),u.forEach(S)}function q(e,t){const n=e.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function H(e,t){-1===e.$$.dirty[0]&&(w.push(e),T||(T=!0,L.then(A)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function J(t,i,r,o,l,c,u=[-1]){const a=v;O(t);const d=i.props||{},f=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:l,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:n(),dirty:u,skip_bound:!1};let m=!1;if(f.ctx=r?r(t,d,((e,n,...s)=>{const i=s.length?s[0]:n;return f.ctx&&l(f.ctx[e],f.ctx[e]=i)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](i),m&&H(t,e)),n})):[],f.update(),m=!0,s(f.before_update),f.fragment=!!o&&o(f.ctx),i.target){if(i.hydrate){const e=function(e){return Array.from(e.childNodes)}(i.target);f.fragment&&f.fragment.l(e),e.forEach(h)}else f.fragment&&f.fragment.c();i.intro&&z(t.$$.fragment),V(t,i.target,i.anchor),A()}O(a)}class B{$destroy(){q(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}class G{static listeners={};static logEvents=!0;static listen(e,t){"function"==typeof t&&(void 0===this.listeners[e]&&(this.listeners[e]=[]),this.listeners[e].push(t))}static trigger(e,t){"object"!=typeof t&&(t={value:t}),this.logEvents&&(console.log("EventHub >> "+String(e)),console.log(t));for(let n of this.listeners[e]||[])try{n(Object.assign({},t))}catch(t){console.log("Error while handling event "+String(e)),console.log(t)}}}const Y=Object.freeze({DICE_INFO:Symbol("dice-info"),ROLL_DICE:Symbol("roll-dice")}),Q=Object.freeze({ROOM_ENTERED:Symbol("room-entered"),ROOM_USER_JOIN:Symbol("room-usr-join"),ROOM_USER_LEAVE:Symbol("room-user-leave")}),X=Object.freeze({NETWORK_CONNECTING:Symbol("network-connecting"),NETWORK_CONNECTED:Symbol("network-connected"),NETWORK_UNAVAILABLE:Symbol("network-unavailable"),NETWORK_FAILED:Symbol("network-failed"),NETWORK_DISCONNECTED:Symbol("network-disconnected")});function Z(e){let t=String(e);return 0===t.indexOf("Symbol(")&&(t=t.substr(7,t.length-8)),t}class ee{pusherLibrary="https://js.pusher.com/7.0/pusher.min.js";client=null;channel=null;settings={authEndpoint:"",appKey:"",appCluster:"eu"};constructor(e){for(let t in this.settings)this.settings[t]=e[t]??this.settings[t];this.injectPusher()}injectPusher(){let e=document.createElement("script");e.src=this.pusherLibrary,document.head.append(e)}initialize(e){window.Pusher&&(this.client=new Pusher(this.settings.appKey,{cluster:this.settings.appCluster,authEndpoint:this.settings.authEndpoint,auth:{params:{name:e}}}),this.client.connection.bind("error",this.handleConnectionError.bind(this)),this.client.connection.bind("state_change",this.handleConnectionStateChange.bind(this)))}connect(e,t){this.disconnect(),this.initialize(t),e=("presence-"+e).toLowerCase().replace(/[^a-z0-9-_]/g,""),this.channel=this.client.subscribe(e),this.channel.bind("pusher:subscription_succeeded",(e=>{G.trigger(Q.ROOM_ENTERED,e)})),this.channel.bind("pusher:subscription_error",(t=>{G.trigger(X.NETWORK_FAILED),this.log("subscription error on "+e,t)})),this.channel.bind("pusher:member_added",(e=>{G.trigger(Q.ROOM_USER_JOIN,e)})),this.channel.bind("pusher:member_removed",(e=>{G.trigger(Q.ROOM_USER_LEAVE,e)}));for(let e in Y){let t="client-"+Z(Y[e]);this.channel.bind(t,(e=>(t,n)=>{t.sender=n.user_id,G.trigger(e,t)})(Y[e])),this.log("subscribed to "+t)}return e}disconnect(){this.channel&&(this.channel.unsubscribe(),this.channel.disconnect(),this.channel=null),this.client&&this.client.disconnect()}send(e,t,n){if(!this.channel||!this.channel.subscribed)return;let s=Z(e);0!==s.indexOf("client-")&&(s="client-"+s),this.channel.trigger(s,t),n&&(t.sender=n,G.trigger(e,t))}handleConnectionStateChange(e){switch(this.log("connection state change",e),e.current){case"connecting":G.trigger(X.NETWORK_CONNECTING);break;case"connected":G.trigger(X.NETWORK_CONNECTED);break;case"disconnected":G.trigger(X.NETWORK_DISCONNECTED),this.channel=null;break;case"failed":G.trigger(X.NETWORK_FAILED),this.channel=null;break;case"unavailable":G.trigger(X.NETWORK_UNAVAILABLE),this.channel=null}}handleConnectionError(e){this.log("error",e),4004===e.error.data.code&&this.log("connection limit reached"),G.trigger(X.NETWORK_FAILED)}log(e,t){console.log("pusher >> "+e),t&&console.log(t)}}class te{room="";self={id:0,info:{},firstUser:!1};users={};userlist=[];dices=[];rolls=[];status=ne.SETUP;network=null;constructor(e){this.setupListeners(),this.network=new ee(e.network||{}),this.status=ne.READY,this.updated()}joinRoom(e,t){this.room=this.network.connect(e,t)}leaveRoom(){this.network.disconnect()}roll(e){if(e=e||0,this.dices[e]===this.self.id){let t=Math.floor(6*Math.random())+1,n=0;for(;n<this.userlist.length&&this.userlist[n].id!==this.self.id;n++);return n++,n>=this.userlist.length&&(n=0),this.network.send(Y.ROLL_DICE,{dice:e,eyes:t,next:this.userlist[n].id},this.self.id),t}return 0}addDice(){return this.dices.push(this.self.id),this.sendDiceInfo(),this.updated(),this.self.id}canRoll(){let e=[];for(let t=0;t<this.dices.length;t++)this.dices[t]===this.self.id&&e.push(t);return e}sendDiceInfo(){this.network.send(Y.DICE_INFO,{dices:this.dices.slice()})}updateUserList(){this.userlist.length=0;for(let e in this.users)this.userlist.push(this.users[e]);this.userlist.sort(((e,t)=>e.id>t.id?1:e.id<t.id?-1:0)),this.updated()}updated(){document.body.dispatchEvent(new Event("dice-pusher-updated"))}setupListeners(){window.addEventListener("beforeunload",(()=>(this.leaveRoom(),null))),G.listen(X.NETWORK_CONNECTED,(()=>{this.status=ne.CONNECTING,this.updated()})),G.listen(X.NETWORK_DISCONNECTED,(()=>{this.status=ne.READY,this.updated()})),G.listen(X.NETWORK_FAILED,(()=>{this.status=ne.ERROR,this.updated()})),G.listen(X.NETWORK_UNAVAILABLE,(()=>{this.status=ne.ERROR,this.updated()})),G.listen(Q.ROOM_ENTERED,(e=>{if(this.status=ne.CONNECTED,e.me&&(this.self=e.me),e.members){this.users={};for(let t in e.members)this.users[t]=e.members[t]||{},this.users[t].id=t}this.updateUserList(),1===this.userlist.length&&(this.self.firstUser=!0,this.dices=[this.self.id]),this.forwardEvent(Q.ROOM_ENTERED,this.users)})),G.listen(Q.ROOM_USER_JOIN,(e=>{this.users[e.id]=e.info,this.users[e.id].id=e.id,this.self.id===this.userlist[0].id&&this.sendDiceInfo(),this.updateUserList(),this.forwardEvent(Q.ROOM_USER_JOIN,this.users)})),G.listen(Q.ROOM_USER_LEAVE,(e=>{delete this.users[e.id],1===this.userlist.length&&(this.firstUser=!0),this.updateUserList(),this.forwardEvent(Q.ROOM_USER_LEAVE,this.users)})),G.listen(Y.DICE_INFO,(e=>{this.dices=e.dices.slice(),this.updated(),this.forwardEvent(Y.DICE_INFO,e)})),G.listen(Y.ROLL_DICE,(e=>{this.rolls.push(e),this.dices[e.dice]=e.next,this.updated(),this.forwardEvent(Y.ROLL_DICE,e)}))}forwardEvent(e,t){document.body&&document.body.dispatchEvent(new Event(Z(e),t))}}const ne=Object.freeze({SETUP:Symbol("setup"),READY:Symbol("ready"),CONNECTING:Symbol("connecting"),CONNECTED:Symbol("connected"),ERROR:Symbol("error")});function se(e){let t,n;const s=e[1].default,i=o(s,e,e[0],null);return{c(){t=m("div"),i&&i.c(),E(t,"class","card svelte-n8gmda")},m(e,s){d(e,t,s),i&&i.m(t,null),n=!0},p(e,[t]){i&&i.p&&1&t&&c(i,s,e,e[0],t,null,null)},i(e){n||(z(i,e),n=!0)},o(e){F(i,e),n=!1},d(e){e&&h(t),i&&i.d(e)}}}function ie(e,t,n){let{$$slots:s={},$$scope:i}=t;return e.$$set=e=>{"$$scope"in e&&n(0,i=e.$$scope)},[i,s]}class re extends B{constructor(e){super(),J(this,e,ie,se,r,{})}}function oe(t){let n;return{c(){n=m("header"),n.innerHTML='<img src="img/cody.png" alt="Cody rolls" class="svelte-txuxrt"/> \n\n    <h1 class="svelte-txuxrt">Let&#39;s roll together!</h1>',E(n,"class","svelte-txuxrt")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&h(n)}}}class le extends B{constructor(e){super(),J(this,e,null,oe,r,{})}}function ce(t){let n;return{c(){n=m("footer"),n.innerHTML='<div class="copyright svelte-7gpmal">Nicole Heinze - 2020</div>',E(n,"class","svelte-7gpmal")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&h(n)}}}class ue extends B{constructor(e){super(),J(this,e,null,ce,r,{})}}function ae(t){let n;return{c(){n=m("div"),n.textContent="An Error Occured"},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&h(n)}}}class de extends B{constructor(e){super(),J(this,e,null,ae,r,{})}}function he(t){let n;return{c(){n=m("div"),n.textContent="Setting up..."},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&h(n)}}}class fe extends B{constructor(e){super(),J(this,e,null,he,r,{})}}function me(e){let t,n,s,i,r;const l=e[4].default,a=o(l,e,e[3],null);return{c(){t=m("button"),a&&a.c(),E(t,"class",n=u(e[0])+" svelte-13uk50i"),N(t,"flat",e[1]),N(t,"inverse",e[2])},m(n,o){d(n,t,o),a&&a.m(t,null),s=!0,i||(r=$(t,"click",e[5]),i=!0)},p(e,[i]){a&&a.p&&8&i&&c(a,l,e,e[3],i,null,null),(!s||1&i&&n!==(n=u(e[0])+" svelte-13uk50i"))&&E(t,"class",n),3&i&&N(t,"flat",e[1]),5&i&&N(t,"inverse",e[2])},i(e){s||(z(a,e),s=!0)},o(e){F(a,e),s=!1},d(e){e&&h(t),a&&a.d(e),i=!1,r()}}}function pe(e,t,n){let{$$slots:s={},$$scope:i}=t,{type:r="primary"}=t,{flat:o=!0}=t,{inverse:l=!1}=t;return e.$$set=e=>{"type"in e&&n(0,r=e.type),"flat"in e&&n(1,o=e.flat),"inverse"in e&&n(2,l=e.inverse),"$$scope"in e&&n(3,i=e.$$scope)},[r,o,l,i,s,function(t){_(e,t)}]}class ge extends B{constructor(e){super(),J(this,e,pe,me,r,{type:0,flat:1,inverse:2})}}function $e(e){let t;return{c(){t=p("Tritt ein")},m(e,n){d(e,t,n)},d(e){e&&h(t)}}}function Ee(e){let t,n,i,r,o,l,c,u,f,N,v,O,R,_,w,C,D,x,L,T,S,k,I,A,U;return k=new ge({props:{type:"secondary",$$slots:{default:[$e]},$$scope:{ctx:e}}}),{c(){t=m("h3"),t.textContent="Willkommen beim Accso Wichtelgewusel",n=g(),i=m("div"),r=m("form"),o=m("div"),l=m("label"),l.textContent="Raum",c=g(),u=m("input"),f=g(),N=m("div"),v=p(e[1]),O=g(),R=m("label"),R.textContent="Dein Name",_=g(),w=m("input"),C=g(),D=m("div"),x=p(e[2]),L=g(),T=m("br"),S=g(),P(k.$$.fragment),E(l,"for","room-id"),E(l,"class","svelte-l9wtqe"),E(u,"type","text"),E(u,"placeholder","Fancy-room-name"),E(u,"class","svelte-l9wtqe"),E(N,"class","error svelte-l9wtqe"),E(R,"for","room-id"),E(R,"class","svelte-l9wtqe"),E(w,"type","text"),E(w,"placeholder","Dicey McDiceface"),E(w,"class","svelte-l9wtqe"),E(D,"class","error svelte-l9wtqe"),E(o,"class","join")},m(s,h){var m;d(s,t,h),d(s,n,h),d(s,i,h),a(i,r),a(r,o),a(o,l),a(o,c),a(o,u),y(u,e[0].roomName),a(o,f),a(o,N),a(N,v),a(o,O),a(o,R),a(o,_),a(o,w),y(w,e[0].playerName),a(o,C),a(o,D),a(D,x),a(o,L),a(o,T),a(o,S),V(k,o,null),I=!0,A||(U=[$(u,"input",e[5]),$(w,"input",e[6]),$(r,"submit",(m=e[3],function(e){return e.preventDefault(),m.call(this,e)})),$(i,"submit",e[4])],A=!0)},p(e,[t]){1&t&&u.value!==e[0].roomName&&y(u,e[0].roomName),(!I||2&t)&&b(v,e[1]),1&t&&w.value!==e[0].playerName&&y(w,e[0].playerName),(!I||4&t)&&b(x,e[2]);const n={};512&t&&(n.$$scope={dirty:t,ctx:e}),k.$set(n)},i(e){I||(z(k.$$.fragment,e),I=!0)},o(e){F(k.$$.fragment,e),I=!1},d(e){e&&h(t),e&&h(n),e&&h(i),q(k),A=!1,s(U)}}}function be(e,t,n){let s=R(),{credentials:i={roomName:"",playerName:""}}=t,r="",o="",l=!1;return e.$$set=e=>{"credentials"in e&&n(0,i=e.credentials)},[i,r,o,()=>{l=!0,i.roomName.trim().length<3&&(n(1,r="Der Raum name ist zu kurz..."),l=!1),i.playerName.trim().length<1&&(n(2,o="Hast du keinen Namen?"),l=!1),l&&(n(1,r=""),s("joinRoom",i))},function(t){_(e,t)},function(){i.roomName=this.value,n(0,i)},function(){i.playerName=this.value,n(0,i)}]}class ye extends B{constructor(e){super(),J(this,e,be,Ee,r,{credentials:0})}}function Ne(e,t,n){const s=e.slice();return s[12]=t[n],s}function ve(e,t,n){const s=e.slice();return s[15]=t[n],s}function Oe(e,t,n){const s=e.slice();return s[15]=t[n],s}function Re(e,t,n){const s=e.slice();return s[20]=t[n],s}function _e(e){let t,n,s,i;return t=new ge({props:{$$slots:{default:[we]},$$scope:{ctx:e}}}),t.$on("click",e[5]),{c(){P(t.$$.fragment),n=g(),s=m("br")},m(e,r){V(t,e,r),d(e,n,r),d(e,s,r),i=!0},p(e,n){const s={};8388608&n&&(s.$$scope={dirty:n,ctx:e}),t.$set(s)},i(e){i||(z(t.$$.fragment,e),i=!0)},o(e){F(t.$$.fragment,e),i=!1},d(e){q(t,e),e&&h(n),e&&h(s)}}}function we(e){let t;return{c(){t=p("Add Dice")},m(e,n){d(e,t,n)},d(e){e&&h(t)}}}function Ce(e){let t,n,s,i=e[20].message+"";return{c(){t=m("span"),n=p(i),s=g(),E(t,"class","svelte-1imh6u0")},m(e,i){d(e,t,i),a(t,n),a(t,s)},p(e,t){4&t&&i!==(i=e[20].message+"")&&b(n,i)},d(e){e&&h(t)}}}function De(e){let t,n,s,i,r,o,l,c,u,$,E,y,N,v=e[0].room+"",O=e[3],R=[];for(let t=0;t<O.length;t+=1)R[t]=Ae(Oe(e,O,t));const _=e=>F(R[e],1,1,(()=>{R[e]=null}));let w=e[0].userlist,C=[];for(let t=0;t<w.length;t+=1)C[t]=je(Ne(e,w,t));return{c(){t=m("h3"),n=p("Room "),s=p(v),i=g(),r=m("div");for(let e=0;e<R.length;e+=1)R[e].c();o=g(),l=m("div"),c=m("br"),u=g(),$=m("b"),$.textContent="Spieler:innen",E=m("br"),y=g();for(let e=0;e<C.length;e+=1)C[e].c()},m(e,h){d(e,t,h),a(t,n),a(t,s),d(e,i,h),d(e,r,h);for(let e=0;e<R.length;e+=1)R[e].m(r,null);d(e,o,h),d(e,l,h),a(l,c),a(l,u),a(l,$),a(l,E),a(l,y);for(let e=0;e<C.length;e+=1)C[e].m(l,null);N=!0},p(e,t){if((!N||1&t)&&v!==(v=e[0].room+"")&&b(s,v),74&t){let n;for(O=e[3],n=0;n<O.length;n+=1){const s=Oe(e,O,n);R[n]?(R[n].p(s,t),z(R[n],1)):(R[n]=Ae(s),R[n].c(),z(R[n],1),R[n].m(r,null))}for(K(),n=O.length;n<R.length;n+=1)_(n);W()}if(9&t){let n;for(w=e[0].userlist,n=0;n<w.length;n+=1){const s=Ne(e,w,n);C[n]?C[n].p(s,t):(C[n]=je(s),C[n].c(),C[n].m(l,null))}for(;n<C.length;n+=1)C[n].d(1);C.length=w.length}},i(e){if(!N){for(let e=0;e<O.length;e+=1)z(R[e]);N=!0}},o(e){R=R.filter(Boolean);for(let e=0;e<R.length;e+=1)F(R[e]);N=!1},d(e){e&&h(t),e&&h(i),e&&h(r),f(R,e),e&&h(o),e&&h(l),f(C,e)}}}function xe(t){let n,s;return n=new ye({}),n.$on("joinRoom",t[4]),{c(){P(n.$$.fragment)},m(e,t){V(n,e,t),s=!0},p:e,i(e){s||(z(n.$$.fragment,e),s=!0)},o(e){F(n.$$.fragment,e),s=!1},d(e){q(n,e)}}}function Le(t){let n,s;return n=new de({}),{c(){P(n.$$.fragment)},m(e,t){V(n,e,t),s=!0},p:e,i(e){s||(z(n.$$.fragment,e),s=!0)},o(e){F(n.$$.fragment,e),s=!1},d(e){q(n,e)}}}function Te(t){let n,s;return n=new fe({}),{c(){P(n.$$.fragment)},m(e,t){V(n,e,t),s=!0},p:e,i(e){s||(z(n.$$.fragment,e),s=!0)},o(e){F(n.$$.fragment,e),s=!1},d(e){q(n,e)}}}function Se(e){let t,n,s,i,r,o,l,c=e[15].user.name+"";return{c(){t=m("p"),n=p(c),s=m("br"),i=p("ist dran."),r=g(),o=m("img"),o.src!==(l="img/"+(e[1][e[15].id]||1)+".gif")&&E(o,"src",l),E(o,"alt","Dice")},m(e,l){d(e,t,l),a(t,n),a(t,s),a(t,i),d(e,r,l),d(e,o,l)},p(e,t){8&t&&c!==(c=e[15].user.name+"")&&b(n,c),10&t&&o.src!==(l="img/"+(e[1][e[15].id]||1)+".gif")&&E(o,"src",l)},d(e){e&&h(t),e&&h(r),e&&h(o)}}}function ke(e){let t,n,s,i,r,o;function l(){return e[7](e[15])}return{c(){t=m("p"),t.innerHTML="<b>Du<br/>bist dran!</b>",n=g(),s=m("img"),s.src!==(i="img/"+(e[1][e[15].id]||1)+".gif")&&E(s,"src",i),E(s,"alt","Dice")},m(e,i){d(e,t,i),d(e,n,i),d(e,s,i),r||(o=$(s,"click",l),r=!0)},p(t,n){e=t,10&n&&s.src!==(i="img/"+(e[1][e[15].id]||1)+".gif")&&E(s,"src",i)},d(e){e&&h(t),e&&h(n),e&&h(s),r=!1,o()}}}function Ie(e){let t,n;function s(e,t){return e[15].yourTurn?ke:Se}let i=s(e),r=i(e);return{c(){t=m("div"),r.c(),n=g(),E(t,"class","diespace svelte-1imh6u0")},m(e,s){d(e,t,s),r.m(t,null),d(e,n,s)},p(e,n){i===(i=s(e))&&r?r.p(e,n):(r.d(1),r=i(e),r&&(r.c(),r.m(t,null)))},d(e){e&&h(t),r.d(),e&&h(n)}}}function Ae(e){let t,n;return t=new re({props:{$$slots:{default:[Ie]},$$scope:{ctx:e}}}),{c(){P(t.$$.fragment)},m(e,s){V(t,e,s),n=!0},p(e,n){const s={};8388618&n&&(s.$$scope={dirty:n,ctx:e}),t.$set(s)},i(e){n||(z(t.$$.fragment,e),n=!0)},o(e){F(t.$$.fragment,e),n=!1},d(e){q(t,e)}}}function Ue(e){let t;return{c(){t=p("🎲")},m(e,n){d(e,t,n)},d(e){e&&h(t)}}}function Me(e){let t,n=e[15].user.id===e[12].id&&Ue();return{c(){n&&n.c(),t=p("")},m(e,s){n&&n.m(e,s),d(e,t,s)},p(e,s){e[15].user.id===e[12].id?n||(n=Ue(),n.c(),n.m(t.parentNode,t)):n&&(n.d(1),n=null)},d(e){n&&n.d(e),e&&h(t)}}}function je(e){let t,n,s,i,r=e[12].name+"",o=e[3],l=[];for(let t=0;t<o.length;t+=1)l[t]=Me(ve(e,o,t));return{c(){t=p(r),n=g();for(let e=0;e<l.length;e+=1)l[e].c();s=g(),i=m("br")},m(e,r){d(e,t,r),d(e,n,r);for(let t=0;t<l.length;t+=1)l[t].m(e,r);d(e,s,r),d(e,i,r)},p(e,n){if(1&n&&r!==(r=e[12].name+"")&&b(t,r),9&n){let t;for(o=e[3],t=0;t<o.length;t+=1){const i=ve(e,o,t);l[t]?l[t].p(i,n):(l[t]=Me(i),l[t].c(),l[t].m(s.parentNode,s))}for(;t<l.length;t+=1)l[t].d(1);l.length=o.length}},d(e){e&&h(t),e&&h(n),f(l,e),e&&h(s),e&&h(i)}}}function Ke(e){let t,n,s,i,r,o,l,c,u,p,$,b,y;t=new le({});let N=!0===e[0].self.firstUser&&_e(e),v=e[2],O=[];for(let t=0;t<v.length;t+=1)O[t]=Ce(Re(e,v,t));const R=[Te,Le,xe,De],_=[];function w(e,t){return e[0].status===ne.SETUP?0:e[0].status===ne.ERROR?1:e[0].status===ne.READY?2:e[0].status===ne.CONNECTED?3:-1}return~(u=w(e))&&(p=_[u]=R[u](e)),b=new ue({}),{c(){P(t.$$.fragment),n=g(),s=m("div"),N&&N.c(),i=g(),r=m("div");for(let e=0;e<O.length;e+=1)O[e].c();o=g(),l=m("main"),c=m("div"),p&&p.c(),$=g(),P(b.$$.fragment),E(s,"class","setting svelte-1imh6u0"),E(r,"class","eventlog svelte-1imh6u0"),E(c,"class","gamearea svelte-1imh6u0"),E(l,"class","svelte-1imh6u0")},m(e,h){V(t,e,h),d(e,n,h),d(e,s,h),N&&N.m(s,null),d(e,i,h),d(e,r,h);for(let e=0;e<O.length;e+=1)O[e].m(r,null);d(e,o,h),d(e,l,h),a(l,c),~u&&_[u].m(c,null),d(e,$,h),V(b,e,h),y=!0},p(e,[t]){if(!0===e[0].self.firstUser?N?(N.p(e,t),1&t&&z(N,1)):(N=_e(e),N.c(),z(N,1),N.m(s,null)):N&&(K(),F(N,1,1,(()=>{N=null})),W()),4&t){let n;for(v=e[2],n=0;n<v.length;n+=1){const s=Re(e,v,n);O[n]?O[n].p(s,t):(O[n]=Ce(s),O[n].c(),O[n].m(r,null))}for(;n<O.length;n+=1)O[n].d(1);O.length=v.length}let n=u;u=w(e),u===n?~u&&_[u].p(e,t):(p&&(K(),F(_[n],1,1,(()=>{_[n]=null})),W()),~u?(p=_[u],p?p.p(e,t):(p=_[u]=R[u](e),p.c()),z(p,1),p.m(c,null)):p=null)},i(e){y||(z(t.$$.fragment,e),z(N),z(p),z(b.$$.fragment,e),y=!0)},o(e){F(t.$$.fragment,e),F(N),F(p),F(b.$$.fragment,e),y=!1},d(e){q(t,e),e&&h(n),e&&h(s),N&&N.d(),e&&h(i),e&&h(r),f(O,e),e&&h(o),e&&h(l),~u&&_[u].d(),e&&h($),q(b,e)}}}function We(e,t,n){let s={roomName:"",playerName:""};document.body.addEventListener("dice-pusher-updated",(()=>{n(0,o),console.log("Updated DicePusher"),console.log("Users: ")})),G.listen(Y.ROLL_DICE,(e=>{n(1,l[e.dice]=e.eyes,l),console.log("Last Rolls: "+l),c[e.dice]=!0,window.setTimeout((()=>{c[e.dice]=!1}),2500)})),G.listen(Q.ROOM_USER_JOIN,(e=>{console.log("User Joined Room: "+e.info.name),console.log("Current users: "),i(e.info.name+" ist dem Raum beigetreten"),u=[],o.userlist.map((e=>{let t={};t.id=e.id,t.name=e.name||"anonymous?",u.push(t),console.log("\n"+t.name)}));let t={};t.id=e.info.id,t.name=e.info.name,u.push(t)})),G.listen(Q.ROOM_USER_LEAVE,(e=>{console.log("User Left Room: "+e.info.name)}));const i=e=>{a.unshift({id:a.length,message:e}),n(2,a),console.log(a)},r=e=>{i("click"),c[e]||o.roll(e)};let o,l,c,u,a,d;return e.$$.update=()=>{1&e.$$.dirty&&n(3,d=o.dices.map(((e,t)=>{let n={};return n.id=t,n.user=o.users[e],n.yourTurn=!1,n.user&&n.user.id===o.self.id&&(n.yourTurn=!0),n})))},n(0,o=new te({network:{authEndpoint:"//gheist.net/api/pusher/auth/generic/presence/1098358",appKey:"d209ebf4ad2e3647739c"}})),n(1,l=[1]),c=[],u=[],n(2,a=[]),[o,l,a,d,e=>{s=e.detail,console.log("User "+s.playerName+" is joining room "+s.roomName),o.joinRoom(s.roomName,s.playerName),console.log("DicePusher: "+o)},()=>{o.addDice(),l.push(1)},r,e=>r(e.id)]}return new class extends B{constructor(e){super(),J(this,e,We,Ke,r,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
