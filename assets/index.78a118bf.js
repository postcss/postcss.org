const c=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}};c();const d="https://api.github.com/repos/postcss/postcss/contributors?per_page=200",u=window.devicePixelRatio>1?96:48;function s(){window.removeEventListener("scroll",s),fetch(d).then(i=>i.json()).then(i=>{let o=document.createDocumentFragment();for(let r of i){let n=document.createElement("li"),e=document.createElement("img");e.src=r.avatar_url+"&size="+u,e.alt=r.login,e.title=r.login,e.className="community_avatar",e.loading="lazy",n.appendChild(e),o.appendChild(n)}document.querySelector(".community_contributors").appendChild(o)})}window.addEventListener("scroll",s);
