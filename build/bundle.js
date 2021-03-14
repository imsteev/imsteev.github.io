var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function s(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e,n,o){if(t){const s=c(t,e,n,o);return t[0](s)}}function c(t,e,n,o){return t[1]&&o?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](o(e))):n.ctx}function l(t,e,n,o,s,r,i){const l=function(t,e,n,o){if(t[2]&&o){const s=t[2](o(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|s[o];return t}return e.dirty|s}return e.dirty}(e,o,s,r);if(l){const s=c(e,n,o,i);t.p(s,l)}}function a(t){return null==t?"":t}function u(t,e){t.appendChild(e)}function $(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode.removeChild(t)}function f(t){return document.createElement(t)}function p(t){return document.createTextNode(t)}function m(){return p(" ")}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}let v;function y(t){v=t}const b=[],x=[],w=[],k=[],_=Promise.resolve();let C=!1;function I(t){w.push(t)}let T=!1;const j=new Set;function q(){if(!T){T=!0;do{for(let t=0;t<b.length;t+=1){const e=b[t];y(e),E(e.$$)}for(y(null),b.length=0;x.length;)x.pop()();for(let t=0;t<w.length;t+=1){const e=w[t];j.has(e)||(j.add(e),e())}w.length=0}while(b.length);for(;k.length;)k.pop()();C=!1,T=!1,j.clear()}}function E(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(I)}}const A=new Set;function H(t,e){t&&t.i&&(A.delete(t),t.i(e))}function S(t,e,n,o){if(t&&t.o){if(A.has(t))return;A.add(t),undefined.c.push((()=>{A.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function L(t){t&&t.c()}function M(t,n,r,i){const{fragment:c,on_mount:l,on_destroy:a,after_update:u}=t.$$;c&&c.m(n,r),i||I((()=>{const n=l.map(e).filter(s);a?a.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(I)}function z(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function N(t,e){-1===t.$$.dirty[0]&&(b.push(t),C||(C=!0,_.then(q)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function O(e,s,r,i,c,l,a=[-1]){const u=v;y(e);const $=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:n(),dirty:a,skip_bound:!1};let f=!1;if($.ctx=r?r(e,s.props||{},((t,n,...o)=>{const s=o.length?o[0]:n;return $.ctx&&c($.ctx[t],$.ctx[t]=s)&&(!$.skip_bound&&$.bound[t]&&$.bound[t](s),f&&N(e,t)),n})):[],$.update(),f=!0,o($.before_update),$.fragment=!!i&&i($.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);$.fragment&&$.fragment.l(t),t.forEach(d)}else $.fragment&&$.fragment.c();s.intro&&H(e.$$.fragment),M(e,s.target,s.anchor,s.customElement),q()}y(u)}class R{$destroy(){z(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function W(t){let e,n;const o=t[1].default,s=i(o,t,t[0],null);return{c(){e=f("div"),s&&s.c(),g(e,"class","svelte-1ku14pv")},m(t,o){$(t,e,o),s&&s.m(e,null),n=!0},p(t,[e]){s&&s.p&&1&e&&l(s,o,t,t[0],e,null,null)},i(t){n||(H(s,t),n=!0)},o(t){S(s,t),n=!1},d(t){t&&d(e),s&&s.d(t)}}}function B(t,e,n){let{$$slots:o={},$$scope:s}=e;return t.$$set=t=>{"$$scope"in t&&n(0,s=t.$$scope)},[s,o]}class P extends R{constructor(t){super(),O(this,t,B,W,r,{})}}function V(t){let e,n,o,r;const c=t[2].default,a=i(c,t,t[1],null);return{c(){e=f("button"),a&&a.c(),g(e,"class","svelte-bo77dt")},m(i,c){var l,u,d,f;$(i,e,c),a&&a.m(e,null),n=!0,o||(u="click",d=function(){s(t[0])&&t[0].apply(this,arguments)},(l=e).addEventListener(u,d,f),r=()=>l.removeEventListener(u,d,f),o=!0)},p(e,[n]){t=e,a&&a.p&&2&n&&l(a,c,t,t[1],n,null,null)},i(t){n||(H(a,t),n=!0)},o(t){S(a,t),n=!1},d(t){t&&d(e),a&&a.d(t),o=!1,r()}}}function F(t,e,n){let{$$slots:o={},$$scope:s}=e,{onClick:r}=e;return t.$$set=t=>{"onClick"in t&&n(0,r=t.onClick),"$$scope"in t&&n(1,s=t.$$scope)},[r,s,o]}class G extends R{constructor(t){super(),O(this,t,F,V,r,{onClick:0})}}function U(t){let e,n;return{c(){e=p("another "),n=p(t[0])},m(t,o){$(t,e,o),$(t,n,o)},p(t,e){1&e&&h(n,t[0])},d(t){t&&d(e),t&&d(n)}}}function D(e){let n;return{c(){n=p("Loading doge...")},m(t,e){$(t,n,e)},p:t,d(t){t&&d(n)}}}function J(t){let e,n;return{c(){e=f("img"),g(e,"alt","random-shiba"),e.src!==(n=t[1])&&g(e,"src",n)},m(t,n){$(t,e,n)},p(t,o){2&o&&e.src!==(n=t[1])&&g(e,"src",n)},d(t){t&&d(e)}}}function K(t){let e;function n(t,e){return t[2]?D:J}let o=n(t),s=o(t);return{c(){e=f("figure"),s.c(),g(e,"style",{padding:0,margin:"1rem 0"})},m(t,n){$(t,e,n),s.m(e,null)},p(t,r){o===(o=n(t))&&s?s.p(t,r):(s.d(1),s=o(t),s&&(s.c(),s.m(e,null)))},d(t){t&&d(e),s.d()}}}function Q(t){let e,n,o,s,r;return n=new G({props:{onClick:t[3],$$slots:{default:[U]},$$scope:{ctx:t}}}),s=new P({props:{$$slots:{default:[K]},$$scope:{ctx:t}}}),{c(){e=f("div"),L(n.$$.fragment),o=m(),L(s.$$.fragment)},m(t,i){$(t,e,i),M(n,e,null),u(e,o),M(s,e,null),r=!0},p(t,[e]){const o={};17&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o);const r={};22&e&&(r.$$scope={dirty:e,ctx:t}),s.$set(r)},i(t){r||(H(n.$$.fragment,t),H(s.$$.fragment,t),r=!0)},o(t){S(n.$$.fragment,t),S(s.$$.fragment,t),r=!1},d(t){t&&d(e),z(n),z(s)}}}function X(t,e,n){let o,s,{breed:r}=e;const i=()=>{n(2,s=!0),fetch(`https://dog.ceo/api/breed/${r}/images/random`,{}).then((t=>{if(!t.ok)throw"Request failed";return t.json()})).then((t=>n(1,o=t.message))).finally((()=>{n(2,s=!1)}))};return t.$$set=t=>{"breed"in t&&n(0,r=t.breed)},n(1,o=""),n(2,s=!1),i(),[r,o,s,i]}class Y extends R{constructor(t){super(),O(this,t,X,Q,r,{breed:0})}}function Z(t){let e,n=t[0]?"pause animations":"play animations";return{c(){e=p(n)},m(t,n){$(t,e,n)},p(t,o){1&o&&n!==(n=t[0]?"pause animations":"play animations")&&h(e,n)},d(t){t&&d(e)}}}function tt(t){let e,n,o,s,r,i,c,l,u;return{c(){e=f("p"),e.textContent="Look it's a rotating square",n=m(),o=f("div"),r=m(),i=f("p"),i.textContent="This one's a mover",c=m(),l=f("div"),g(o,"class",s=a(`box animate-${t[0]}`)+" svelte-g0szgt"),g(o,"id","animation-1"),g(l,"class",u=a(`box animate-${t[0]}`)+" svelte-g0szgt"),g(l,"id","animation-2")},m(t,s){$(t,e,s),$(t,n,s),$(t,o,s),$(t,r,s),$(t,i,s),$(t,c,s),$(t,l,s)},p(t,e){1&e&&s!==(s=a(`box animate-${t[0]}`)+" svelte-g0szgt")&&g(o,"class",s),1&e&&u!==(u=a(`box animate-${t[0]}`)+" svelte-g0szgt")&&g(l,"class",u)},d(t){t&&d(e),t&&d(n),t&&d(o),t&&d(r),t&&d(i),t&&d(c),t&&d(l)}}}function et(t){let e,n,o,s,r,i;return o=new G({props:{onClick:t[1],$$slots:{default:[Z]},$$scope:{ctx:t}}}),r=new P({props:{$$slots:{default:[tt]},$$scope:{ctx:t}}}),{c(){e=f("div"),n=f("div"),L(o.$$.fragment),s=m(),L(r.$$.fragment)},m(t,c){$(t,e,c),u(e,n),M(o,n,null),u(n,s),M(r,n,null),i=!0},p(t,[e]){const n={};1&e&&(n.onClick=t[1]),5&e&&(n.$$scope={dirty:e,ctx:t}),o.$set(n);const s={};5&e&&(s.$$scope={dirty:e,ctx:t}),r.$set(s)},i(t){i||(H(o.$$.fragment,t),H(r.$$.fragment,t),i=!0)},o(t){S(o.$$.fragment,t),S(r.$$.fragment,t),i=!1},d(t){t&&d(e),z(o),z(r)}}}function nt(t,e,n){let o;return n(0,o=!1),[o,()=>n(0,o=!o)]}class ot extends R{constructor(t){super(),O(this,t,nt,et,r,{})}}function st(t){let e,n,o,s,r,c,a,v=(t[1]&&t[2]?`"${t[1]}"`:t[1])+"";const y=t[4].default,b=i(y,t,t[3],null);return{c(){e=f("div"),n=f("p"),o=p(t[0]),s=m(),r=p(v),c=m(),b&&b.c(),g(n,"class","header svelte-15brc8w"),g(e,"class","svelte-15brc8w")},m(t,i){$(t,e,i),u(e,n),u(n,o),u(n,s),u(n,r),u(n,c),b&&b.m(n,null),a=!0},p(t,[e]){(!a||1&e)&&h(o,t[0]),(!a||6&e)&&v!==(v=(t[1]&&t[2]?`"${t[1]}"`:t[1])+"")&&h(r,v),b&&b.p&&8&e&&l(b,y,t,t[3],e,null,null)},i(t){a||(H(b,t),a=!0)},o(t){S(b,t),a=!1},d(t){t&&d(e),b&&b.d(t)}}}function rt(t,e,n){let{$$slots:o={},$$scope:s}=e,{date:r}=e,{title:i}=e,{enclosedTitle:c=!1}=e;return t.$$set=t=>{"date"in t&&n(0,r=t.date),"title"in t&&n(1,i=t.title),"enclosedTitle"in t&&n(2,c=t.enclosedTitle),"$$scope"in t&&n(3,s=t.$$scope)},[r,i,c,s,o]}class it extends R{constructor(t){super(),O(this,t,rt,st,r,{date:0,title:1,enclosedTitle:2})}}function ct(e){let n,o;return n=new Y({props:{breed:"shiba"}}),{c(){L(n.$$.fragment)},m(t,e){M(n,t,e),o=!0},p:t,i(t){o||(H(n.$$.fragment,t),o=!0)},o(t){S(n.$$.fragment,t),o=!1},d(t){z(n,t)}}}function lt(t){let e,n;return e=new ot({}),{c(){L(e.$$.fragment)},m(t,o){M(e,t,o),n=!0},i(t){n||(H(e.$$.fragment,t),n=!0)},o(t){S(e.$$.fragment,t),n=!1},d(t){z(e,t)}}}function at(t){let e,n,o;return{c(){e=f("p"),e.textContent="I previously implemented my personal website using Vue.js, but it quickly\n      became hard to maintain without a proper component structure. So I rewrote\n      this site with React since I'm more familiar with it now than I am with\n      Vue.js.",n=m(),o=f("p"),o.textContent="Hopefully the ease of modifying content will encourage me to write more\n      often."},m(t,s){$(t,e,s),$(t,n,s),$(t,o,s)},d(t){t&&d(e),t&&d(n),t&&d(o)}}}function ut(e){let n,o,s,r,i,c,l,a,g,h,v,y,b,x,w,k;return{c(){n=f("p"),n.textContent="Reflecting on my upbringing, I grew up in a sheltered, educated, and\n      diverse neighborhood. For this reason, I don't feel entitled to the\n      conviction that the world is feeling. But I am hurt. I am angry, I am\n      confused, I am baffled, I am tired.",o=m(),s=f("p"),r=p("What this all boils down to: "),i=f("strong"),i.textContent="mindless",c=p(","),l=p(" "),a=m(),g=f("strong"),g.textContent="racist",h=p(", and "),v=f("strong"),v.textContent="ignorant bigots",y=p(" in power."),b=m(),x=f("ul"),x.innerHTML="<li>What will push the country for tangible change?</li> \n      <li>How can we trust leaders of this country?</li> \n      <li>How many &quot;accidental&quot; martyrs will there be?</li> \n      <li>How can someone watch these events of police brutality events happening\n        and say &quot;this is just an accident&quot;?</li> \n      <li>How can we redefine justice?</li> \n      <li><strong>Why would a cop put a knee on someone&#39;s neck for 8 minutes and 46\n          seconds?</strong></li>",w=m(),k=f("p"),k.textContent="I urge everyone to reflect and ask themselves these questions, and I hope\n      you feel as troubled as I do."},m(t,e){$(t,n,e),$(t,o,e),$(t,s,e),u(s,r),u(s,i),u(s,c),u(s,l),u(s,a),u(s,g),u(s,h),u(s,v),u(s,y),$(t,b,e),$(t,x,e),$(t,w,e),$(t,k,e)},p:t,d(t){t&&d(n),t&&d(o),t&&d(s),t&&d(b),t&&d(x),t&&d(w),t&&d(k)}}}function $t(t){let e,n,o,s,r,i,c,l,a;return n=new it({props:{title:"Shiba Generator",date:"August 31",enclosedTitle:!0,$$slots:{default:[ct]},$$scope:{ctx:t}}}),s=new it({props:{title:"CSS Practice",date:"August 30, 2020",enclosedTitle:!0,$$slots:{default:[lt]},$$scope:{ctx:t}}}),i=new it({props:{date:"August 29, 2020",title:"v2",enclosedTitle:!0,$$slots:{default:[at]},$$scope:{ctx:t}}}),l=new it({props:{date:"May 31, 2020",title:"Unrest",enclosedTitle:!0,$$slots:{default:[ut]},$$scope:{ctx:t}}}),{c(){e=f("div"),L(n.$$.fragment),o=m(),L(s.$$.fragment),r=m(),L(i.$$.fragment),c=m(),L(l.$$.fragment),g(e,"class","svelte-rvent")},m(t,d){$(t,e,d),M(n,e,null),u(e,o),M(s,e,null),u(e,r),M(i,e,null),u(e,c),M(l,e,null),a=!0},p(t,[e]){const o={};1&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o);const r={};1&e&&(r.$$scope={dirty:e,ctx:t}),s.$set(r);const c={};1&e&&(c.$$scope={dirty:e,ctx:t}),i.$set(c);const a={};1&e&&(a.$$scope={dirty:e,ctx:t}),l.$set(a)},i(t){a||(H(n.$$.fragment,t),H(s.$$.fragment,t),H(i.$$.fragment,t),H(l.$$.fragment,t),a=!0)},o(t){S(n.$$.fragment,t),S(s.$$.fragment,t),S(i.$$.fragment,t),S(l.$$.fragment,t),a=!1},d(t){t&&d(e),z(n),z(s),z(i),z(l)}}}class dt extends R{constructor(t){super(),O(this,t,null,$t,r,{})}}function ft(e){let n,o,s,r,i,c;return i=new dt({}),{c(){n=f("main"),o=f("div"),s=f("div"),s.innerHTML='<div>Stephen Chung</div> \n      <div><a href="https://www.github.com/imsteev" target="_blank" class="svelte-87vs6k">github</a>\n         \n        <a href="https://www.linkedin.com/in/imsteev/" target="_blank" class="svelte-87vs6k">linkedin</a></div>',r=m(),L(i.$$.fragment),g(s,"class","meta-info-container svelte-87vs6k"),g(o,"class","container svelte-87vs6k"),g(n,"class","svelte-87vs6k")},m(t,e){$(t,n,e),u(n,o),u(o,s),u(o,r),M(i,o,null),c=!0},p:t,i(t){c||(H(i.$$.fragment,t),c=!0)},o(t){S(i.$$.fragment,t),c=!1},d(t){t&&d(n),z(i)}}}return new class extends R{constructor(t){super(),O(this,t,null,ft,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
