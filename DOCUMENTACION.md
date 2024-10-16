

// TITULO DEL PROYECTO

Aplicacion web con CRUD (Create, Read, Update, Delete), conexion a base de datos (Mongo DB), testeada mediante Jest y Supertest, con implementacion de controladores de ruta, validacion para administradores, albergada en un servidor Express, desplegada en Render y enfocada completamente a la comodidad del usuario.




// DESCRIPCION

Aplicacion enfocada en su totalidad a la comodidad de el usuario que realiza operaciones CRUD cien por cien desde el navegador mediante formularios, la utilizacion de herramientas como POSTMAN no es necesaria en absoluto, no obstante, si el administrador desea utilizar herramientas como POSTMAN puede hacerlo (ver METODO DE UTILIZACION).

Se han desarrollado formularios para los metodos CREATE Y UPDATE, con INPUTS que utilizan el atributo REQUIRE para VALIDAR el contenido y evitar campos vacios, para el campo PRECIO se ha utilizado un INPUT con TYPE NUMBER que no permite letras, para campos como TALLA y CATEGORIA se han utilizado INPUTS con TYPE SELECT con opciones limitadas a las posibilidades.

No obstante se ha implementado la logica necesaria dentro de el codigo de los endpoints mediante el uso de CONDICIONALES para INCLUIR validacion, para que, en caso de que el administrador desee utilizar una herramienta como POSTMAN, pueda hacerlo y en caso de sufrir una equivocacion, el terminal devuelva un ERROR PERSONALIZADO AL PROBLEMA.

En caso de que el usuario se trate de un usuario SIN VALIDACION el acceso a las areas de arministracion esta TOTALMENTE RESTRINGIDO.

Dada la naturaleza de la aplicacion tanto los metodos UPDATE como DELETE han sido implementados mediante el metodo POST, debido a que el uso de FORMULARIOS no acepta los metodos PUT o DELETE, se ha intentado utilizar dependencias como METHOD-OVERRIDE pero el resultado no fue satisfactorio.

En caso de desear EJECUTAR TESTEO se recomienda realizarlo en ULTIMA INSTANCIA ya que la ejecucion del testeo ELIMINA TODOS LOS ELEMENTOS de la base de datos.



// METODO DE UTILIZACION

Utilizar la aplicacion es sencillo:

En caso de ser un USUARIO NO VALIDADO:
El acceso es limitado, UNICAMENTE estaran disponibles las vistas /products y products/:_id, las cuales permiten la VISUALIZACION de los productos al detalle, pero NO PERMITEN la modificacion de los mismos. El usuario solo podra acceder al endpoint "/products" mediante el enlace ENTRAR COMO INVITADO y al endpoint "/products/:_id" a traves de el ENLACE en el contenedor del PROPIO PRODUCTO que desea visualizar, el primer endpoint permite visualizar la totalidad de los productos al detalle, mientras que el segundo endpoint permite la visualizacion de el producto seleccionado en una perspectiva MAS CERCANA, sin embargo, ninguno de ambos endpoints permite la MODIFICACION de los productos, el usuario podra navegar, VISUALIZAR todos los productos y en el momento que lo desee VOLVER AL INICIO.

En caso de ser un ADMINISTRADOR VALIDADO:
El acceso es completo, el ADMINISTRADOR VALIDADO puede navegar libremente por todos los endpoints, acceder a las areas DE VISUALIZACION pero ademas, tambien puede acceder a las areas de CREACION, EDICION y ELIMINACION de productos, las cuales se muestran con una interfaz SIMILAR a la de visualizacion pero contienen BOTONES que permiten al administrador acceder a la vista de EDICION o simplemente ELIMINAR EL PRODUCTO SELECCIONADO.
Si el administrador, por otra parte, desea AÑADIR un producto nuevo, dispone de un BOTON con POSITION FIXED en la esquina superior izquierda que le REDIRIGIRA inmediatamente al FORMULARIO DE CREACION. (Para acceder como administrador introducir, Usuario: admin1, Contraseña: password1).

Tras INICIAR SESION, CERRAR SESION, CREAR, EDITAR o ELIMINAR un producto, el administrador sera inmediatamente REDIRIGIDO a una vista de EXITO relacionada con el proceso.

En caso de que el escaparate se encuentre VACIO el servidor mostrara la vista de DASHBOARD VACIO la cual contiene enlaces para VOLVER AL INICIO, CERRAR SESION y CREAR UN PRODUCTO.

En caso de que el administrador desee utilizar una herramienta como POSTMAN, debera utilizar el metodo POST, no solo para ejecutar un metodo POST, sino tambien para ejecutar un metodo PUT o un metodo DELETE (ejemplo: Seleccionar metodo POST, escribir endpoint /dashboard/delete/"+ correspondiente _id" borrara el producto deseado), dada la naturaleza de la aplicacion (BASADA EN FORMULARIOS), y debera evnviar tanto las solicitudes POST como PUT utilizando la funcion FORM-DATA de POSTMAN debido a la utilizacion de la dependencia MULTER, la cual permite seleccionar archivos locales en FORMATO BINARIO.



// DEPENDENCIAS UTILIZADAS

BCRYPT, COOKIE-PARSER, CRYPTO Y JSONWEBTOKEN:
Dependencias utilizadas para el registro y validacion de el administrador en los diferentes endpoints que lo requieren.


DOTENV:
Dependencia utilizada para recoger datos de desarrollo privados como en este caso el MONGO_URI.


EJS:
Dependencia utilizada para renderizar respuestas HTML individuales, con interpolacion de variables y CSS personalizado. 


EXPRESS:
Dependencia utilizada para la generacion de el servidor.


MONGOOSE:
Dependencia utilizada para la conexion de el servidor a la base de datos de Mongo DB.

MULTER:
Dependencia utilizada para permitir la subida de archivos locales como .jpg en formato binario.
