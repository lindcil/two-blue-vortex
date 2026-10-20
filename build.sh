#!/bin/bash
cd /workspace/two-blue-vortex && { cat src/00_head.html; for f in src/[1-8]*.js; do cat "$f"; echo; done; cat src/99_tail.html; } > index.html && node -e "const s=require('fs').readFileSync('index.html','utf8');const m=s.split('<script>')[1].split('</script>')[0];new Function(m);console.log('built',s.length)"
