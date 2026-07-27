# 🔒 Credenciales Locales de Prueba
- **Correo:** `correo@dkfitt.com`
- **Contraseña:** `123456`

---

# 🚀 Tareas Pendientes y Comandos Git

## 1. Moverse entre Ramas (Cambiar de Tarea)
Ya que tienen prohibido tocar la rama `main` y trabajan con ramas específicas por historia/funcionalidad, aquí tienes los comandos para navegar entre ellas. 

Si tu líder ya creó las ramas en GitHub, primero debes descargar la lista actualizada y luego "saltar" a esa rama:

```bash
# 1. Actualizar la lista de ramas desde GitHub
git fetch

# 2. Cambiarte a la rama que necesites usar
git checkout <nombre-de-la-rama>

# Ejemplo si necesitas regresar a la del Login:
# git checkout feature/HU-LOGIN-login-nutricionista
```

## 2. Guardar y Subir Cambios (Hacer Push)
Cuando terminamos de programar una historia (como la que acabamos de hacer de la HU01), y quieres enviar tu trabajo para que tu líder lo revise, usas estos comandos:

```bash
# 1. Empaquetar todos los archivos modificados
git add .

# 2. Guardar el paquete localmente con un mensaje
git commit -m "feat: implementar [nombre de la historia]"

# 3. Subir tu paquete (push) a esa rama en GitHub
git push origin <nombre-de-la-rama>
```

## ⚠️ LO QUE TIENES PENDIENTE AHORA MISMO
Tienes los commits hechos en tu computadora para dos ramas distintas, pero no has podido hacer el *push* por falta de permisos. **Mañana, cuando te den acceso de colaborador, debes hacer esto estrictamente en este orden:**

1. **Subir el Login:**
   ```bash
   git checkout feature/HU-LOGIN-login-nutricionista
   git push origin feature/HU-LOGIN-login-nutricionista
   ```

2. **Subir los Pacientes (HU01):**
   ```bash
   # Saltamos a la rama de la HU01
   git checkout feature/HU01-listado-pacientes
   
   # Guardar lo que programamos hoy (Incluye refactorización Zenith y Design System)
   git add .
   git commit -m "feat: implementar listado pacientes HU01, refactor arquitectura Zenith y Design System Dark Mode"
   
   # Subirlo
   git push origin feature/HU01-listado-pacientes
   ```
