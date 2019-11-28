# nodesocket
Esta aplicación se creó para resolver un problema:  
Tenemos una tv donde poner imágenes de la empresa.
Pensamos en usar OBS Studio con una fuente de Navegador para mostrara las imágenes.
Pero nos cacheaba todo el rato, por lo que cada vez que alguien subiese una foto, habría que apagar la fuente y volverla a encender.  
Eso no es una solución y lo que cree es una pagina web que se actualiza inmediatamente y no cachea gracias al uso de websockets con Socket.io.
## Hay varias partes:
1. Socket -> es la pagina web que hay que poner en la fuente de OBS Studio. Consiste en un servidor (Node.js  + Express) que emite en esta url: http://nodesocket.local:3000/
2. Manager -> es la gestión de la APP. Es una pagina web hecha en VUE.js desde la que se puede gestionar las imágenes, el orden, la visibilidad, añadir nuevas y modificar opciones. Se encuentra en esta URL: http://localhost:8080/ en modo dev y luego en modo prod, se encuentra en http://manager.nodesocket.local
3. Controller -> Otro servidor Node.js + Express, que nos da las funciones de control sobre las operaciones de la imágenes y las opciones. http://controller.manager.nodesocket.local:3001
4. Imágenes -> simplemente donde se encuentran las imágenes almacenadas. Esta ruta apunta ahí: http://imagenes.nodesocket.local
5. WAMP Server. es donde esta definido los Vhost y donde almacenamos la base de datos MySQL

## Como funciona:
Se crea los Vhost apuntado a cada carpeta y la base de datos.  
Hay que inicializar luego los servidores Node.js. Para ello ejecuta este comando:
```sh
npm run start  
```
O si lo prefieres navega a cada carpeta y ejecuta este comando:
```sh
npm run start  
```
Entonces ya están los dos servidores funcionando y solo debes ir a la web que desees (manager o app).
