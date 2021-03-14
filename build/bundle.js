var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function s(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e,n,o){if(t){const s=c(t,e,n,o);return t[0](s)}}function c(t,e,n,o){return t[1]&&o?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](o(e))):n.ctx}function l(t,e,n,o,s,r,i){const l=function(t,e,n,o){if(t[2]&&o){const s=t[2](o(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|s[o];return t}return e.dirty|s}return e.dirty}(e,o,s,r);if(l){const s=c(e,n,o,i);t.p(s,l)}}function a(t){return null==t?"":t}function u(t,e){t.appendChild(e)}function $(t,e,n){t.insertBefore(e,n||null)}function f(t){t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function m(t){return document.createTextNode(t)}function p(){return m(" ")}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}let y;function v(t){y=t}const x=[],w=[],b=[],k=[],C=Promise.resolve();let _=!1;function j(t){b.push(t)}let I=!1;const q=new Set;function T(){if(!I){I=!0;do{for(let t=0;t<x.length;t+=1){const e=x[t];v(e),S(e.$$)}for(v(null),x.length=0;w.length;)w.pop()();for(let t=0;t<b.length;t+=1){const e=b[t];q.has(e)||(q.add(e),e())}b.length=0}while(x.length);for(;k.length;)k.pop()();_=!1,I=!1,q.clear()}}function S(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(j)}}const E=new Set;function A(t,e){t&&t.i&&(E.delete(t),t.i(e))}function H(t,e,n,o){if(t&&t.o){if(E.has(t))return;E.add(t),undefined.c.push((()=>{E.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function L(t){t&&t.c()}function M(t,n,r,i){const{fragment:c,on_mount:l,on_destroy:a,after_update:u}=t.$$;c&&c.m(n,r),i||j((()=>{const n=l.map(e).filter(s);a?a.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(j)}function z(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function R(t,e){-1===t.$$.dirty[0]&&(x.push(t),_||(_=!0,C.then(T)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function N(e,s,r,i,c,l,a=[-1]){const u=y;v(e);const $=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:n(),dirty:a,skip_bound:!1};let d=!1;if($.ctx=r?r(e,s.props||{},((t,n,...o)=>{const s=o.length?o[0]:n;return $.ctx&&c($.ctx[t],$.ctx[t]=s)&&(!$.skip_bound&&$.bound[t]&&$.bound[t](s),d&&R(e,t)),n})):[],$.update(),d=!0,o($.before_update),$.fragment=!!i&&i($.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);$.fragment&&$.fragment.l(t),t.forEach(f)}else $.fragment&&$.fragment.c();s.intro&&A(e.$$.fragment),M(e,s.target,s.anchor,s.customElement),T()}v(u)}class O{$destroy(){z(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function W(t){let e,n,o;const s=t[2].default,r=i(s,t,t[1],null);return{c(){e=d("div"),r&&r.c(),g(e,"style",n=t[0]?`justify-content: ${t[0]}`:""),g(e,"class","svelte-1ku14pv")},m(t,n){$(t,e,n),r&&r.m(e,null),o=!0},p(t,[i]){r&&r.p&&2&i&&l(r,s,t,t[1],i,null,null),(!o||1&i&&n!==(n=t[0]?`justify-content: ${t[0]}`:""))&&g(e,"style",n)},i(t){o||(A(r,t),o=!0)},o(t){H(r,t),o=!1},d(t){t&&f(e),r&&r.d(t)}}}function B(t,e,n){let{$$slots:o={},$$scope:s}=e,{justifyContent:r}=e;return t.$$set=t=>{"justifyContent"in t&&n(0,r=t.justifyContent),"$$scope"in t&&n(1,s=t.$$scope)},[r,s,o]}class P extends O{constructor(t){super(),N(this,t,B,W,r,{justifyContent:0})}}function V(t){let e,n,o,r;const c=t[2].default,a=i(c,t,t[1],null);return{c(){e=d("button"),a&&a.c(),g(e,"class","svelte-bo77dt")},m(i,c){var l,u,f,d;$(i,e,c),a&&a.m(e,null),n=!0,o||(u="click",f=function(){s(t[0])&&t[0].apply(this,arguments)},(l=e).addEventListener(u,f,d),r=()=>l.removeEventListener(u,f,d),o=!0)},p(e,[n]){t=e,a&&a.p&&2&n&&l(a,c,t,t[1],n,null,null)},i(t){n||(A(a,t),n=!0)},o(t){H(a,t),n=!1},d(t){t&&f(e),a&&a.d(t),o=!1,r()}}}function F(t,e,n){let{$$slots:o={},$$scope:s}=e,{onClick:r}=e;return t.$$set=t=>{"onClick"in t&&n(0,r=t.onClick),"$$scope"in t&&n(1,s=t.$$scope)},[r,s,o]}class G extends O{constructor(t){super(),N(this,t,F,V,r,{onClick:0})}}function U(t){let e,n,o,s,r,c,a,y,v,x,w;const b=t[3].default,k=i(b,t,t[2],null);return{c(){e=d("div"),n=d("div"),o=d("div"),s=m(t[1]),r=p(),c=d("div"),a=m(t[0]),y=p(),v=d("div"),x=p(),k&&k.c(),g(o,"class","title svelte-t7o56v"),g(n,"class","header-title svelte-t7o56v"),g(v,"class","svelte-t7o56v"),g(e,"class","post-container svelte-t7o56v")},m(t,i){$(t,e,i),u(e,n),u(n,o),u(o,s),u(n,r),u(n,c),u(c,a),u(e,y),u(e,v),u(e,x),k&&k.m(e,null),w=!0},p(t,[e]){(!w||2&e)&&h(s,t[1]),(!w||1&e)&&h(a,t[0]),k&&k.p&&4&e&&l(k,b,t,t[2],e,null,null)},i(t){w||(A(k,t),w=!0)},o(t){H(k,t),w=!1},d(t){t&&f(e),k&&k.d(t)}}}function D(t,e,n){let{$$slots:o={},$$scope:s}=e,{date:r}=e,{title:i}=e;return t.$$set=t=>{"date"in t&&n(0,r=t.date),"title"in t&&n(1,i=t.title),"$$scope"in t&&n(2,s=t.$$scope)},[r,i,s,o]}class J extends O{constructor(t){super(),N(this,t,D,U,r,{date:0,title:1})}}function K(t){let e,n=t[0]?"pause animations":"play animations";return{c(){e=m(n)},m(t,n){$(t,e,n)},p(t,o){1&o&&n!==(n=t[0]?"pause animations":"play animations")&&h(e,n)},d(t){t&&f(e)}}}function Q(t){let e,n,o,s,r,i,c,l,u;return{c(){e=d("p"),e.textContent="Look it's a rotating square",n=p(),o=d("div"),r=p(),i=d("p"),i.textContent="This one's a mover",c=p(),l=d("div"),g(o,"class",s=a(`box animate-${t[0]}`)+" svelte-g0szgt"),g(o,"id","animation-1"),g(l,"class",u=a(`box animate-${t[0]}`)+" svelte-g0szgt"),g(l,"id","animation-2")},m(t,s){$(t,e,s),$(t,n,s),$(t,o,s),$(t,r,s),$(t,i,s),$(t,c,s),$(t,l,s)},p(t,e){1&e&&s!==(s=a(`box animate-${t[0]}`)+" svelte-g0szgt")&&g(o,"class",s),1&e&&u!==(u=a(`box animate-${t[0]}`)+" svelte-g0szgt")&&g(l,"class",u)},d(t){t&&f(e),t&&f(n),t&&f(o),t&&f(r),t&&f(i),t&&f(c),t&&f(l)}}}function X(t){let e,n,o,s,r;return n=new G({props:{onClick:t[1],$$slots:{default:[K]},$$scope:{ctx:t}}}),s=new P({props:{$$slots:{default:[Q]},$$scope:{ctx:t}}}),{c(){e=d("div"),L(n.$$.fragment),o=p(),L(s.$$.fragment)},m(t,i){$(t,e,i),M(n,e,null),u(e,o),M(s,e,null),r=!0},p(t,e){const o={};1&e&&(o.onClick=t[1]),5&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o);const r={};5&e&&(r.$$scope={dirty:e,ctx:t}),s.$set(r)},i(t){r||(A(n.$$.fragment,t),A(s.$$.fragment,t),r=!0)},o(t){H(n.$$.fragment,t),H(s.$$.fragment,t),r=!1},d(t){t&&f(e),z(n),z(s)}}}function Y(t){let e,n;return e=new J({props:{title:"CSS Practice",date:"August 30, 2020",enclosedTitle:!0,$$slots:{default:[X]},$$scope:{ctx:t}}}),{c(){L(e.$$.fragment)},m(t,o){M(e,t,o),n=!0},p(t,[n]){const o={};5&n&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){n||(A(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){z(e,t)}}}function Z(t,e,n){let o;return n(0,o=!1),[o,()=>n(0,o=!o)]}class tt extends O{constructor(t){super(),N(this,t,Z,Y,r,{})}}function et(t){let e;return{c(){e=m("another shiba")},m(t,n){$(t,e,n)},d(t){t&&f(e)}}}function nt(e){let n;return{c(){n=m("Loading doge...")},m(t,e){$(t,n,e)},p:t,d(t){t&&f(n)}}}function ot(t){let e,n;return{c(){e=d("img"),g(e,"alt","random-shiba"),e.src!==(n=t[0])&&g(e,"src",n)},m(t,n){$(t,e,n)},p(t,o){1&o&&e.src!==(n=t[0])&&g(e,"src",n)},d(t){t&&f(e)}}}function st(t){let e;function n(t,e){return t[1]?nt:ot}let o=n(t),s=o(t);return{c(){e=d("figure"),s.c(),g(e,"style",{padding:0,margin:"1rem 0"})},m(t,n){$(t,e,n),s.m(e,null)},p(t,r){o===(o=n(t))&&s?s.p(t,r):(s.d(1),s=o(t),s&&(s.c(),s.m(e,null)))},d(t){t&&f(e),s.d()}}}function rt(t){let e,n,o,s;return e=new G({props:{onClick:t[2],$$slots:{default:[et]},$$scope:{ctx:t}}}),o=new P({props:{$$slots:{default:[st]},$$scope:{ctx:t}}}),{c(){L(e.$$.fragment),n=p(),L(o.$$.fragment)},m(t,r){M(e,t,r),$(t,n,r),M(o,t,r),s=!0},p(t,n){const s={};8&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s);const r={};11&n&&(r.$$scope={dirty:n,ctx:t}),o.$set(r)},i(t){s||(A(e.$$.fragment,t),A(o.$$.fragment,t),s=!0)},o(t){H(e.$$.fragment,t),H(o.$$.fragment,t),s=!1},d(t){z(e,t),t&&f(n),z(o,t)}}}function it(t){let e,n;return e=new J({props:{title:"Shiba Generator",date:"August 31, 2020",enclosedTitle:!0,$$slots:{default:[rt]},$$scope:{ctx:t}}}),{c(){L(e.$$.fragment)},m(t,o){M(e,t,o),n=!0},p(t,[n]){const o={};11&n&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){n||(A(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){z(e,t)}}}function ct(t,e,n){let o,s;const r=()=>{n(1,s=!0),fetch("https://dog.ceo/api/breed/shiba/images/random",{}).then((t=>{if(!t.ok)throw"Request failed";return t.json()})).then((t=>n(0,o=t.message))).finally((()=>{n(1,s=!1)}))};return n(0,o=""),n(1,s=!1),r(),[o,s,r]}class lt extends O{constructor(t){super(),N(this,t,ct,it,r,{})}}function at(e){let n,o,s,r,i,c,l,a,g,h,y,v,x,w,b,k;return{c(){n=d("p"),n.textContent="Reflecting on my upbringing, I grew up in a sheltered, educated, and diverse\n    neighborhood. For this reason, I don't feel entitled to the conviction that\n    the world is feeling. But I am hurt. I am angry, I am confused, I am\n    baffled, I am tired.",o=p(),s=d("p"),r=m("What this all boils down to: "),i=d("strong"),i.textContent="mindless",c=m(","),l=m(" "),a=p(),g=d("strong"),g.textContent="racist",h=m(", and "),y=d("strong"),y.textContent="ignorant bigots",v=m(" in power."),x=p(),w=d("ul"),w.innerHTML="<li>What will push the country for tangible change?</li> \n    <li>How can we trust leaders of this country?</li> \n    <li>How many &quot;accidental&quot; martyrs will there be?</li> \n    <li>How can someone watch these events of police brutality events happening\n      and say &quot;this is just an accident&quot;?</li> \n    <li>How can we redefine justice?</li> \n    <li><strong>Why would a cop put a knee on someone&#39;s neck for 8 minutes and 46\n        seconds?</strong></li>",b=p(),k=d("p"),k.textContent="I urge everyone to reflect and ask themselves these questions, and I hope\n    you feel as troubled as I do."},m(t,e){$(t,n,e),$(t,o,e),$(t,s,e),u(s,r),u(s,i),u(s,c),u(s,l),u(s,a),u(s,g),u(s,h),u(s,y),u(s,v),$(t,x,e),$(t,w,e),$(t,b,e),$(t,k,e)},p:t,d(t){t&&f(n),t&&f(o),t&&f(s),t&&f(x),t&&f(w),t&&f(b),t&&f(k)}}}function ut(t){let e,n;return e=new J({props:{date:"May 31, 2020",title:"Unrest",enclosedTitle:!0,$$slots:{default:[at]},$$scope:{ctx:t}}}),{c(){L(e.$$.fragment)},m(t,o){M(e,t,o),n=!0},p(t,[n]){const o={};1&n&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){n||(A(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){z(e,t)}}}class $t extends O{constructor(t){super(),N(this,t,null,ut,r,{})}}function ft(t){let e,n,o;return{c(){e=d("p"),e.textContent="I previously implemented my personal website using Vue.js, but it quickly\n    became hard to maintain without a proper component structure. So I rewrote\n    this site with React since I'm more familiar with it now than I am with\n    Vue.js.",n=p(),o=d("p"),o.textContent="Hopefully the ease of modifying content will encourage me to write more\n    often."},m(t,s){$(t,e,s),$(t,n,s),$(t,o,s)},d(t){t&&f(e),t&&f(n),t&&f(o)}}}function dt(t){let e,n;return e=new J({props:{date:"August 29, 2020",title:"v2",enclosedTitle:!0,$$slots:{default:[ft]},$$scope:{ctx:t}}}),{c(){L(e.$$.fragment)},m(t,o){M(e,t,o),n=!0},p(t,[n]){const o={};1&n&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){n||(A(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){z(e,t)}}}class mt extends O{constructor(t){super(),N(this,t,null,dt,r,{})}}function pt(t){let e;return{c(){e=d("p"),e.textContent="I ported the site implemention from React to Svelte. I realized there was no\n    need for a heavy application library like React since this site is more or\n    less static. Svelte's role as both a compiler and a framework is pretty\n    compelling to me and so I'm looking forward to using this platform as a\n    playground for arbitrary content."},m(t,n){$(t,e,n)},d(t){t&&f(e)}}}function gt(t){let e,n;return e=new J({props:{title:"v3",date:"March 14, 2021",enclosedTitle:!0,$$slots:{default:[pt]},$$scope:{ctx:t}}}),{c(){L(e.$$.fragment)},m(t,o){M(e,t,o),n=!0},p(t,[n]){const o={};1&n&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){n||(A(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){z(e,t)}}}class ht extends O{constructor(t){super(),N(this,t,null,gt,r,{})}}function yt(e){let n,o,s,r,i,c,l,a,m,h,y,v,x;return r=new ht({}),c=new lt({}),a=new tt({}),h=new mt({}),v=new $t({}),{c(){n=d("div"),o=d("h1"),o.textContent="Thoughts and experiments",s=p(),L(r.$$.fragment),i=p(),L(c.$$.fragment),l=p(),L(a.$$.fragment),m=p(),L(h.$$.fragment),y=p(),L(v.$$.fragment),g(o,"class","svelte-15dlnjf"),g(n,"class","svelte-15dlnjf")},m(t,e){$(t,n,e),u(n,o),u(n,s),M(r,n,null),u(n,i),M(c,n,null),u(n,l),M(a,n,null),u(n,m),M(h,n,null),u(n,y),M(v,n,null),x=!0},p:t,i(t){x||(A(r.$$.fragment,t),A(c.$$.fragment,t),A(a.$$.fragment,t),A(h.$$.fragment,t),A(v.$$.fragment,t),x=!0)},o(t){H(r.$$.fragment,t),H(c.$$.fragment,t),H(a.$$.fragment,t),H(h.$$.fragment,t),H(v.$$.fragment,t),x=!1},d(t){t&&f(n),z(r),z(c),z(a),z(h),z(v)}}}class vt extends O{constructor(t){super(),N(this,t,null,yt,r,{})}}function xt(e){let n;return{c(){n=d("div"),n.innerHTML='<div>Stephen Chung</div> \n  <div><a href="https://www.github.com/imsteev" target="_blank" class="svelte-hy9q18">github</a>\n     \n    <a href="https://www.linkedin.com/in/imsteev/" target="_blank" class="svelte-hy9q18">linkedin</a></div>',g(n,"class","meta-info-container svelte-hy9q18")},m(t,e){$(t,n,e)},p:t,i:t,o:t,d(t){t&&f(n)}}}class wt extends O{constructor(t){super(),N(this,t,null,xt,r,{})}}function bt(e){let n,o,s,r,i,c;return s=new wt({}),i=new vt({}),{c(){n=d("main"),o=d("div"),L(s.$$.fragment),r=p(),L(i.$$.fragment),g(o,"class","container svelte-14bgnqi"),g(n,"class","svelte-14bgnqi")},m(t,e){$(t,n,e),u(n,o),M(s,o,null),u(o,r),M(i,o,null),c=!0},p:t,i(t){c||(A(s.$$.fragment,t),A(i.$$.fragment,t),c=!0)},o(t){H(s.$$.fragment,t),H(i.$$.fragment,t),c=!1},d(t){t&&f(n),z(s),z(i)}}}return new class extends O{constructor(t){super(),N(this,t,null,bt,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
