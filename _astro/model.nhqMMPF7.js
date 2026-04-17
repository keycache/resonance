const ge=(function(){const t=typeof document<"u"&&document.createElement("link").relList;return t&&t.supports&&t.supports("modulepreload")?"modulepreload":"preload"})(),he=function(e){return"/resonance/"+e},Q={},ye=function(t,o,n){let s=Promise.resolve();if(o&&o.length>0){let d=function(c){return Promise.all(c.map(f=>Promise.resolve(f).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=r?.nonce||r?.getAttribute("nonce");s=d(o.map(c=>{if(c=he(c),c in Q)return;Q[c]=!0;const f=c.endsWith(".css"),h=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":ge,f||(m.as="script"),m.crossOrigin="",m.href=c,l&&m.setAttribute("nonce",l),document.head.appendChild(m),f)return new Promise((w,v)=>{m.addEventListener("load",w),m.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return s.then(r=>{for(const l of r||[])l.status==="rejected"&&a(l.reason);return t().catch(a)})},E="onnx-community/gemma-4-E2B-it-ONNX",V="Gemma 4 E2B ONNX",P=1.3*1024*1024*1024,y="q4f16",M="q4",we=`https://huggingface.co/api/models/${E}`,be=`https://huggingface.co/${E}/resolve/main`,ke="/__resonance_local_models__/",Me="resonance-model-cache",J="manifest.json",Ee="resonance-model-db",ve=1,S="handles",z="model-directory",Z="resonance:runtime-preference";let B=null,_=null,L=null;function p(e,t){document.dispatchEvent(new CustomEvent(e,t?{detail:t}:void 0))}function T(e){p("model:local-load-progress",e)}function ee(e){return e instanceof Error?e.message:String(e)}function Re(e){const t=String(e),o=t.toLowerCase();return o.includes("unknown error occurred in memory copy")||o.includes("failed to load external data file")||o.includes("out of memory")?"Could not load model: this browser ran out of memory while creating the local ONNX session. Try closing other heavy tabs/apps, then retry. If it still fails, use Chrome/Edge with WebGPU or use the Download model path instead of local folder upload.":o.includes("gatherblockquantized")?"Could not load model: this browser/runtime does not support a required quantized operator for the selected local files. Try Chrome/Edge WebGPU or use an alternate model variant.":t}function j(e){return e instanceof DOMException&&e.name==="NotFoundError"}function q(){return typeof window<"u"}function Ue(){if(!q())return"auto";const e=window.localStorage.getItem(Z);return e==="webgpu"||e==="wasm"?e:"auto"}function Ye(e){if(!q())return;const t=e==="webgpu"||e==="wasm"?e:"auto";window.localStorage.setItem(Z,t)}function N(){return ye(async()=>{const{openDB:e}=await import("./index.G0WFODFu.js");return{openDB:e}},[]).then(({openDB:e})=>e(Ee,ve,{upgrade(t){t.objectStoreNames.contains(S)||t.createObjectStore(S)}}))}async function O(e=!1){const t=navigator.storage;if(typeof t?.getDirectory!="function")return null;const o=await t.getDirectory();try{return await o.getDirectoryHandle(Me,{create:e})}catch(n){if(!e&&j(n))return null;throw n}}async function H(e,t,o=!1){let n=e;for(const s of t)n=await n.getDirectoryHandle(s,{create:o});return n}async function _e(e,t){const o=t.split("/").filter(Boolean),n=o.pop();if(!n)throw new Error(`Invalid file path: ${t}`);return{directory:await H(e,o,!0),fileName:n}}async function te(e,t){try{const o=t.split("/").filter(Boolean),n=o.pop();return n?(await(await H(e,o,!1)).getFileHandle(n,{create:!1}),!0):!1}catch{return!1}}async function oe(e){for await(const[t,o]of e.entries()){if(o.kind==="directory"){await oe(o),await e.removeEntry(t,{recursive:!0});continue}await e.removeEntry(t)}}function Le(e){const t=e.toLowerCase();return!(t.endsWith(".md")||t.endsWith(".png")||t.endsWith(".jpg")||t.endsWith(".jpeg")||t.endsWith(".webp")||t.endsWith(".gif")||t.endsWith(".svg"))}function I(e){return e==="chat_template.jinja"||e==="config.json"||e==="generation_config.json"||e==="preprocessor_config.json"||e==="processor_config.json"||e==="tokenizer.json"||e==="tokenizer_config.json"}function Be(e){return e.startsWith(`${E}/`)?e.slice(E.length+1):e}function ne(e){const t=e.replace(/^\.\//,""),o=t.split("/").filter(Boolean);function n(r){if(r.length===0)return!1;const l=r.join("/");return l.startsWith("onnx/")||I(l)||r.length===1&&/\.(onnx|onnx_data)$/i.test(l)}let s=[...o];for(;s.length>0&&!n(s);)s=s.slice(1);const a=s.length>0?s.join("/"):t;return a.startsWith("onnx/")||I(a)?a:!a.includes("/")&&/\.(onnx|onnx_data)$/i.test(a)?`onnx/${a}`:a}function re(e,t){const o=Be(e);return o.startsWith("onnx/")&&o.includes(`_${t}.`)}function X(e,t){return e.some(o=>re(o,t))}function Fe(e){return Le(e)?I(e)||re(e,y):!1}function Pe(e,t){console.groupCollapsed(`[Resonance:model] Remote file selection for ${E} (dtype=${y})`),console.info("[Resonance:model] Selected files:",e),console.info("[Resonance:model] Skipped files:",t),console.groupEnd()}async function Se(){const e=await fetch(we);if(!e.ok)throw new Error(`Failed to inspect ${V}: ${e.status} ${e.statusText}`);const o=((await e.json()).siblings??[]).map(a=>a.rfilename??"").filter(Boolean),n=o.filter(Fe),s=o.filter(a=>!n.includes(a));if(n.length===0)throw new Error("The model repository did not return any downloadable files.");return Pe(n,s),n}async function Ae(e,t){const n=await(await e.getFileHandle(J,{create:!0})).createWritable();await n.write(JSON.stringify(t,null,2)),await n.close()}async function Oe(e){try{const o=await(await e.getFileHandle(J,{create:!1})).getFile();return JSON.parse(await o.text())}catch{return null}}function A(e){return`${E}/${e}`}async function De(e,t){const o=t.split("/").filter(Boolean),n=o.pop();if(!n)throw new Error(`Invalid stored path: ${t}`);return(await(await(await H(e,o,!1)).getFileHandle(n,{create:!1})).getFile()).arrayBuffer()}function We(){try{const e=new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,0,1,123,3,2,1,0,10,10,1,8,0,253,15,253,98,11]);return WebAssembly.validate(e)?"wasm-simd":"wasm"}catch{return"wasm"}}function xe(e){return!e||e.length===0?[]:e.map(t=>t.buffer)}function Ce(e){return!e||e.length===0?0:e.reduce((t,o)=>t+o.buffer.byteLength,0)}function $e(){const e=new Map;let t=null,o=null,n=!1,s=null,a=null,r=null;const l=String.raw`
import {
  env,
  AutoProcessor,
  Gemma4ForConditionalGeneration,
  InterruptableStoppingCriteria,
  TextStreamer,
  load_image,
} from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4/+esm';

let processor = null;
let model = null;
let localBaseUrl = '';
let localFiles = new Map();
let appOrigin = '';
let currentModelId = '';
const stoppingCriteria = new InterruptableStoppingCriteria();
const originalFetch = self.fetch.bind(self);

function getRequestUrl(input) {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.href;
  }

  if (input && typeof input === 'object') {
    if ('url' in input && typeof input.url === 'string') {
      return input.url;
    }

    if ('href' in input && typeof input.href === 'string') {
      return input.href;
    }
  }

  return String(input);
}

function toAbsoluteUrl(url) {
  const raw = String(url || '');

  if (!raw.startsWith('/')) {
    return raw;
  }

  if (!appOrigin) {
    return raw;
  }

  try {
    return new URL(raw, appOrigin).toString();
  } catch {
    return raw;
  }
}

function stripLeadingSlash(path) {
  return String(path || '').replace(/^\/+/, '');
}

function normalizeUrl(url) {
  const raw = String(url);
  const noHash = raw.split('#')[0];
  const noQuery = noHash.split('?')[0];

  if (raw.startsWith('/') || raw.startsWith('./') || raw.startsWith('../')) {
    return decodeURIComponent(noQuery);
  }

  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(raw)) {
    return decodeURIComponent(noQuery);
  }

  try {
    const resolved = new URL(raw, self.location.href);
    resolved.hash = '';
    resolved.search = '';
    return resolved.toString();
  } catch {
    return decodeURIComponent(noQuery);
  }
}

function getLocalKey(requestUrl) {
  if (!localBaseUrl) {
    return null;
  }

  const normalizedRequestUrl = normalizeUrl(requestUrl);
  const normalizedBaseUrl = normalizeUrl(localBaseUrl);
  const normalizedAbsoluteBaseUrl = normalizeUrl(toAbsoluteUrl(localBaseUrl));

  function sliceKey(baseUrl) {
    if (!baseUrl) {
      return null;
    }

    if (normalizedRequestUrl.startsWith(baseUrl)) {
      return stripLeadingSlash(decodeURIComponent(normalizedRequestUrl.slice(baseUrl.length)));
    }

    return null;
  }

  const directKey = sliceKey(normalizedBaseUrl) || sliceKey(normalizedAbsoluteBaseUrl);

  if (directKey) {
    return directKey;
  }

  // Handle relative requests like "onnx/file.onnx" against a local base URL.
  const basePathOnly = stripLeadingSlash(normalizedBaseUrl);
  const requestPathOnly = stripLeadingSlash(normalizedRequestUrl);

  if (basePathOnly && requestPathOnly.startsWith(basePathOnly)) {
    return stripLeadingSlash(requestPathOnly.slice(basePathOnly.length));
  }

  try {
    const request = new URL(toAbsoluteUrl(normalizedRequestUrl));
    const base = new URL(toAbsoluteUrl(normalizedBaseUrl));

    if (request.origin !== base.origin) {
      return null;
    }

    const basePath = base.pathname.endsWith('/') ? base.pathname : base.pathname + '/';

    if (!request.pathname.startsWith(basePath)) {
      return null;
    }

    return stripLeadingSlash(decodeURIComponent(request.pathname.slice(basePath.length)));
  } catch {
    return null;
  }
}

function normalizeRemoteRelativePath(key) {
  let relativePath = stripLeadingSlash(String(key || ''));

  if (relativePath.startsWith('__resonance_local_models__/')) {
    relativePath = relativePath.slice('__resonance_local_models__/'.length);
  }

  if (currentModelId && relativePath.startsWith(currentModelId + '/')) {
    relativePath = relativePath.slice(currentModelId.length + 1);
  }

  return relativePath;
}

function buildRemoteModelUrl(key) {
  const relativePath = normalizeRemoteRelativePath(key);

  if (!relativePath || !currentModelId) {
    return null;
  }

  return 'https://huggingface.co/' + currentModelId + '/resolve/main/' + relativePath + '?download=1';
}

function guessMimeType(path) {
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.txt')) return 'text/plain';
  return 'application/octet-stream';
}

const localAwareFetch = async (input, init) => {
  const requestUrl = getRequestUrl(input);
  const key = getLocalKey(requestUrl);

  if (key) {
    const bytes = localFiles.get(key);

    if (bytes) {
      console.info('[Resonance:model] Worker local fetch hit:', key);
      return new Response(bytes, {
        status: 200,
        headers: {
          'content-type': guessMimeType(key),
          'content-length': String(bytes.byteLength),
        },
      });
    }

    console.warn('[Resonance:model] Local fetch miss for key:', key, 'from url:', requestUrl);

    const remoteModelUrl = buildRemoteModelUrl(key);
    if (remoteModelUrl && env.allowRemoteModels) {
      console.info('[Resonance:model] Worker remapping local miss to remote:', remoteModelUrl);
      return originalFetch(remoteModelUrl, init);
    }
  }

  return originalFetch(toAbsoluteUrl(requestUrl), init);
};

self.fetch = localAwareFetch;
env.fetch = localAwareFetch;
env.useBrowserCache = false;

function setLocalFiles(entries, baseUrl, allowRemoteModels, origin) {
  localBaseUrl = baseUrl || '';
  appOrigin = typeof origin === 'string' ? origin : '';
  localFiles = new Map();

  for (const entry of entries || []) {
    localFiles.set(entry.path, new Uint8Array(entry.buffer));
  }

  env.allowLocalModels = Boolean(localBaseUrl);
  env.localModelPath = localBaseUrl || '/models/';
  env.allowRemoteModels = Boolean(allowRemoteModels ?? !localBaseUrl);

  if (localBaseUrl) {
    console.info('[Resonance:model] Worker local model path:', env.localModelPath);
  }
}

function progressCallback(progress) {
  self.postMessage({ type: 'progress', data: progress });
}

async function loadMultimodal({ modelId, dtype, device, localEntries, localModelBaseUrl, allowRemoteModels, appOrigin }) {
  currentModelId = modelId || '';
  setLocalFiles(localEntries, localModelBaseUrl, allowRemoteModels, appOrigin);
  console.info('[Resonance:model] Worker loading processor:', { modelId, device, dtype });

  processor = await AutoProcessor.from_pretrained(modelId, {
    progress_callback: progressCallback,
  });
  console.info('[Resonance:model] Worker processor ready:', processor?.constructor?.name);

  console.info('[Resonance:model] Worker loading model:', { modelId, device, dtype });
  model = await Gemma4ForConditionalGeneration.from_pretrained(modelId, {
    dtype,
    device,
    progress_callback: progressCallback,
  });
  console.info('[Resonance:model] Worker model ready:', model?.constructor?.name);

  self.postMessage({ type: 'warmup' });
  const warmupInputs = processor.tokenizer('a');
  await model.generate({ ...warmupInputs, max_new_tokens: 1 });
  self.postMessage({ type: 'ready', device });
}

function resetLoadedArtifacts() {
  try {
    if (model && typeof model.dispose === 'function') {
      model.dispose();
    }
  } catch {
    // Best effort cleanup after a failed load attempt.
  }

  model = null;
  processor = null;
}

async function decodeAudioTo16k(blob) {
  const AudioCtx = self.AudioContext || self.webkitAudioContext;

  if (!AudioCtx) {
    throw new Error('Web Audio API is unavailable in this browser.');
  }

  const arrayBuffer = await blob.arrayBuffer();
  const context = new AudioCtx({ sampleRate: 16000 });

  try {
    const decoded = await context.decodeAudioData(arrayBuffer);
    return new Float32Array(decoded.getChannelData(0));
  } finally {
    await context.close();
  }
}

async function processContentBlocks(inputMessages) {
  const attachmentsData = [];
  const chatMessages = [];

  for (const message of inputMessages) {
    if (!Array.isArray(message.content)) {
      chatMessages.push(message);
      continue;
    }

    const cleanBlocks = [];

    for (const block of message.content) {
      if (!block || typeof block !== 'object') continue;

      if (block.type === 'text') {
        cleanBlocks.push({ type: 'text', text: block.text || '' });
        continue;
      }

      if (block.type !== 'image' && block.type !== 'audio') {
        continue;
      }

      if (!block.data && !block.pcmData) {
        cleanBlocks.push({ type: block.type });
        continue;
      }

      if (block.type === 'image') {
        const blob = block.data instanceof Blob
          ? block.data
          : new Blob([block.data], { type: block.mimeType || 'image/jpeg' });

        attachmentsData.push({
          type: 'image',
          data: await blob.arrayBuffer(),
          mimeType: blob.type || 'image/jpeg',
        });
        cleanBlocks.push({ type: 'image' });
        continue;
      }

      if (block.pcmData) {
        attachmentsData.push({ type: 'audio', pcmData: block.pcmData });
      } else {
        const blob = block.data instanceof Blob ? block.data : new Blob([block.data]);
        attachmentsData.push({ type: 'audio', pcmData: await decodeAudioTo16k(blob) });
      }

      cleanBlocks.push({ type: 'audio' });
    }

    chatMessages.push({
      role: message.role,
      content: cleanBlocks,
    });
  }

  return { chatMessages, attachmentsData };
}

async function generate({ messages, id, generationConfig }) {
  stoppingCriteria.reset();

  try {
    const { chatMessages, attachmentsData } = await processContentBlocks(messages);
    const prompt = processor.apply_chat_template(chatMessages, {
      add_generation_prompt: true,
      enable_thinking: false,
    });

    const images = [];
    const audios = [];

    for (const attachment of attachmentsData) {
      if (attachment.type === 'image') {
        const blob = new Blob([attachment.data], { type: attachment.mimeType || 'image/jpeg' });
        const objectUrl = URL.createObjectURL(blob);
        const image = await load_image(objectUrl);
        URL.revokeObjectURL(objectUrl);
        images.push(image);
        continue;
      }

      audios.push(
        attachment.pcmData instanceof Float32Array
          ? attachment.pcmData
          : new Float32Array(attachment.pcmData)
      );
    }

    const imageArg = images.length === 0 ? null : images.length === 1 ? images[0] : images;
    const audioArg = audios.length === 0 ? null : audios.length === 1 ? audios[0] : audios;
    const inputs = await processor(prompt, imageArg, audioArg, { add_special_tokens: false });
    const config = generationConfig || {};
    const streamer = new TextStreamer(processor.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function(text) {
        self.postMessage({ type: 'token', id, token: text });
      },
    });

    await model.generate({
      ...inputs,
      max_new_tokens: config.max_new_tokens ?? 1024,
      do_sample: config.do_sample ?? true,
      temperature: config.temperature ?? 0.7,
      top_k: config.top_k ?? 40,
      top_p: config.top_p ?? 0.95,
      repetition_penalty: config.repetition_penalty ?? 1.1,
      streamer,
      stopping_criteria: stoppingCriteria,
    });

    self.postMessage({ type: 'complete', id });
  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      message: error instanceof Error ? error.message : String(error),
    });
    self.postMessage({ type: 'complete', id });
  }
}

self.addEventListener('message', async (event) => {
  const message = event.data || {};

  if (message.type === 'load') {
    try {
      console.info('[Resonance:model] Worker load attempt:', {
        modelId: message.modelId,
        device: message.device,
        dtype: message.dtype,
        localEntryCount: message.localEntries?.length ?? 0,
      });
      await loadMultimodal({
        modelId: message.modelId,
        dtype: message.dtype,
        device: message.device,
        localEntries: message.localEntries,
        localModelBaseUrl: message.localModelBaseUrl,
        allowRemoteModels: message.allowRemoteModels,
        appOrigin: message.appOrigin,
      });
    } catch (error) {
      console.error('[Resonance:model] Worker primary load failed:', error);
      if (message.fallbackDevice) {
        const primaryErrorMessage = error instanceof Error ? error.message : String(error);
        const isOutOfMemory = /out of memory|memory copy/i.test(primaryErrorMessage);

        if (isOutOfMemory && message.skipFallbackOnOom) {
          self.postMessage({
            type: 'error',
            message:
              'Could not load model: this browser ran out of memory while creating the local ONNX session. Try closing other heavy tabs/apps, then retry. If it still fails, use Chrome/Edge with WebGPU or use the Download model path instead of local folder upload.',
          });
          return;
        }

        resetLoadedArtifacts();

        self.postMessage({
          type: 'fallback-start',
          message: isOutOfMemory
            ? 'Loading model into memory... WebGPU ran out of memory. Retrying on WASM fallback weights.'
            : 'Loading model into memory... WebGPU load failed. Retrying on WASM fallback weights.',
        });

        try {
          console.info('[Resonance:model] Worker fallback load attempt:', {
            modelId: message.modelId,
            device: message.fallbackDevice,
            dtype: message.fallbackDtype || message.dtype,
            localEntryCount: message.localEntries?.length ?? 0,
          });
          await loadMultimodal({
            modelId: message.modelId,
            dtype: message.fallbackDtype || message.dtype,
            device: message.fallbackDevice,
            localEntries: message.localEntries,
            localModelBaseUrl: message.localModelBaseUrl,
            allowRemoteModels: message.allowRemoteModels,
            appOrigin: message.appOrigin,
          });
        } catch (fallbackError) {
          console.error('[Resonance:model] Worker fallback load failed:', fallbackError);
          resetLoadedArtifacts();
          self.postMessage({
            type: 'error',
            message:
              fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
          });
        }
      } else {
        self.postMessage({
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
    return;
  }

  if (message.type === 'generate') {
    await generate(message);
    return;
  }

  if (message.type === 'stop') {
    stoppingCriteria.interrupt();
  }
});
`;function d(){a=null,r=null,s=null}function c(){return globalThis.crypto&&typeof globalThis.crypto.randomUUID=="function"?globalThis.crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,8)}`}function f(g){const i=new Error(g.message||"Model worker crashed.");r&&r(i),d(),n=!1}function h(g){const i=g.data??{};if(i.type==="fallback-start"){p("model:checking",{message:i.message||"Loading model into memory... WebGPU failed, retrying on WASM fallback weights."});return}if(i.type!=="progress"&&i.type!=="warmup"){if(i.type==="ready"){n=!0,B=i.device==="webgpu"?"webgpu":We(),a?.(),d();return}if(i.type==="error"){const u=new Error(Re(i.message||"Model worker failed."));if(i.id&&e.has(i.id)){const b=e.get(i.id);e.delete(i.id),b?.reject(u);return}r?.(u),d(),n=!1;return}if(i.type==="token"){const u=e.get(i.id);if(!u)return;u.text+=i.token||"",u.onToken?.(i.token||"",u.text);return}if(i.type==="complete"){const u=e.get(i.id);if(!u)return;e.delete(i.id),u.resolve(u.text)}}}function m(){if(t)return t;const g=new Blob([l],{type:"application/javascript"});return o=URL.createObjectURL(g),t=new Worker(o,{type:"module"}),t.addEventListener("error",f),t.addEventListener("message",h),t}async function w(g){if(n)return;if(s)return s;const i=g?.localEntries??[],u=i.map($=>$.path),b=i.length===0||X(u,y),k=i.length===0||X(u,M),D=i.length===0||!k,W=Ue(),x=/firefox/i.test(navigator.userAgent),K=k&&!b;let U;if(W==="webgpu"){if(!navigator.gpu)throw new Error("WebGPU is not available in this browser. Select Auto or WASM runtime mode.");U="webgpu"}else W==="wasm"?U="wasm":U=x?K&&navigator.gpu?"webgpu":"wasm":navigator.gpu?"webgpu":"wasm";const Y=U==="webgpu"?"wasm":null,C=U==="webgpu"?b?y:k?M:y:k?M:b?y:M,ue=Y?C===y?k?M:y:b?y:M:null,fe=m();s=new Promise(($,pe)=>{a=$,r=pe});const me=xe(i);return i.length>0&&(console.info(`[Resonance:model] Sending ${i.length} cached files to worker via transferables (${F(Ce(i))}).`),k||console.warn(`[Resonance:model] Local model cache is missing ${M} weights. WASM fallback will fetch ${M} weights remotely if network is available.`),console.info(`[Resonance:model] Selected device=${U}, dtype=${C}, runtimePreference=${W} (has ${y}: ${b}, has ${M}: ${k})`),x&&navigator.gpu&&console.info(K?"[Resonance:model] Firefox detected with q4-only local assets. Using WebGPU because q4 ops may be unsupported on WASM.":"[Resonance:model] Firefox detected. Using WASM directly to avoid WebGPU OOM during local folder loads.")),fe.postMessage({type:"load",modelId:E,dtype:C,fallbackDtype:ue,device:U,fallbackDevice:Y,skipFallbackOnOom:x,allowRemoteModels:D,appOrigin:window.location.origin,localEntries:i,localModelBaseUrl:i.length>0?ke:""},me),s}async function v({messages:g,generationConfig:i={},onToken:u}){if(!Array.isArray(g)||g.length===0)throw new Error("messages must be a non-empty array");await w();const b=c();return new Promise((k,D)=>{e.set(b,{resolve:k,reject:D,onToken:u,text:""}),m().postMessage({type:"generate",id:b,messages:g,generationConfig:i})})}function R(){t?.postMessage({type:"stop"})}function de(){R();for(const[,g]of e)g.reject(new Error("Runner disposed."));e.clear(),t?.terminate(),t=null,n=!1,d(),o&&(URL.revokeObjectURL(o),o=null)}return{load:w,generate:v,stop:R,dispose:de,get ready(){return n}}}async function ae(e){return _||(_=$e()),await _.load({localEntries:e}),_}async function Ie(e){const t=await O(!1);if(!t)throw new Error("OPFS is not available in this browser.");const o=[];let n=0;const s=e.files.length,a=Math.max(0,e.totalBytes||0);for(let r=0;r<e.files.length;r+=1){const l=e.files[r],d=A(l),c=await De(t,d);n+=c.byteLength,o.push({path:d,buffer:c}),T({source:"opfs",loadedFiles:r+1,totalFiles:s,fileName:l,loadedBytes:n,totalBytes:a})}return o}async function ze(e){const t=[],o=[];async function n(l,d=""){for await(const[c,f]of l.entries()){const h=d?`${d}/${c}`:c;if(f.kind==="directory"){await n(f,h);continue}const m=await f.getFile(),w=ne(h);o.push({normalizedPath:w,file:m})}}await n(e);let s=0;const a=o.length,r=o.reduce((l,d)=>l+d.file.size,0);for(let l=0;l<o.length;l+=1){const d=o[l],c=await d.file.arrayBuffer();s+=c.byteLength,t.push({path:A(d.normalizedPath),buffer:c}),T({source:"folder",loadedFiles:l+1,totalFiles:a,fileName:d.normalizedPath,loadedBytes:s,totalBytes:r})}return t}async function Te(e){const t=[];let o=0;const n=e.length,s=e.reduce((a,r)=>a+r.size,0);for(let a=0;a<e.length;a+=1){const r=e[a],l=r.webkitRelativePath||r.name,d=ne(l),c=await r.arrayBuffer();o+=c.byteLength,t.push({path:A(d),buffer:c}),T({source:"folder",loadedFiles:a+1,totalFiles:n,fileName:d,loadedBytes:o,totalBytes:s})}return t}function je(){return new Promise(e=>{const t=document.createElement("input");t.type="file",t.multiple=!0,t.style.position="fixed",t.style.left="-9999px",t.style.width="1px",t.style.height="1px";const o=t;o.webkitdirectory=!0,o.directory=!0,o.mozdirectory=!0;let n=!1;const s=window.setTimeout(()=>{r(Array.from(t.files??[]))},12e4);function a(){window.clearTimeout(s),t.remove()}function r(l){n||(n=!0,a(),e(l))}t.addEventListener("change",()=>{r(Array.from(t.files??[]))},{once:!0}),t.addEventListener("cancel",()=>{r([])},{once:!0}),document.body.append(t),t.click()})}async function qe(){const e=await je();if(e.length===0)throw new DOMException("Model file selection was cancelled.","AbortError");const t=await Te(e);if(t.length===0)throw new Error("No readable model files were selected.");return G(t)}async function G(e){const t=await ae(e);return B=Ke(),p("model:ready",{backend:B??"webgpu"}),t}async function se(){const e=await O(!1);if(!e)return null;const t=await Oe(e);if(!t||t.modelId!==E)return null;for(const o of t.files)if(!await te(e,A(o)))return null;return t}async function Ne(){const e=await O(!0);if(!e)throw new Error("OPFS is not available in this browser.");const t=await Se();let o=0,n=0;console.info(`[Resonance:model] Ensuring ${t.length} files are cached for dtype=${y}`);for(let a=0;a<t.length;a+=1){const r=t[a],l=A(r);if(await te(e,l)){console.info(`[Resonance:model] Reusing cached ${r} (${a+1}/${t.length})`);continue}console.info(`[Resonance:model] Fetching ${r} (${a+1}/${t.length}) from Hugging Face`);const d=await fetch(`${be}/${r}?download=1`);if(!d.ok)throw new Error(`Failed to download ${r}: ${d.status} ${d.statusText}`);const c=Number(d.headers.get("content-length")||"0");Number.isFinite(c)&&c>0&&(o+=c),console.info(`[Resonance:model] Response for ${r}: ${c>0?F(c):"unknown size"}`);const{directory:f,fileName:h}=await _e(e,l),w=await(await f.getFileHandle(h,{create:!0})).createWritable();if(d.body){const v=d.body.getReader();for(;;){const R=await v.read();if(R.done)break;R.value&&(await w.write(R.value),n+=R.value.byteLength,p("model:download-progress",{loaded:n,total:o||P,shard:{index:a+1,total:t.length,name:r}}))}}else{const v=await d.arrayBuffer();await w.write(v),n+=v.byteLength,p("model:download-progress",{loaded:n,total:o||P,shard:{index:a+1,total:t.length,name:r}})}await w.close(),console.info(`[Resonance:model] Saved ${r}. Overall progress: ${F(n)}${o>0?` / ${F(o)}`:""}`)}const s={modelId:E,label:V,createdAt:new Date().toISOString(),totalBytes:o||P,files:t};return await Ae(e,s),console.info(`[Resonance:model] Download complete. Cached ${t.length} files (${F(s.totalBytes)}) in OPFS.`),s}function F(e){if(!Number.isFinite(e)||e<=0)return"0 B";const t=["B","KB","MB","GB"];let o=e,n=0;for(;o>=1024&&n<t.length-1;)o/=1024,n+=1;return`${o.toFixed(n===0?0:1)} ${t[n]}`}async function le(){const e=await se();if(!e)throw new Error("Model files are not available in OPFS.");const t=await Ie(e);return G(t)}async function He(e){await(await N()).put(S,e,z)}async function ie(){await(await N()).delete(S,z)}async function Ge(){const t=await(await N()).get(S,z);if(!t)return null;const o=t;return(o.queryPermission?await o.queryPermission({mode:"read"}):"prompt")!=="granted"?null:t}async function ce(e){const t=await ze(e);if(t.length===0)throw new Error("The selected folder did not contain any readable model files.");return G(t)}async function Qe(){const e=window;if(typeof e.showDirectoryPicker!="function")return qe();const t=await e.showDirectoryPicker({mode:"read"});return await He(t),ce(t)}function Ke(){return B}function Xe(){return!!(_?.ready&&B)}async function Ve(){return q()?L||(L=(async()=>{p("model:checking",{message:"Checking for model..."});try{if(await se()){p("model:checking",{message:"Loading model into memory..."}),await le();return}const t=await Ge();if(t)try{p("model:checking",{message:"Loading model into memory..."}),await ce(t);return}catch(o){if(!j(o))throw o;await ie()}p("model:needs-download",{totalBytes:P})}catch(e){throw p("model:error",{message:ee(e)}),e}finally{L=null}})(),L):null}async function Je(){p("model:checking",{message:"Preparing model download..."});try{await Ne(),p("model:checking",{message:"Loading model into memory..."}),await le()}catch(e){throw p("model:error",{message:ee(e)}),e}}async function Ze(e){return(await ae()).generate(e)}async function et(){_?.dispose(),_=null,B=null,L=null;const e=await O(!1);if(e)try{await oe(e)}catch(t){if(!j(t))throw t}await ie(),p("model:needs-download",{totalBytes:P})}export{Qe as a,Ve as b,Ke as c,Je as d,Ze as e,Ue as g,Xe as i,et as r,Ye as s};
