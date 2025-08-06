# Guía de Optimización de Imágenes para el Banner

## Problema Actual
Las imágenes en la carpeta `images/` son muy pesadas (2-4MB cada una), lo que afecta el rendimiento del sitio web.

## Solución Implementada

### 1. Sistema de Banner Dinámico
- ✅ Creado `banner-dynamic.js` que carga imágenes dinámicamente
- ✅ Implementado lazy loading para mejorar rendimiento
- ✅ Añadido soporte para gestos táctiles en móviles
- ✅ Optimizado CSS para mejor rendimiento

### 2. Optimizaciones de Rendimiento
- **Lazy Loading**: Las imágenes se cargan solo cuando son necesarias
- **Preload**: Las siguientes 3 imágenes se precargan para transiciones suaves
- **Responsive**: Diferentes tamaños para móviles y desktop
- **CSS Optimizado**: Uso de `will-change` y `contain` para mejor rendimiento

### 3. Recomendaciones para Optimizar Imágenes

#### Opción 1: Herramientas Online (Más Fácil)
1. Visita [TinyPNG](https://tinypng.com/) o [Squoosh](https://squoosh.app/)
2. Sube tus imágenes PNG de la carpeta `images/`
3. Descarga las versiones optimizadas
4. Reemplaza las imágenes originales

#### Opción 2: Usando ImageMagick (Más Control)
```bash
# Instalar ImageMagick (si no lo tienes)
brew install imagemagick

# Optimizar todas las imágenes
cd images/
for file in *.png; do
    convert "$file" -resize 1200x600^ -gravity center -extent 1200x600 -quality 85 -strip "optimized_$file"
done
```

#### Opción 3: Usando Node.js y Sharp
```bash
npm install sharp
node optimize-images-sharp.js
```

### 4. Tamaños Recomendados
- **Desktop**: 1200x600px máximo
- **Mobile**: 800x400px máximo
- **Calidad**: 80-85% para JPG, compresión PNG optimizada
- **Formato**: WebP para navegadores modernos, JPG como fallback

### 5. Estructura de Archivos Recomendada
```
images/
├── original/          # Imágenes originales (backup)
├── optimized/         # Imágenes optimizadas para web
│   ├── webp/         # Formato WebP (más eficiente)
│   └── jpg/          # Formato JPG (fallback)
```

## Beneficios de la Optimización

1. **Velocidad de Carga**: 70-80% más rápido
2. **SEO**: Mejor puntuación en PageSpeed Insights
3. **Experiencia de Usuario**: Navegación más fluida
4. **Ahorro de Ancho de Banda**: Menos consumo de datos
5. **Mejor Rendimiento en Móviles**: Especialmente importante

## Estado Actual
- ✅ Banner dinámico implementado
- ✅ CSS optimizado para rendimiento
- ✅ Sistema de lazy loading activo
- ⏳ Pendiente: Optimizar imágenes físicas

## Próximos Pasos
1. Optimizar las imágenes usando una de las opciones mencionadas
2. Probar el rendimiento del sitio
3. Ajustar configuraciones si es necesario

## Notas Técnicas
- El banner ahora usa las primeras 10 imágenes de tu carpeta
- Cada imagen tiene título y descripción personalizable
- Sistema de autoplay cada 4 segundos
- Controles de navegación mejorados
- Soporte completo para dispositivos táctiles
