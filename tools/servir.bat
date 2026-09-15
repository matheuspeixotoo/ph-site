@echo off
rem Sobe um servidor local e abre o site no navegador.
rem Necessario para testar no computador: aberto direto do arquivo (file://),
rem o navegador bloqueia a leitura da planilha do Google.
cd /d "%~dp0.."
start "" http://localhost:8000
python -m http.server 8000
