@echo off
echo Iniciando o Simulador de Financiamento Imobiliario...
echo.
echo === Verificando instalacao do Node.js ===
node --version > nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo ERRO: Node.js nao encontrado. Por favor, instale o Node.js.
  pause
  exit
)

echo === Instalando dependencias do backend ===
cd server
call npm install

IF %ERRORLEVEL% NEQ 0 (
  echo ERRO: Falha ao instalar dependencias do backend.
  pause
  exit
)

echo.
echo === Inicializando o banco de dados ===
call npm run init-db
echo.
echo === Iniciando o servidor backend ===
start cmd /k "cd server && npm start"
echo.
echo === Instalando dependencias do frontend ===
cd ..
call npm install

IF %ERRORLEVEL% NEQ 0 (
  echo ERRO: Falha ao instalar dependencias do frontend.
  pause
  exit
)

echo.
echo === Iniciando o cliente frontend ===
start cmd /k "npm start"
echo.
echo O simulador estara disponivel em http://localhost:3000
echo O servidor backend estara disponivel em http://localhost:3001/api
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
