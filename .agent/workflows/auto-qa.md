---
description: Auto-QA Auditor (TestSprite Mode) - Ejecuta una auditoría de calidad autónoma completa (E2E) sobre el proyecto actual.
---

// turbo-all
1. Analiza el archivo `README.md` (si existe) y `package.json` para entender el propósito del proyecto (Intención de Negocio) y el Stack Tecnológico.

2. **Auditoría de Seguridad y Arquitectura Estática (CRÍTICO)**:
   - **Análilsis de Arquitectura**: Determina si es una SPA pura (Frontend-only) o tiene Backend. Si es SPA y usa APIs de pago, advierte sobre la exposición de credenciales en el cliente.
   - **Credenciales y Secretos**: 
     - Verifica que `.env` está estrictamente en `.gitignore`.
     - Escanea el código Frontend (ej. `App.jsx`) para asegurar que no hay API Keys hardcodeadas.
   - **Prompt Injection**: Revisa si los inputs del usuario se insertan directamente en prompts de IA sin validación o sanitización.
   - Si encuentras vulnerabilidades, repórtalas inmediatamente y si es posible, aplica parches (ej. agregar a .gitignore).

3. Genera un breve "Plan de Pruebas Volátil" en memoria con 3 casos:
   - Happy Path (Flujo principal de éxito).
   - Un caso de error (Inputs inválidos).
   - Un caso de integración (Verificar respuesta de API/Backend).

3. Verifica que el servidor de desarrollo esté corriendo (busca procesos de `node` o `vite`). Si no detectas uno en el purto 5173 o 3000, intenta iniciarlo con `npm run dev` en segundo plano (pero verifica primero si ya está corriendo).

4. Usa la herramienta `browser_subagent` para ejecutar el Plan de Pruebas como un usuario real:
   - Navega a la URL local.
   - Interactúa con los elementos críticos.
   - Toma capturas de pantalla de los resultados.
   - Importante: Si un paso falla, intenta deducir por qué.

5. Analiza los resultados del `browser_subagent`:
   - Si todo pasó: Genera un reporte final con "✅ PASSED".
   - Si algo falló: Activa el protocolo "Self-Healing":
     - Lee el archivo de código relevante donde ocurrió el fallo.
     - Propón (o aplica si estás seguro) una corrección de código para solucionar el bug.

6. Entrega al usuario un resumen ejecutivo con los hallazgos y las acciones tomadas.
