@echo off
REM ============================================================
REM  Velara - lanzador local (Windows)
REM  Sirve la app en http://localhost:8137 y abre el navegador.
REM  Doble clic para usar. Deja la ventana abierta mientras la uses.
REM ============================================================
setlocal
cd /d "%~dp0"
set "PORT=8137"

echo.
echo    V E L A R A   -   guia de tarot local
echo    --------------------------------------
echo    Sirviendo en:  http://localhost:%PORT%/
echo    Deja esta ventana ABIERTA mientras usas la app.
echo    Para cerrar: cierra esta ventana o pulsa Ctrl+C.
echo.
echo    (Si el navegador dice "no se puede conectar", refresca una vez.)
echo.

REM Abre el navegador (el servidor arranca en un instante)
start "" "http://localhost:%PORT%/"

REM Sirve con Python si esta disponible; si no, con Node (npx serve)
where py >nul 2>nul && ( py -m http.server %PORT% & goto fin )
where python >nul 2>nul && ( python -m http.server %PORT% & goto fin )
where npx >nul 2>nul && ( npx --yes serve -l %PORT% & goto fin )

echo.
echo    [!] No se encontro Python ni Node.js en este equipo.
echo        Instala Python (mas facil): https://www.python.org/downloads/
echo        Durante la instalacion marca la casilla "Add Python to PATH".
echo        Luego vuelve a hacer doble clic en este archivo.
echo.
pause

:fin
endlocal
