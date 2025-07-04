# Gestión de Productos

Aplicación web para la gestión de productos, desarrollada con JavaScript, HTML y CSS moderno. Permite listar, agregar, editar, eliminar, buscar, ordenar y exportar productos de manera sencilla y profesional.

---

## 🖼️ Vista previa


---

## ✨ Características principales
- Listado dinámico de productos desde una API REST (JSON Server)
- Agregar, editar y eliminar productos con validaciones y confirmaciones
- Búsqueda instantánea por nombre
- Ordenar por nombre o precio (ascendente/descendente)
- Exportar la tabla a CSV
- Interfaz moderna, responsiva y accesible
- Mensajes y modales amigables (SweetAlert2)

---

## 📁 Estructura del proyecto

```
training_3_js/
│
├── index.html
├── db.json
│
├── js/
│   └── gestion_api.js
│
├── css/
│   └── styles.css
│
├── README.md
```

---

## 🚀 Instrucciones de instalación y uso

1. **Clona o descarga este repositorio.**
2. Instala [JSON Server](https://www.npmjs.com/package/json-server) si no lo tienes:
   ```bash
   npm install -g json-server
   ```
3. Inicia el servidor de la API local:
   ```bash
   json-server --watch db.json --port 3000
   ```
4. Abre `index.html` en tu navegador.

---

## 📦 Dependencias
- [SweetAlert2](https://sweetalert2.github.io/) (CDN)
- [JSON Server](https://www.npmjs.com/package/json-server) (para simular la API REST)
- Google Fonts: Montserrat y Roboto

---

## ♿ Accesibilidad y buenas prácticas
- Navegación por teclado en todos los controles
- Etiquetas ARIA y roles para lectores de pantalla
- Contraste y tamaño de fuente adecuados
- Diseño responsive para móviles y escritorio

---

## 🛠️ Recursos utilizados
- JavaScript moderno (ES6+)
- HTML5 y CSS3 (Flexbox, media queries)
- SweetAlert2 para modales y mensajes
- JSON Server para simular backend

---