(this["webpackJsonpbag-of-holding"]=this["webpackJsonpbag-of-holding"]||[]).push([[0],{614:function(e,t){},616:function(e,t){},629:function(e,t){},631:function(e,t){},659:function(e,t){},661:function(e,t){},662:function(e,t){},667:function(e,t){},669:function(e,t){},688:function(e,t){},700:function(e,t){},703:function(e,t){},720:function(e,t,n){"use strict";n.r(t);var c=n(27),a=n(0),o=n.n(a),i=n(18),r=n.n(i),s=n(741),u=n(743),d=n(115),l=Object(a.createContext)(null),j=n(126),b=n(748),f=n(753),h=n(89),m=n.n(h),O=n(284),x=n.n(O).a.create({baseURL:"https://handy-haversack.herokuapp.com/api/",headers:{Authorization:"Bearer "+window.localStorage.getItem("authToken")}}),v=n(7);function p(){var e=Object(a.useState)([]),t=Object(c.a)(e,2),n=t[0],o=t[1],i=Object(a.useState)(!1),r=Object(c.a)(i,2),s=r[0],u=r[1],d=Object(a.useState)([]),l=Object(c.a)(d,2),h=l[0],O=l[1];Object(a.useEffect)((function(){x.get("/characters/").then((function(e){o(e.data.characters)})).catch((function(e){O(["Cannot load character data"]),u(!0)}))}),[]);return Object(v.jsx)("div",{className:"App",children:Object(v.jsxs)(b.a,{container:!0,spacing:1,children:[Object(v.jsx)(b.a,{item:!0,xs:2}),Object(v.jsxs)(b.a,{item:!0,xs:12,sm:8,children:[Object(v.jsx)("div",{children:s&&Object(v.jsx)(f.a,{severity:"error",children:h.map((function(e,t){return Object(v.jsx)("div",{children:e},t)}))})}),Object(v.jsx)(m.a,{title:"Your Characters",columns:[{title:"id",field:"id",hidden:!0},{title:"Character name",field:"name"}],data:n,editable:{onRowAdd:function(e){return new Promise((function(t){!function(e,t){if(void 0===e.name)return O(["Please enter character name"]),void u(!0);x.post("/characters/",e).then((function(e){o(n.concat(e.data.character)),u(!1)})).catch((function(e){O(["Cannot add data. Server error!"+e]),u(!0)}))}(e),t()}))},onRowDelete:function(e){return new Promise((function(t){!function(e,t){x.delete("/characters/"+e.id).then((function(t){var c=Object(j.a)(n),a=e.tableData.id;c.splice(a,1),o(Object(j.a)(c)),O([])})).catch((function(e){O(["Delete failed! Server error"]),u(!0)}))}(e),t()}))}},options:{actionsColumnIndex:-1,paging:!1,search:!1}})]}),Object(v.jsx)(b.a,{item:!0,xs:3})]})})}var g=n(742),y=n(372),C=n(215),w=n(359),I=n(482),S=n.n(I),k=n(360),D=n(294),P=n(610);var T=function(){var e=Object(a.useContext)(l).setLoggedIn;Object(a.useEffect)((function(){var t=!0,n=localStorage.getItem("authToken");if(null===n)return t&&e(!1),function(){return t=!1};var c=P.decode(n,{complete:!0}),a=new Date;return c.exp<a.getTime()&&t&&e(!0),function(){return t=!1}}),[e]),S()(x,(function(e){return x.get("/refresh").then((function(t){return localStorage.setItem("authToken",t.data.token),x.defaults.headers.Authorization="Bearer "+t.data.token,e.response.config.headers.Authorization="Bearer "+t.data.token,Promise.resolve()}))}));var t=function(e){console.log(e)},n=function(t){x.post("/login",{token:t.tokenObj.id_token}).then((function(t){window.localStorage.setItem("authToken",t.data.token),x.defaults.headers.Authorization="Bearer "+t.data.token,e(!0)})).catch((function(e){console.log("Authentication failed")}))},c=function(t){window.localStorage.removeItem("authToken"),e(!1)};return Object(v.jsx)(l.Consumer,{children:function(e){var a=e.loggedIn;return Object(v.jsx)("div",{children:a?Object(v.jsx)(D.GoogleLogout,{clientId:"1090301103642-op1uhu99i3naegpk86siaqqf4nddn0c1.apps.googleusercontent.com",buttonText:"Logout",onLogoutSuccess:c,onFailure:t,render:function(e){return Object(v.jsx)(k.a,{variant:"contained",onClick:e.onClick,disabled:e.disabled,children:"Logout"})},theme:"dark"}):Object(v.jsx)(D.GoogleLogin,{clientId:"1090301103642-op1uhu99i3naegpk86siaqqf4nddn0c1.apps.googleusercontent.com",buttonText:"Login",onSuccess:n,onFailure:t,cookiePolicy:"single_host_origin",isSignedIn:!0,theme:"dark"})})}})},_=Object(w.a)((function(e){return{root:{flexGrow:1},title:{flexGrow:1}}}));function N(){var e=_();return Object(v.jsx)("div",{className:e.root,children:Object(v.jsx)(g.a,{position:"static",children:Object(v.jsxs)(y.a,{children:[Object(v.jsx)(C.a,{variant:"h6",className:e.title,children:"Handy Haversack"}),Object(v.jsx)(T,{})]})})})}var L=n(458),B=n(82),A=n(374),E=n(754),R=Object(w.a)((function(e){return{mergecard:{flexDirection:"column",height:"100%"},costText:{paddingTop:"10px"}}}));function z(e){var t=R(),n=e.costTotal,o=e.onChange,i=Object(a.useState)([]),r=Object(c.a)(i,2),s=r[0],u=r[1],d=Object(a.useState)({}),l=Object(c.a)(d,2),j=l[0],b=l[1];return Object(a.useEffect)((function(){o(j)}),[j,o]),Object(a.useEffect)((function(){x.get("/characters/").then((function(e){u(e.data.characters),e.data.characters.length>0&&b(e.data.characters[0])})).catch((function(e){console.log("Cannot load character names")}))}),[]),Object(v.jsxs)("div",{className:t.mergecard,children:[Object(v.jsx)(E.a,{id:"character-selection",value:j,options:s,getOptionLabel:function(e){return e.name},onChange:function(e,t){b(t)},renderInput:function(e){return Object(v.jsx)(A.a,Object(B.a)(Object(B.a)({},e),{},{label:"Character",variant:"outlined"}))}}),Object(v.jsxs)(C.a,{variant:"h6",className:t.costText,children:["Inventory Cost: ",n," gp"]})]})}function F(e){var t=e.consumed,n=e.removeItem,c=e.columns;return Object(v.jsx)(m.a,{title:"Consumed Items",columns:c,data:t,actions:[{icon:"restore",tooltip:"Undo consume",onClick:function(e,t){return new Promise((function(e){!function(e,t){n(e,t)}(t,!0),e()}))}}],options:{actionsColumnIndex:-1,paging:!1,rowStyle:function(e,t){if(t%2)return{backgroundColor:"#333333"}},search:!1}})}var q=Object(w.a)((function(e){return{outerCard:{flexDirection:"column",height:"100%"},itemDropdown:{paddingBottom:"10px"}}}));function G(e){var t=q(),n=Object(a.useState)([]),o=Object(c.a)(n,2),i=o[0],r=o[1],s=Object(a.useState)({}),u=Object(c.a)(s,2),d=u[0],l=u[1];return Object(a.useEffect)((function(){x.get("/names/").then((function(e){r(e.data.items)})).catch((function(e){console.log("Cannot load item names")}))}),[]),Object(v.jsxs)("div",{className:t.outerCard,children:[Object(v.jsx)(E.a,{className:t.itemDropdown,options:i,getOptionLabel:function(e){return e.Name},onChange:function(e,t){l(t)},renderInput:function(e){return Object(v.jsx)(A.a,Object(B.a)(Object(B.a)({},e),{},{label:"Item to buy",variant:"outlined"}))}}),Object(v.jsx)(k.a,{variant:"contained",onClick:function(){e.buyItem(d)},children:"Buy Item"})]})}var U=n(20);function V(e){var t=e.owned,n=e.removeItem,c=e.columns,a=Object(U.a)(),o=function(e,t){n(e,t)};return Object(v.jsx)(m.a,{title:"Owned Items",columns:c,data:t,editable:{onRowDelete:function(e){return new Promise((function(t){o(e,!1),t()}))}},actions:[{icon:"emoji_food_beverage",tooltip:"Consume",onClick:function(e,t){return new Promise((function(e){o(t,!0),e()}))}}],options:{actionsColumnIndex:-1,paging:!1,rowStyle:function(e,t){if((t+1)%2)return{backgroundColor:a.palette.action.hover}},search:!1}})}var H=n(729);function J(){var e=Object(a.useState)([]),t=Object(c.a)(e,2),n=t[0],o=t[1],i=Object(a.useState)([]),r=Object(c.a)(i,2),s=r[0],u=r[1],d=Object(a.useState)({}),l=Object(c.a)(d,2),j=l[0],h=l[1],m=Object(a.useState)(0),O=Object(c.a)(m,2),p=O[0],g=O[1],y=Object(a.useState)(!1),C=Object(c.a)(y,2),w=C[0],I=C[1],S=Object(a.useState)([]),k=Object(c.a)(S,2),D=k[0],P=k[1],T=function(){return console.log("Character: ",j),null!==j&&(j.constructor!==Object||0!==Object.keys(j).length)||(P(["Please select a character. If you have no characters, add one in the Characters tab"]),I(!0),!1)};Object(a.useEffect)((function(){var e=!0;if(!e||T())return x.get("/inventory/"+j.id).then((function(t){e&&(o(t.data.owned),u(t.data.consumed),g(t.data.cost),I(!1))})).catch((function(t){e&&(P(["Cannot load inventory data"]),I(!0))})),function(){return e=!1}}),[j]);var _=Object(U.a)(),N=[{title:"id",field:"id",hidden:!0},{title:"user_id",field:"user_id",hidden:!0},{title:"item_id",field:"user_id",hidden:!0},{title:"Name",field:"Item.name"},{title:"Rarity",field:"Item.rarity",hidden:Object(H.a)(_.breakpoints.down("xs"))},{title:"Cost",field:"Item.cost",type:"numeric",cellStyle:{padding:1},headerStyle:{padding:1}},{title:"Qty",field:"count",type:"numeric"}];return Object(v.jsx)("div",{className:"App",children:Object(v.jsxs)(b.a,{container:!0,spacing:1,children:[Object(v.jsx)(L.a,{smDown:!0,children:Object(v.jsx)(b.a,{item:!0,md:2})}),Object(v.jsx)(b.a,{item:!0,xs:12,sm:6,md:4,children:Object(v.jsx)(z,{onChange:h,costTotal:p})}),Object(v.jsx)(b.a,{item:!0,xs:12,sm:6,md:4,children:Object(v.jsx)(G,{buyItem:function(e){if(0===Object.keys(e).length&&e.constructor===Object)return P(["Please Select an Item"]),void I(!0);if(T()){var t={character_id:j.id,item_id:e.ID};x.post("/buy/",t).then((function(e){o(e.data.owned),u(e.data.consumed),g(e.data.cost),I(!1)})).catch((function(e){P(["Cannot Buy Item"]),I(!0)}))}}})}),Object(v.jsxs)(L.a,{smDown:!0,children:[Object(v.jsx)(b.a,{item:!0,md:1}),Object(v.jsx)(b.a,{item:!0,md:2})]}),Object(v.jsxs)(b.a,{item:!0,xs:12,md:8,children:[Object(v.jsx)("div",{children:w&&Object(v.jsx)(f.a,{severity:"error",children:D.map((function(e,t){return Object(v.jsx)("div",{children:e},t)}))})}),Object(v.jsx)(V,{owned:n,removeItem:function(e,t){var n={character_id:e.character_id,item_id:e.item_id};x.post(t?"/consume/":"/sell/",n).then((function(e){o(e.data.owned),u(e.data.consumed),g(e.data.cost),I(!1)})).catch((function(e){P(["Delete failed! Server error",e.error]),I(!0)}))},columns:N})]}),Object(v.jsxs)(L.a,{smDown:!0,children:[Object(v.jsx)(b.a,{item:!0,md:1}),Object(v.jsx)(b.a,{item:!0,md:2})]}),Object(v.jsx)(b.a,{item:!0,xs:12,md:8,children:Object(v.jsx)(F,{consumed:s,removeItem:function(e,t){var n={character_id:e.character_id,item_id:e.item_id};x.post("/unconsume/",n).then((function(e){o(e.data.owned),u(e.data.consumed),g(e.data.cost),I(!1)})).catch((function(e){P(["Delete failed! Server error",e.error]),I(!0)}))},columns:N})})]})})}function M(){var e=Object(a.useState)([]),t=Object(c.a)(e,2),n=t[0],o=t[1],i=Object(a.useState)(!1),r=Object(c.a)(i,2),s=r[0],u=r[1],d=Object(a.useState)([]),h=Object(c.a)(d,2),O=h[0],p=h[1];Object(a.useEffect)((function(){x.get("/items").then((function(e){o(e.data.items)})).catch((function(e){p(["Cannot load item data",e.error]),u(!0)}))}),[]);var g=[{title:"id",field:"id",hidden:!0},{title:"Name",field:"name",render:function(e){return Object(v.jsxs)("div",{children:[e.name," ",Object(v.jsx)("br",{}),Object(v.jsx)(C.a,{variant:"caption",display:"block",gutterBottom:!0,children:e.type})]})},validate:function(e){return""===e.name?"Type cannot be empty":""},editComponent:function(e){return Object(v.jsxs)("div",{children:[Object(v.jsx)(A.a,{label:"Name",size:"xsmall",defaultValue:e.value,placeholder:"Name",onChange:function(t){return e.onChange(t.target.value)}}),Object(v.jsx)(A.a,{label:"Type",size:"small",defaultValue:e.rowData.type,placeholder:"Type",onChange:function(t){return e.rowData.type=t.target.value}})]})}},{title:"Type",field:"type",hidden:!0},{title:"Rarity",field:"rarity"},{title:"Cost",field:"cost",type:"numeric"}];return Object(v.jsxs)(b.a,{container:!0,spacing:1,children:[Object(v.jsx)(L.a,{smDown:!0,children:Object(v.jsx)(b.a,{item:!0,md:2})}),Object(v.jsxs)(b.a,{item:!0,xs:12,md:8,children:[Object(v.jsx)("div",{children:s&&Object(v.jsx)(f.a,{severity:"error",children:O.map((function(e,t){return Object(v.jsx)("div",{children:e},t)}))})}),Object(v.jsx)(l.Consumer,{children:function(e){var t=e.loggedIn;return Object(v.jsx)(m.a,{title:"Defined Items",columns:g,data:n,editable:{onRowUpdate:t?function(e,t){return new Promise((function(c){!function(e,t,c){var a=[];void 0!==e.name&&""!==e.name||a.push("Please enter item name"),void 0!==e.type&&""!==e.type||a.push("Please enter item type"),void 0!==e.rarity&&""!==e.rarity||a.push("Please enter rarity"),(void 0===e.cost||e.cost<0||isNaN(e.cost))&&a.push("Please enter a proper cost"),console.log(e.cost),a.length<1?x.patch("/items/"+e.id,e).then((function(c){var a=Object(j.a)(n);a[t.tableData.id]=e,o(Object(j.a)(a)),u(!1),p([])})).catch((function(e){p(["Update failed! Server error"]),u(!0)})):(p(a),u(!0))}(e,t),c()}))}:null,onRowAdd:t?function(e){return new Promise((function(t){!function(e,t){var c=[];void 0===e.name&&c.push("Please enter item name"),void 0===e.type&&c.push("Please enter item type"),void 0===e.rarity&&c.push("Please enter rarity"),(void 0===e.cost||e.cost<0)&&c.push("Please enter a proper cost"),c.length<1?x.post("/items",e).then((function(e){o(n.concat(e.data.data)),u(!1)})).catch((function(e){p(["Cannot add data. Server error!"]),u(!0)})):(p(c),u(!0))}(e),t()}))}:null,onRowDelete:t?function(e){return new Promise((function(t){!function(e,t){x.delete("/items/"+e.id).then((function(t){o(n.filter((function(t){return t.id!==e.id})))})).catch((function(e){p(["Delete failed! Server error"]),u(!0)}))}(e),t()}))}:null},options:{actionsColumnIndex:-1,pageSize:10,pageSizeOptions:[10,25,50]}})}})]}),Object(v.jsx)(L.a,{smDown:!0,children:Object(v.jsx)(b.a,{item:!0,md:8})})]})}var Q=n(296),Y=n(752),K=n(750);function W(e){var t=e.value,n=e.setValue,c=function(e,t){n(t)};return Object(v.jsx)(Q.a,{square:!0,children:Object(v.jsx)(l.Consumer,{children:function(e){var n=e.loggedIn;return Object(v.jsxs)(Y.a,{value:t,onChange:c,centered:!0,children:[Object(v.jsx)(K.a,{label:"Items"}),Object(v.jsx)(K.a,{label:"Inventory",disabled:!n}),Object(v.jsx)(K.a,{label:"Characters",disabled:!n})]})}})})}var X=n(483),Z=n(248);function $(e){var t=e.children,n=e.value,c=e.index,a=Object(X.a)(e,["children","value","index"]);return Object(v.jsx)("div",Object(B.a)(Object(B.a)({},a),{},{children:n===c&&Object(v.jsx)(Z.a,{p:3,children:t})}))}var ee=Object(d.a)({palette:{type:"dark"}});function te(){var e=Object(a.useState)(0),t=Object(c.a)(e,2),n=t[0],o=t[1],i=Object(a.useContext)(l).loggedIn;return Object(a.useEffect)((function(){i||o(0)}),[i]),Object(v.jsxs)(s.a,{theme:ee,children:[Object(v.jsx)(u.a,{}),Object(v.jsx)(N,{}),Object(v.jsx)(W,{value:n,setValue:o}),Object(v.jsx)($,{value:n,index:0,children:Object(v.jsx)(M,{})}),Object(v.jsx)($,{value:n,index:1,children:Object(v.jsx)(J,{})}),Object(v.jsx)($,{value:n,index:2,children:Object(v.jsx)(p,{})})]})}ee.shadows=[];var ne=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,756)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,o=t.getLCP,i=t.getTTFB;n(e),c(e),a(e),o(e),i(e)}))},ce=function(){var e=Object(a.useState)(!1),t=Object(c.a)(e,2),n=t[0],i=t[1];return Object(v.jsx)(l.Provider,{value:{loggedIn:n,setLoggedIn:i},children:Object(v.jsx)(o.a.StrictMode,{children:Object(v.jsx)(te,{})})})};r.a.render(Object(v.jsx)(ce,{}),document.getElementById("root")),ne()}},[[720,1,2]]]);
//# sourceMappingURL=main.a00ab467.chunk.js.map