@echo off
d:
cd \MyData\Projects\yogesh-monorepo
echo.
echo Installing all workspace dependencies...
npm install
echo.
echo === DONE === 
echo.
echo Run your apps:
echo   npm run dev:portfolio
echo   npm run dev:story-ui
pause
