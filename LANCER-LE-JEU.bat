@echo off
REM ═══════════════════════════════════════════════════════════════
REM   L'ACADÉMIE DES MAGES — Lanceur du jeu
REM ═══════════════════════════════════════════════════════════════
REM   Double-clique sur ce fichier pour démarrer le jeu.
REM   Le jeu s'ouvrira automatiquement dans ton navigateur.
REM ═══════════════════════════════════════════════════════════════

title L'Academie des Mages — Serveur de jeu
cd /d "%~dp0"

echo.
echo ════════════════════════════════════════════════════
echo   L'ACADEMIE DES MAGES
echo ════════════════════════════════════════════════════
echo.
echo   Démarrage du serveur de jeu...
echo.
echo   Le jeu va s'ouvrir dans ton navigateur Chrome.
echo   Pour arrêter : ferme cette fenêtre.
echo.
echo ════════════════════════════════════════════════════
echo.

REM Ouvre le navigateur après 2 secondes (laisse le serveur démarrer)
start "" /B cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173"

REM Lance Vite (serveur de jeu) directement via node (contourne le & dans le chemin)
node ".\node_modules\vite\bin\vite.js" --port 5173 --host

pause
