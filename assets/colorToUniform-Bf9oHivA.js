import{c as z,d as W,n as I,w as k,G as w,f as D}from"./index-DWmQFRlm.js";let O=0;class E{constructor(t){this._poolKeyHash=Object.create(null),this._texturePool={},this.textureOptions=t||{},this.enableFullScreen=!1}createTexture(t,e,o){const a=new z({...this.textureOptions,width:t,height:e,resolution:1,antialias:o,autoGarbageCollect:!0});return new W({source:a,label:`texturePool_${O++}`})}getOptimalTexture(t,e,o=1,a){let u=Math.ceil(t*o-1e-6),i=Math.ceil(e*o-1e-6);u=I(u),i=I(i);const s=(u<<17)+(i<<1)+(a?1:0);this._texturePool[s]||(this._texturePool[s]=[]);let n=this._texturePool[s].pop();return n||(n=this.createTexture(u,i,a)),n.source._resolution=o,n.source.width=u/o,n.source.height=i/o,n.source.pixelWidth=u,n.source.pixelHeight=i,n.frame.x=0,n.frame.y=0,n.frame.width=t,n.frame.height=e,n.updateUvs(),this._poolKeyHash[n.uid]=s,n}getSameSizeTexture(t,e=!1){const o=t.source;return this.getOptimalTexture(t.width,t.height,o._resolution,e)}returnTexture(t){const e=this._poolKeyHash[t.uid];this._texturePool[e].push(t)}clear(t){if(t=t!==!1,t)for(const e in this._texturePool){const o=this._texturePool[e];if(o)for(let a=0;a<o.length;a++)o[a].destroy(!0)}this._texturePool={}}}const ut=new E;function y(r,t,e){if(r)for(const o in r){const a=o.toLocaleLowerCase(),u=t[a];if(u){let i=r[o];o==="header"&&(i=i.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),e&&u.push(`//----${e}----//`),u.push(i)}else k(`${o} placement hook does not exist in shader`)}}const L=/\{\{(.*?)\}\}/g;function j(r){const t={};return(r.match(L)?.map(o=>o.replace(/[{()}]/g,""))??[]).forEach(o=>{t[o]=[]}),t}function G(r,t){let e;const o=/@in\s+([^;]+);/g;for(;(e=o.exec(r))!==null;)t.push(e[1])}function _(r,t,e=!1){const o=[];G(t,o),r.forEach(s=>{s.header&&G(s.header,o)});const a=o;e&&a.sort();const u=a.map((s,n)=>`       @location(${n}) ${s},`).join(`
`);let i=t.replace(/@in\s+[^;]+;\s*/g,"");return i=i.replace("{{in}}",`
${u}
`),i}function R(r,t){let e;const o=/@out\s+([^;]+);/g;for(;(e=o.exec(r))!==null;)t.push(e[1])}function F(r){const e=/\b(\w+)\s*:/g.exec(r);return e?e[1]:""}function K(r){const t=/@.*?\s+/g;return r.replace(t,"")}function N(r,t){const e=[];R(t,e),r.forEach(n=>{n.header&&R(n.header,e)});let o=0;const a=e.sort().map(n=>n.indexOf("builtin")>-1?n:`@location(${o++}) ${n}`).join(`,
`),u=e.sort().map(n=>`       var ${K(n)};`).join(`
`),i=`return VSOutput(
                ${e.sort().map(n=>` ${F(n)}`).join(`,
`)});`;let s=t.replace(/@out\s+[^;]+;\s*/g,"");return s=s.replace("{{struct}}",`
${a}
`),s=s.replace("{{start}}",`
${u}
`),s=s.replace("{{return}}",`
${i}
`),s}function B(r,t){let e=r;for(const o in t){const a=t[o];a.join(`
`).length?e=e.replace(`{{${o}}}`,`//-----${o} START-----//
${a.join(`
`)}
//----${o} FINISH----//`):e=e.replace(`{{${o}}}`,"")}return e}const c=Object.create(null),U=new Map;let X=0;function Y({template:r,bits:t}){const e=A(r,t);if(c[e])return c[e];const{vertex:o,fragment:a}=q(r,t);return c[e]=H(o,a,t),c[e]}function V({template:r,bits:t}){const e=A(r,t);return c[e]||(c[e]=H(r.vertex,r.fragment,t)),c[e]}function q(r,t){const e=t.map(i=>i.vertex).filter(i=>!!i),o=t.map(i=>i.fragment).filter(i=>!!i);let a=_(e,r.vertex,!0);a=N(e,a);const u=_(o,r.fragment,!0);return{vertex:a,fragment:u}}function A(r,t){return t.map(e=>(U.has(e)||U.set(e,X++),U.get(e))).sort((e,o)=>e-o).join("-")+r.vertex+r.fragment}function H(r,t,e){const o=j(r),a=j(t);return e.forEach(u=>{y(u.vertex,o,u.name),y(u.fragment,a,u.name)}),{vertex:B(r,o),fragment:B(t,a)}}const J=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,Q=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        return outColor * vColor;
      };
