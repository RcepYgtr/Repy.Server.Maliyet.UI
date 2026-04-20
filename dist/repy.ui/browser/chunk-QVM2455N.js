import{A as f,a as c,b as p,g as d}from"./chunk-CRUMIL3I.js";var h=class i{_loadingStates=new Map([["default",new d(!1)],["page",new d(!1)],["refresh",new d(!1)],["upload",new d(!1)]]);_infoModal=new d({show:!1,title:"",message:"",type:"success"});getLoading$(a="default"){return this._loadingStates.get(a).asObservable()}setLoading(a,e){let n=this._loadingStates.get(a);n&&n.next(e)}loading$=this._loadingStates.get("default").asObservable();infoModal$=this._infoModal.asObservable();showSuccess(a){this._infoModal.next({show:!0,title:"Ba\u015Far\u0131l\u0131",message:a,type:"success"})}showError(a){this._infoModal.next({show:!0,title:"Hata",message:a,type:"error"})}closeModal(){this._infoModal.next(p(c({},this._infoModal.value),{show:!1}))}static \u0275fac=function(e){return new(e||i)};static \u0275prov=f({token:i,factory:i.\u0275fac,providedIn:"root"})};var u=class i{assignIconsAndInit(a=[],e,n=0){return a.map(t=>{let o=t.children?.length>0,s=t.children?this.assignIconsAndInit(t.children,e,n+1):[];return p(c({},t),{id:t.id,uniqueId:this.generateUUID(),children:s,isExpanded:e,level:n,icon:o?"assets/icons/folder.svg":"assets/icons/dwg.svg"})})}flattenHierarchy(a=[],e=0){let n=[];for(let t of a)if(n.push(p(c({},t),{level:e})),t.isExpanded&&t.children?.length>0){let o=this.flattenHierarchy(t.children,e+1);n.push(...o)}return n}findNodeById(a,e){for(let n of a){if(n.uniqueId===e)return n;if(n.children){let t=this.findNodeById(n.children,e);if(t)return t}}return null}collectChildren(a){let e=[],n=t=>{if(t.children)for(let o of t.children)e.push(o.uniqueId),n(o)};return n(a),e}toggleExpand(a,e,n,t){let o=this.findNodeById(a,n);if(!o)return e;if(o.isExpanded=!o.isExpanded,o.isExpanded){let s=this.flattenHierarchy(o.children,(o.level??0)+1),l=e.findIndex(r=>r.uniqueId===n);e.splice(l+1,0,...s),t.applyTransaction({add:s,addIndex:l+1})}else{let s=this.collectChildren(o),l=e.filter(r=>s.includes(r.uniqueId));e.splice(0,e.length,...e.filter(r=>!s.includes(r.uniqueId))),t.applyTransaction({remove:l})}return e}treeCellRenderer(a){let e=a.data,n=e.level??0,t=e.children?.length>0,o=t?e.isExpanded?"\u{1F4C2}":"\u{1F4C1}":"\u{1F4C4}",s="";for(let x=0;x<n;x++)s+=`
        <span style="
          position: absolute;
          left: ${x*20+6}px;
          top: 0;
          bottom: 0;
          border-left: 1px dashed #999;
          pointer-events: none; "></span>`;let l=e.isExpanded&&t||!e.isExpanded&&t?"tree-text-hover":"",r=n>0?`<span style="
          position: absolute;
          left: ${n*20-14}px;
          top: 50%;
          width: 14px;
          border-top: 1px dashed #999;
          transform: translateY(-50%);
          pointer-events: none;"></span>`:"";return`
    <div   data-haschildren="${t}" style="
      position: relative;
      white-space: pre;
      cursor: pointer;
      display: flex;
      align-items: center;
      line-height: 18px;
      font-family: monospace;
      height: 22px;
      onclick="event.stopPropagation(); window.angularComponentRef.toggleExpand('${e.uniqueId}')"
    " >




      ${s}
      ${r}
      <span  style="display: inline-flex; align-items: center; margin-left: ${n*20}px;">
        <span>${o}</span>
        <span style="margin-left: 5px; " class="tree-text ${l}">${e.code} ${e.name}</span>
      </span>
    </div>
  `}generateUUID(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,a=>{let e=Math.random()*16|0;return(a==="x"?e:e&3|8).toString(16)})}static \u0275fac=function(e){return new(e||i)};static \u0275prov=f({token:i,factory:i.\u0275fac,providedIn:"root"})};export{h as a,u as b};
