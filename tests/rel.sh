#!/bin/bash
# usage: rel.sh NEWVER "commit msg" "notes markdown"
set -e; cd /workspace/two-blue-vortex; bash build.sh >/dev/null
# garde-fou : aucune chaîne non traduite (MISS/CMISS) sinon échec
M=$(cd /tmp/pw && node play10.js 2>&1 | grep -E '^C?MISS'); echo "$M"; if ! echo "$M" | grep -q '^MISS \[\]' || ! echo "$M" | grep -q '^CMISS \[\]'; then echo 'RELEASE ABORTED: missing translations'; exit 3; fi
 cp /tmp/pw/*.js tests/ 2>/dev/null || true
OLD=$(grep -o "VERSION = '[0-9.]*'" src/10_core.js | cut -d"'" -f2); sed -i "s/VERSION = '$OLD'/VERSION = '$1'/" src/10_core.js
printf '## v%s — %s\n%s\n\n' "$1" "$2" "$3" | cat - PATCH_NOTES.md > /tmp/pn && mv /tmp/pn PATCH_NOTES.md; bash build.sh >/dev/null
pushr() { for i in 1 2 3 4 5; do git -c credential.helper= -c credential.helper='!/usr/local/bin/gh auth git-credential' push -q && return 0; echo "push failed, retry $i"; sleep 10; git pull -q --rebase || true; done; echo 'RELEASE ABORTED: push failed'; return 1; }
G='git -c user.name=lindcil -c user.email=lindcil@users.noreply.github.com'; P="git -c credential.helper= -c credential.helper=!/usr/local/bin/gh auth git-credential"
git add -A; $G commit -qm "v$1 $2"; git pull -q --rebase; pushr; echo game $(git rev-parse --short HEAD)
cd /workspace/hub; git pull -q --rebase; sed -i '/two-blue-vortex/,/<span class="ver">/ s/<span class="ver">[^<]*/<span class="ver">v'$1'/' index.html; $G commit -qam "TBV v$1"; pushr; echo hub $(git rev-parse --short HEAD)

# vérification en ligne (Pages peut prendre ~1-2 min)
for i in $(seq 1 12); do sleep 15; V=$(curl -s "https://lindcil.github.io/two-blue-vortex/?$RANDOM" | grep -o "VERSION = '[0-9.]*'" | head -1 | cut -d"'" -f2); H=$(curl -s "https://lindcil.github.io/?$RANDOM" | grep -o 'class="ver">v[0-9.]*' | head -1); if [ "$V" = "$1" ] && [ "$H" = "class=\"ver\">v$1" ]; then echo "LIVE OK game $V hub ${H#*>}"; exit 0; fi; done; echo "LIVE CHECK FAILED (game $V, hub $H)"; exit 4
