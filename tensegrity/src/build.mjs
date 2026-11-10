import fs from 'fs'; import {buildSync} from 'esbuild';
// usage: node build.mjs <src.js> <head.html from live page> <out.html>
const [src,live,out]=process.argv.slice(2);
const r=buildSync({entryPoints:[src],bundle:true,minify:true,format:'iife',write:false,legalComments:'none',target:'es2020'});
const js=new TextDecoder().decode(r.outputFiles[0].contents);
const html=fs.readFileSync(live,'utf8'); const a=html.indexOf('<script type="module">'); const b=html.indexOf('</script>',a);
fs.writeFileSync(out, html.slice(0,a)+'<script type="module">'+js.replace(/<\/script/g,'<\\/script')+html.slice(b));
console.log(out, fs.statSync(out).size);