`,Z=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;
        
        {{start}}
        
        vColor = vec4(1.);
        
        {{main}}
        
        vUV = uv;
        
        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,tt=`
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
    }
`,et={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},ot={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function st({bits:r,name:t}){const e=Y({template:{fragment:Q,vertex:J},bits:[et,...r]});return w.from({name:t,vertex:{source:e.vertex,entryPoint:"main"},fragment:{source:e.fragment,entryPoint:"main"}})}function lt({bits:r,name:t}){return new D({name:t,...V({template:{vertex:Z,fragment:tt},bits:[ot,...r]})})}const ct={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},mt={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}},M={};function rt(r){const t=[];if(r===1)t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),t.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let e=0;for(let o=0;o<r;o++)t.push(`@group(1) @binding(${e++}) var textureSource${o+1}: texture_2d<f32>;`),t.push(`@group(1) @binding(${e++}) var textureSampler${o+1}: sampler;`)}return t.join(`
`)}function nt(r){const t=[];if(r===1)t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{t.push("switch vTextureId {");for(let e=0;e<r;e++)e===r-1?t.push("  default:{"):t.push(`  case ${e}:{`),t.push(`      outColor = textureSampleGrad(textureSource${e+1}, textureSampler${e+1}, vUV, uvDx, uvDy);`),t.push("      break;}");t.push("}")}return t.join(`
`)}function vt(r){return M[r]||(M[r]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${rt(r)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${nt(r)}
            `}}),M[r]}const T={};function at(r){const t=[];for(let e=0;e<r;e++)e>0&&t.push("else"),e<r-1&&t.push(`if(vTextureId < ${e}.5)`),t.push("{"),t.push(`	outColor = texture(uTextures[${e}], vUV);`),t.push("}");return t.join(`
`)}function ht(r){return T[r]||(T[r]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${r}];

            `,main:`

                ${at(r)}
            `}}),T[r]}const pt={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},ft={name:"round-pixels-bit",vertex:{header:`   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},$={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},dt={...$,vertex:{...$.vertex,header:$.vertex.header.replace("group(1)","group(2)")}},xt={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}};class gt{constructor(){this.vertexSize=4,this.indexSize=6,this.location=0,this.batcher=null,this.batch=null,this.roundPixels=0}get blendMode(){return this.renderable.groupBlendMode}packAttributes(t,e,o,a){const u=this.renderable,i=this.texture,s=u.groupTransform,n=s.a,m=s.b,v=s.c,h=s.d,p=s.tx,f=s.ty,d=this.bounds,x=d.maxX,g=d.minX,b=d.maxY,P=d.minY,l=i.uvs,C=u.groupColorAlpha,S=a<<16|this.roundPixels&65535;t[o+0]=n*g+v*P+p,t[o+1]=h*P+m*g+f,t[o+2]=l.x0,t[o+3]=l.y0,e[o+4]=C,e[o+5]=S,t[o+6]=n*x+v*P+p,t[o+7]=h*P+m*x+f,t[o+8]=l.x1,t[o+9]=l.y1,e[o+10]=C,e[o+11]=S,t[o+12]=n*x+v*b+p,t[o+13]=h*b+m*x+f,t[o+14]=l.x2,t[o+15]=l.y2,e[o+16]=C,e[o+17]=S,t[o+18]=n*g+v*b+p,t[o+19]=h*b+m*g+f,t[o+20]=l.x3,t[o+21]=l.y3,e[o+22]=C,e[o+23]=S}packIndex(t,e,o){t[e]=o+0,t[e+1]=o+1,t[e+2]=o+2,t[e+3]=o+0,t[e+4]=o+2,t[e+5]=o+3}reset(){this.renderable=null,this.texture=null,this.batcher=null,this.batch=null,this.bounds=null}}function bt(r,t,e){const o=(r>>24&255)/255;t[e++]=(r&255)/255*o,t[e++]=(r>>8&255)/255*o,t[e++]=(r>>16&255)/255*o,t[e++]=o}export{gt as B,ut as T,ct as a,$ as b,st as c,bt as d,lt as e,mt as f,vt as g,ht as h,ft as i,xt as j,dt as l,pt as r};
