import{Mark as t,mergeAttributes as e,findChildrenInRange as n,minMax as o,Extension as i,createStyleTag as r}from"@tiptap/core";import{Plugin as s,PluginKey as a,TextSelection as l,Selection as c}from"@tiptap/pm/state";import{DecorationSet as d,Decoration as p}from"@tiptap/pm/view";import{ReplaceStep as u,ReplaceAroundStep as h}from"@tiptap/pm/transform";const f=t.create({name:"aiMark",addOptions:()=>({HTMLAttributes:{class:"tiptap-ai-insertion"}}),parseHTML:()=>[{tag:"span",getAttrs:t=>t.classList.contains("tiptap-ai-insertion")&&null}],renderHTML({HTMLAttributes:t}){return["span",e(this.options.HTMLAttributes,t),0]},addCommands(){return{setAiMark:()=>({commands:t})=>t.setMark(this.name),toggleAiMark:()=>({commands:t})=>t.toggleMark(this.name),unsetAiMark:()=>({commands:t})=>t.unsetMark(this.name)}}}),m=(t,e,n,o)=>t.map((t=>[p.inline(t.pos,t.pos+t.node.nodeSize,{class:"tiptap-ai-prompt"}),p.node(t.pos,t.pos+t.node.nodeSize,{class:"tiptap-ai-suggestion","data-prompt":`${n}`,"data-suggestion":o})])).flat();let g;const x=()=>{null==g||g.abort()},w=async(t,e,n)=>{g=new AbortController;const o=t.extensionManager.extensions.find((t=>"ai"===t.name||"aiAdvanced"===t.name));if(!o)throw new Error("AI extension not found.");const{aiStreamResolver:i}=o.options,r=(e.length>3?e.slice(e.length-3):e).filter((t=>t.node.textContent)).map((t=>t.node.textContent)).join(" ").trim()||"",{inputLength:s,modelName:a}=n,l=r.slice(r.length-s,r.length).trim(),c=t.view.state.doc;if(!l.length)return;(async({text:n,aborter:r})=>{let s="";try{const l=await i({action:"autocomplete",text:n,textOptions:{modelName:a},extensionOptions:o.options,aborter:r});if(!l)return;const d=l.getReader(),p=new TextDecoder;let u=!1;for(;!u;){const{value:n,done:o}=await d.read(),i=p.decode(n,{stream:!0});u=o,s+=i;const r=m([e[e.length-1]],c.nodeSize,e[e.length-1].node.textContent,`${s||""}`),a=t.view.state.tr.setMeta("asyncDecorations",r);t.view.dispatch(a)}u=!0}catch(t){console.error(t),o.options.onError&&o.options.onError(t)}})({text:l,aborter:g})},v=({editor:t,options:e,pluginKey:o="AiAutocompletionPlugin"})=>new s({key:new a(o),state:{init:()=>d.empty,apply(t,e,n,o){const{doc:i,docChanged:r}=t,s=t.getMeta("asyncDecorations");return void 0===s&&!r&&n.selection.eq(o.selection)?e:(n.selection.eq(o.selection)||x(),e=e.map(t.mapping,t.doc),d.create(i,s||[]))}},props:{decorations(t){return this.getState(t)},handleKeyDown(o,i){const r=this.getState(o.state),[s,a]=o.state.tr.getMeta("asyncDecorations")||(null==r?void 0:r.find())||[],l=()=>{const t=o.state.tr.setMeta("asyncDecorations",[]);null==r||r.remove([s]),null==r||r.remove([a]),o.dispatch(t)},c=!!s;switch(i.key){case"Escape":case"Enter":c&&(x(),l());break;case e.trigger:if(i.preventDefault(),i.stopPropagation(),c)((t,e)=>{const n=e.type.attrs["data-suggestion"];t.chain().focus().insertContentAt(e.to-1,n,{updateSelection:!0}).focus().run()})(t,a),x();else{const i=0,r=t.state.selection.to,s=n(o.state.doc,{from:i,to:r},(t=>t.isTextblock)),a=s[s.length-1];r===a.pos+a.node.nodeSize-1&&w(t,s,e)}break;default:x(),l()}return!1}}}),S=async({action:t,text:e,textOptions:n,extensionOptions:o,aborter:i})=>{var r,s;const{appId:a,token:l,baseUrl:c}=o,d=null!=c?c:J;let p={method:"POST",headers:{accept:"application/json","content-type":"application/json","X-App-Id":a,Authorization:`Bearer ${l}`},body:JSON.stringify({...n,text:e,stream:!0})};i&&i instanceof AbortController&&(p={...p,signal:i.signal});const u=await fetch(`${d}/text/${t}?stream=1`,p);if(!u.ok){const t=await u.json();if((null==t?void 0:t.error)instanceof Object)throw new Error(`${null===(r=null==t?void 0:t.error)||void 0===r?void 0:r.status} ${null===(s=null==t?void 0:t.error)||void 0===s?void 0:s.message}`);throw new Error(`${null==t?void 0:t.error} ${null==t?void 0:t.message}`)}return null==u?void 0:u.body},y=({props:t,action:e,textOptions:n,extensionOptions:o,fetchDataFn:i})=>async()=>{const{editor:r}=t,{state:s}=r,a={collapseToEnd:!0,plainText:!1,...n},{selection:l,selection:{from:c,to:d}}=s,p=(null==n?void 0:n.text)||s.doc.textBetween(c,d," ");if(!p)return!1;o.onLoading&&o.onLoading();let u=c;a.append&&(u=d);try{const t=await i({action:e,text:p,textOptions:a,extensionOptions:o,defaultResolver:S}),n=await(null==t?void 0:t.getReader());let s=!1;if(!n)throw new Error("[tiptap-ai] fetchDataFn doesn’t return stream.");for(a.append||r.chain().focus().deleteRange(l).run();!s;){const{done:t,value:e}=await n.read();s=t,t&&(r.commands.focus(),r.chain().focus().unsetAiMark().run(),o.onSuccess&&o.onSuccess(),o.collapseToEnd||a.collapseToEnd||r.commands.setTextSelection({from:c,to:u}));const i=new TextDecoder("utf-8").decode(e);r.chain().focus().setAiMark().insertContentAt(u,i).run(),u+=i.length}}catch(t){return o.onError&&o.onError(t),!1}return!0},E=({dispatch:t,tr:e,oldSelection:n})=>{if(t){const i=((t,e,n)=>{const o=t.steps.length-1;if(o<e)return-1;const i=t.steps[o];if(!(i instanceof u||i instanceof h))return-1;const r=t.mapping.maps[o];let s=0;return r.forEach(((t,e,n,o)=>{0===s&&(s=o)})),c.near(t.doc.resolve(s),n)})(e,e.steps.length-1,-1);if(-1!==i){const r=((t,e,n)=>{const{doc:i}=t,r=l.atStart(i).from,s=l.atEnd(i).to,a=o(n.from,r,s),c=o(e.to,r,s);return l.create(i,a,c)})(e,i,n);return e.setSelection(r),t(e),!0}}return!1};function O(t,e,n){for(let o=0;;o++){if(o==t.childCount||o==e.childCount)return t.childCount==e.childCount?null:n;let i=t.child(o),r=e.child(o);if(i!=r){if(!i.sameMarkup(r))return n;if(i.isText&&i.text!=r.text){for(let t=0;i.text[t]==r.text[t];t++)n++;return n}if(i.content.size||r.content.size){let t=O(i.content,r.content,n+1);if(null!=t)return t}n+=i.nodeSize}else n+=i.nodeSize}}function z(t,e,n,o){for(let i=t.childCount,r=e.childCount;;){if(0==i||0==r)return i==r?null:{a:n,b:o};let s=t.child(--i),a=e.child(--r),l=s.nodeSize;if(s!=a){if(!s.sameMarkup(a))return{a:n,b:o};if(s.isText&&s.text!=a.text){let t=0,e=Math.min(s.text.length,a.text.length);for(;t<e&&s.text[s.text.length-t-1]==a.text[a.text.length-t-1];)t++,n--,o--;return{a:n,b:o}}if(s.content.size||a.content.size){let t=z(s.content,a.content,n-1,o-1);if(t)return t}n-=l,o-=l}else n-=l,o-=l}}class T{constructor(t,e){if(this.content=t,this.size=e||0,null==e)for(let e=0;e<t.length;e++)this.size+=t[e].nodeSize}nodesBetween(t,e,n,o=0,i){for(let r=0,s=0;s<e;r++){let a=this.content[r],l=s+a.nodeSize;if(l>t&&!1!==n(a,o+s,i||null,r)&&a.content.size){let i=s+1;a.nodesBetween(Math.max(0,t-i),Math.min(a.content.size,e-i),n,o+i)}s=l}}descendants(t){this.nodesBetween(0,this.size,t)}textBetween(t,e,n,o){let i="",r=!0;return this.nodesBetween(t,e,((s,a)=>{let l=s.isText?s.text.slice(Math.max(t,a)-a,e-a):s.isLeaf?o?"function"==typeof o?o(s):o:s.type.spec.leafText?s.type.spec.leafText(s):"":"";s.isBlock&&(s.isLeaf&&l||s.isTextblock)&&n&&(r?r=!1:i+=n),i+=l}),0),i}append(t){if(!t.size)return this;if(!this.size)return t;let e=this.lastChild,n=t.firstChild,o=this.content.slice(),i=0;for(e.isText&&e.sameMarkup(n)&&(o[o.length-1]=e.withText(e.text+n.text),i=1);i<t.content.length;i++)o.push(t.content[i]);return new T(o,this.size+t.size)}cut(t,e=this.size){if(0==t&&e==this.size)return this;let n=[],o=0;if(e>t)for(let i=0,r=0;r<e;i++){let s=this.content[i],a=r+s.nodeSize;a>t&&((r<t||a>e)&&(s=s.isText?s.cut(Math.max(0,t-r),Math.min(s.text.length,e-r)):s.cut(Math.max(0,t-r-1),Math.min(s.content.size,e-r-1))),n.push(s),o+=s.nodeSize),r=a}return new T(n,o)}cutByIndex(t,e){return t==e?T.empty:0==t&&e==this.content.length?this:new T(this.content.slice(t,e))}replaceChild(t,e){let n=this.content[t];if(n==e)return this;let o=this.content.slice(),i=this.size+e.nodeSize-n.nodeSize;return o[t]=e,new T(o,i)}addToStart(t){return new T([t].concat(this.content),this.size+t.nodeSize)}addToEnd(t){return new T(this.content.concat(t),this.size+t.nodeSize)}eq(t){if(this.content.length!=t.content.length)return!1;for(let e=0;e<this.content.length;e++)if(!this.content[e].eq(t.content[e]))return!1;return!0}get firstChild(){return this.content.length?this.content[0]:null}get lastChild(){return this.content.length?this.content[this.content.length-1]:null}get childCount(){return this.content.length}child(t){let e=this.content[t];if(!e)throw new RangeError("Index "+t+" out of range for "+this);return e}maybeChild(t){return this.content[t]||null}forEach(t){for(let e=0,n=0;e<this.content.length;e++){let o=this.content[e];t(o,n,e),n+=o.nodeSize}}findDiffStart(t,e=0){return O(this,t,e)}findDiffEnd(t,e=this.size,n=t.size){return z(this,t,e,n)}findIndex(t,e=-1){if(0==t)return b(0,t);if(t==this.size)return b(this.content.length,t);if(t>this.size||t<0)throw new RangeError(`Position ${t} outside of fragment (${this})`);for(let n=0,o=0;;n++){let i=o+this.child(n).nodeSize;if(i>=t)return i==t||e>0?b(n+1,i):b(n,o);o=i}}toString(){return"<"+this.toStringInner()+">"}toStringInner(){return this.content.join(", ")}toJSON(){return this.content.length?this.content.map((t=>t.toJSON())):null}static fromJSON(t,e){if(!e)return T.empty;if(!Array.isArray(e))throw new RangeError("Invalid input for Fragment.fromJSON");return new T(e.map(t.nodeFromJSON))}static fromArray(t){if(!t.length)return T.empty;let e,n=0;for(let o=0;o<t.length;o++){let i=t[o];n+=i.nodeSize,o&&i.isText&&t[o-1].sameMarkup(i)?(e||(e=t.slice(0,o)),e[e.length-1]=i.withText(e[e.length-1].text+i.text)):e&&e.push(i)}return new T(e||t,n)}static from(t){if(!t)return T.empty;if(t instanceof T)return t;if(Array.isArray(t))return this.fromArray(t);if(t.attrs)return new T([t],t.nodeSize);throw new RangeError("Can not convert "+t+" to a Fragment"+(t.nodesBetween?" (looks like multiple versions of prosemirror-model were loaded)":""))}}T.empty=new T([],0);const k={index:0,offset:0};function b(t,e){return k.index=t,k.offset=e,k}class M{constructor(t,e,n){this.content=t,this.openStart=e,this.openEnd=n}get size(){return this.content.size-this.openStart-this.openEnd}insertAt(t,e){let n=A(this.content,t+this.openStart,e);return n&&new M(n,this.openStart,this.openEnd)}removeBetween(t,e){return new M(C(this.content,t+this.openStart,e+this.openStart),this.openStart,this.openEnd)}eq(t){return this.content.eq(t.content)&&this.openStart==t.openStart&&this.openEnd==t.openEnd}toString(){return this.content+"("+this.openStart+","+this.openEnd+")"}toJSON(){if(!this.content.size)return null;let t={content:this.content.toJSON()};return this.openStart>0&&(t.openStart=this.openStart),this.openEnd>0&&(t.openEnd=this.openEnd),t}static fromJSON(t,e){if(!e)return M.empty;let n=e.openStart||0,o=e.openEnd||0;if("number"!=typeof n||"number"!=typeof o)throw new RangeError("Invalid input for Slice.fromJSON");return new M(T.fromJSON(t,e.content),n,o)}static maxOpen(t,e=!0){let n=0,o=0;for(let o=t.firstChild;o&&!o.isLeaf&&(e||!o.type.spec.isolating);o=o.firstChild)n++;for(let n=t.lastChild;n&&!n.isLeaf&&(e||!n.type.spec.isolating);n=n.lastChild)o++;return new M(t,n,o)}}function C(t,e,n){let{index:o,offset:i}=t.findIndex(e),r=t.maybeChild(o),{index:s,offset:a}=t.findIndex(n);if(i==e||r.isText){if(a!=n&&!t.child(s).isText)throw new RangeError("Removing non-flat range");return t.cut(0,e).append(t.cut(n))}if(o!=s)throw new RangeError("Removing non-flat range");return t.replaceChild(o,r.copy(C(r.content,e-i-1,n-i-1)))}function A(t,e,n,o){let{index:i,offset:r}=t.findIndex(e),s=t.maybeChild(i);if(r==e||s.isText)return o&&!o.canReplace(i,i,n)?null:t.cut(0,e).append(n).append(t.cut(e));let a=A(s.content,e-r-1,n);return a&&t.replaceChild(i,s.copy(a))}M.empty=new M(T.empty,0,0);class I{constructor(t,e){this.nodes=t,this.marks=e}serializeFragment(t,e={},n){n||(n=D(e).createDocumentFragment());let o=n,i=[];return t.forEach((t=>{if(i.length||t.marks.length){let n=0,r=0;for(;n<i.length&&r<t.marks.length;){let e=t.marks[r];if(this.marks[e.type.name]){if(!e.eq(i[n][0])||!1===e.type.spec.spanning)break;n++,r++}else r++}for(;n<i.length;)o=i.pop()[1];for(;r<t.marks.length;){let n=t.marks[r++],s=this.serializeMark(n,t.isInline,e);s&&(i.push([n,o]),o.appendChild(s.dom),o=s.contentDOM||s.dom)}}o.appendChild(this.serializeNodeInner(t,e))})),n}serializeNodeInner(t,e){let{dom:n,contentDOM:o}=I.renderSpec(D(e),this.nodes[t.type.name](t));if(o){if(t.isLeaf)throw new RangeError("Content hole not allowed in a leaf node spec");this.serializeFragment(t.content,e,o)}return n}serializeNode(t,e={}){let n=this.serializeNodeInner(t,e);for(let o=t.marks.length-1;o>=0;o--){let i=this.serializeMark(t.marks[o],t.isInline,e);i&&((i.contentDOM||i.dom).appendChild(n),n=i.dom)}return n}serializeMark(t,e,n={}){let o=this.marks[t.type.name];return o&&I.renderSpec(D(n),o(t,e))}static renderSpec(t,e,n=null){if("string"==typeof e)return{dom:t.createTextNode(e)};if(null!=e.nodeType)return{dom:e};if(e.dom&&null!=e.dom.nodeType)return e;let o,i=e[0],r=i.indexOf(" ");r>0&&(n=i.slice(0,r),i=i.slice(r+1));let s=n?t.createElementNS(n,i):t.createElement(i),a=e[1],l=1;if(a&&"object"==typeof a&&null==a.nodeType&&!Array.isArray(a)){l=2;for(let t in a)if(null!=a[t]){let e=t.indexOf(" ");e>0?s.setAttributeNS(t.slice(0,e),t.slice(e+1),a[t]):s.setAttribute(t,a[t])}}for(let i=l;i<e.length;i++){let r=e[i];if(0===r){if(i<e.length-1||i>l)throw new RangeError("Content hole must be the only child of its parent node");return{dom:s,contentDOM:s}}{let{dom:e,contentDOM:i}=I.renderSpec(t,r,n);if(s.appendChild(e),i){if(o)throw new RangeError("Multiple content holes");o=i}}}return{dom:s,contentDOM:o}}static fromSchema(t){return t.cached.domSerializer||(t.cached.domSerializer=new I(this.nodesFromSchema(t),this.marksFromSchema(t)))}static nodesFromSchema(t){let e=R(t.nodes);return e.text||(e.text=t=>t.text),e}static marksFromSchema(t){return R(t.marks)}}function R(t){let e={};for(let n in t){let o=t[n].spec.toDOM;o&&(e[n]=o)}return e}function D(t){return t.document||window.document}function N(t,e,n){const{state:o}=t,i=[];return o.doc.nodesBetween(e,n,((e,n,r)=>{if(r===o.doc){const n=I.fromSchema(t.schema).serializeNode(e),o=document.createElement("div");o.appendChild(n),i.push(o.innerHTML)}})),i.join("")}const j=async({action:t,text:e,textOptions:n,extensionOptions:o})=>{var i,r;const{appId:s,token:a,baseUrl:l}=o,c=null!=l?l:J,d=await fetch(`${c}/text/${t}`,{method:"POST",headers:{accept:"application/json","content-type":"application/json","X-App-Id":s,Authorization:`Bearer ${a}`},body:JSON.stringify({...n,text:e})}),p=await d.json();if(!d.ok){if((null==p?void 0:p.error)instanceof Object)throw new Error(`${null===(i=null==p?void 0:p.error)||void 0===i?void 0:i.status} ${null===(r=null==p?void 0:p.error)||void 0===r?void 0:r.message}`);throw new Error(`${null==p?void 0:p.error} ${null==p?void 0:p.message}`)}return null==p?void 0:p.response},$=({props:t,action:e,textOptions:n,extensionOptions:o,fetchDataFn:i})=>async()=>{const{editor:r}=t,{state:s}=r,a={collapseToEnd:!0,plainText:!1,...n},{selection:l,selection:{from:c,to:d}}=s,p=(null==n?void 0:n.text)||(a.plainText?s.doc.textBetween(c,d," "):N(r,c,d));if(!p)return!1;o.onLoading&&o.onLoading();let u=c;a.append&&(u=d);try{const t=await i({action:e,text:p,textOptions:n,extensionOptions:o,defaultResolver:j});return a.append||r.chain().focus().deleteRange(l).run(),r.chain().focus().insertContentAt(u,t).command((({dispatch:t,tr:e})=>!(!o.collapseToEnd&&!a.collapseToEnd)||E({dispatch:t,tr:e,oldSelection:l}))).run(),o.onSuccess&&o.onSuccess(),!0}catch(t){return o.onError&&o.onError(t),!1}},L=(t,e,n)=>{const{editor:o}=t,{stream:i=!1}=n,r=o.extensionManager.extensions.find((t=>"ai"===t.name||"aiAdvanced"===t.name));if(!r)return!1;const{baseUrl:s}=r.options;return(()=>{if(!window)return!0;const{location:t}=window,{hostname:e}=t;return!["localhost","tiptap.dev","embed-pro.tiptap.dev","ai-demo.tiptap.dev","demos.tiptap.dev","demo-pitch.tiptap.dev"].includes(e)})()&&s===P&&console.warn("[tiptap-ai] You’re using our demo AI endpoint. This is highly discouraged in your own projects and may break things.\n\nPlease register an account at https://tiptap.dev"),i?y({props:t,action:e,textOptions:n,extensionOptions:r.options,fetchDataFn:S,defaultResolver:S})():$({props:t,action:e,textOptions:n,extensionOptions:r.options,fetchDataFn:j,defaultResolver:j})()},B=async({text:t,imageOptions:e,extensionOptions:n})=>{var o,i;const{appId:r,token:s,baseUrl:a}=n,l=null!=a?a:J,c=await fetch(`${l}/image/prompt`,{method:"POST",headers:{accept:"application/json","content-type":"application/json","X-App-Id":r,Authorization:`Bearer ${s}`},body:JSON.stringify({...e,text:t})});if(!c.ok){const t=await c.json();if((null==t?void 0:t.error)instanceof Object)throw new Error(`${null===(o=null==t?void 0:t.error)||void 0===o?void 0:o.status} ${null===(i=null==t?void 0:t.error)||void 0===i?void 0:i.message}`);throw new Error(`${null==t?void 0:t.error} ${null==t?void 0:t.message}`)}const d=await c.json();return null==d?void 0:d.response},F=({props:t,imageOptions:e,extensionOptions:n,fetchDataFn:o})=>async()=>{var i;const{editor:r}=t,{state:s}=r,{selection:{from:a,to:l}}=s,c=null!==(i=null==e?void 0:e.text)&&void 0!==i?i:s.doc.textBetween(a,l," ");n.onLoading&&n.onLoading();try{const t=await o({text:c,imageOptions:e,extensionOptions:n});return r.chain().focus().setImage({src:t,alt:c,title:c}).run(),n.onSuccess&&n.onSuccess(),!0}catch(t){return n.onError&&n.onError(t),!1}},J="https://api.tiptap.dev/v1/ai",P="https://api-demo.tiptap.dev/v1/ai",U=i.create({name:"ai",addOptions:()=>({appId:"YOUR_APP_ID",token:"YOUR_TOKEN_HERE",baseUrl:J,autocompletion:!1,autocompletionOptions:{inputLength:4e3,trigger:"Tab"},append:!1,collapseToEnd:!0,aiStreamResolver:S,aiCompletionResolver:j,aiImageResolver:B,onLoading:()=>null,onSuccess:()=>null,onError:()=>null}),addExtensions:()=>[f.configure()],addProseMirrorPlugins(){var t,e,n;const o=[];return this.editor.options.injectCSS&&r("\n.tiptap-ai-suggestion {\n  cursor: pointer;\n  pointer-events: none;\n}\n\n.tiptap-ai-suggestion::after {\n  color: #6B7280;\n  content: attr(data-suggestion);\n  pointer-events: none;\n}\n\n.tiptap-ai-suggestion br:first-child,\n.tiptap-ai-suggestion br:last-child {\n  content: ' ';\n  display: inline;\n}\n",this.editor.options.injectNonce,"ai"),this.options.autocompletion&&o.push(v({editor:this.editor,options:{appId:this.options.appId,token:this.options.token,baseUrl:this.options.baseUrl||J,inputLength:(null===(t=this.options.autocompletionOptions)||void 0===t?void 0:t.inputLength)||4e3,modelName:null===(e=this.options.autocompletionOptions)||void 0===e?void 0:e.modelName,trigger:(null===(n=this.options.autocompletionOptions)||void 0===n?void 0:n.trigger)||"Tab"}})),o},addCommands:()=>({aiAdjustTone:(t,e={})=>n=>L(n,"adjust-tone",{...e,tone:t}),aiComplete:(t={append:!0})=>e=>L(e,"complete",t),aiDeEmojify:(t={})=>e=>L(e,"de-emojify",t),aiExtend:(t={})=>e=>L(e,"extend",t),aiEmojify:(t={})=>e=>L(e,"emojify",t),aiFixSpellingAndGrammar:(t={})=>e=>L(e,"fix-spelling-and-grammar",t),aiRephrase:(t={})=>e=>L(e,"rephrase",t),aiShorten:(t={})=>e=>L(e,"shorten",t),aiSimplify:(t={})=>e=>L(e,"simplify",t),aiSummarize:(t={})=>e=>L(e,"summarize",t),aiTextPrompt:(t={})=>e=>L(e,"prompt",t),aiTldr:(t={})=>e=>L(e,"tldr",t),aiTranslate:(t,e={})=>n=>L(n,"translate",{...e,language:t}),aiImagePrompt:(t={})=>e=>((t,e)=>{var n;const{editor:o,state:i}=t,r=o.extensionManager.extensions.find((t=>"ai"===t.name||"aiAdvanced"===t.name)),{selection:{from:s,to:a}}=i,l=null!==(n=null==e?void 0:e.text)&&void 0!==n?n:i.doc.textBetween(s,a," "),c=o.extensionManager.extensions.find((t=>"image"===t.name));if(!l||!r)return!1;if(!c)throw new Error("[tiptap-ai] Image extension is not loaded.");return F({props:t,text:l,imageOptions:e,extensionOptions:r.options,fetchDataFn:r.options.aiImageResolver})()})(e,t)})});export{J as AI_DEFAULT_BASE_URL,P as AI_DEMO_BASE_URL,U as Ai,$ as aiCompletionCommand,F as aiImageCommand,y as aiStreamCommand,U as default,N as getHTMLContentBetween,j as resolveAiCompletion,B as resolveAiImage,S as resolveAiStream};
