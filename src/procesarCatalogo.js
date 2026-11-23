
export function procesarCatalogo(textoJSON) {

    let datos;

    
    try {

        datos = JSON.parse(textoJSON);

    } catch (error) {

        throw new error(
            "El archivo del catalogo esta vacio o tiene un formato incorrecto.");

    }

    
    if (!datos || !Array.isArray(datos.productos)) {

        throw new Error(
            "El catalogo no contiene una lista de productos valida."
        );

    }

    
    const disponibles = datos.productos.filter(
        producto => producto.disponible === true
    );

    
    const agrupados = disponibles.reduce((grupos, producto) => {

        const categoria = producto.categoria;

        if (!grupos[categoria]) {

            grupos[categoria] = [];

        }

        grupos[categoria].push(producto);

        return grupos;

    }, {});

    
    const textoFinal = JSON.stringify(
        {
            productosDisponibles: disponibles,
            productosPorCategoria: agrupados
        },
        null,
        2
    );

    return {
        disponibles,
        agrupados,
        textoFinal
    };

}
