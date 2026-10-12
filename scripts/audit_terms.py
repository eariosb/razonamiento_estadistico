"""Audita siglas del glosario usadas como texto plano (sin <Term>)
en los modulos MDX. Excluye bloques de codigo, math $...$, atributos
JSX entre comillas y lo ya envuelto en <Term k="X">.
Uso: python scripts/audit_terms.py"""
import re, pathlib, sys
sys.stdout.reconfigure(encoding='utf-8')

SIGLAS = ['LNP', 'VPP', 'VPN', 'TCL', 'LGN', 'MAD', 'ROC', 'AUC',
          'IC', 'EE', 'S1', 'S2', 'H0']
# Orden importa: las mas largas primero para evitar sub-matches
SIGLAS.sort(key=len, reverse=True)
PAT = re.compile(r'\b(' + '|'.join(SIGLAS) + r')\b')

for f in sorted(pathlib.Path('src/content/modules').glob('*.mdx')):
    lines = f.read_text(encoding='utf-8').split('\n')
    out = []
    in_code = False          # dentro de code={`...`}
    for ln, line in enumerate(lines, 1):
        # toggle de template literals de codigo: code={` ... `}
        if '={`' in line or "code={`" in line:
            in_code = not in_code if line.count('`') % 2 else in_code
            # heuristica simple: si abre y cierra en la misma linea, skip
        if in_code:
            if '`}' in line:
                in_code = False
            continue
        # quitar math inline $...$ y display $$...$$
        s = re.sub(r'\$[^$]*\$', '', line)
        # quitar lo ya envuelto en Term
        s = re.sub(r'<Term k="[^"]+">.*?</Term>', '', s)
        s = re.sub(r'<Term k="[^"]+"/>', '', s)
        # quitar atributos JSX entre comillas (title="...", etc.)
        s = re.sub(r'\w+="[^"]*"', '', s)
        for m in PAT.finditer(s):
            out.append((ln, m.group(1), line.strip()[:90]))
    if out:
        print(f'\n=== {f.name} ===')
        for ln, sig, ctx in out:
            print(f'  L{ln:3} {sig:5} | {ctx}')
