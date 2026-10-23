# Photocards K-pop API

API REST con Node.js, Express y Mongoose para gestionar idols, álbumes, photocards y contratos.

## Relaciones y justificación

**Perfil embebido en Idol:** pertenece solo a ese idol, es chico, no crece y siempre se consulta junto con él.

**Idol y Contrato (1:1, referenciado):** el contrato tiene su propio ciclo de vida (se renueva, vence, cambia de agencia) y se consulta por separado.

**Idol y Photocards (1:N, referenciado):** un idol puede tener cientos de photocards. Embebidas harían el documento enorme.

**Photocards y Álbumes (N:M, referenciado):** ambos existen de forma independiente y una photocard puede estar en varias ediciones. El array de IDs va en la photocard porque está en pocos álbumes.

## Investigación

**Populate sin referencias:** Idol y Album no guardan IDs de photocards, pero se las puede traer con un virtual que busca en Pc por el campo idol (o albumes). Luego se usa populate("photocards").

**Eliminación lógica y en cascada:** no se borra el documento, se marca activo: false y las consultas filtran por activo: true. Al eliminar un idol se desactivan sus photocards y su contrato con updateMany. Al eliminar un álbum se quita de las photocards con $pull.

**Vínculo N:M:** el endpoint POST /api/pcs/:id/albumes/:albumId agrega el álbum a la photocard con $addToSet. Antes, un validador con custom() comprueba que ambos documentos existan y que el vínculo no esté duplicado.