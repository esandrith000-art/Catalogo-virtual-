
import { useEffect, useState } from "react";
import { procesarCatalogo } from "./procesarCatalogo";
const comentariosEnEspanol = [
    "Este producto es excelente y tiene muy buena calidad.",
    "Me gusta mucho este servicio, es fácil de utilizar.",
    "La atención fue buena y la experiencia resultó satisfactoria.",
    "El producto llegó en buenas condiciones y funciona correctamente.",
    "La información del producto es clara y fácil de entender.",
    "La compra fue sencilla y el proceso no presentó inconvenientes.",
    "Estoy satisfecho con el producto y lo recomendaría.",
    "El servicio fue rápido y recibí la ayuda que necesitaba.",
    "El producto corresponde a la descripción y cumple su función.",
    "La experiencia de compra fue agradable y sencilla."
];

function App() {

    
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState({});
    const [errorCatalogo, setErrorCatalogo] = useState("");
    const [cargandoCatalogo, setCargandoCatalogo] = useState(true);

    
    const [comentarios, setComentarios] = useState([]);
    const [errorComentarios, setErrorComentarios] = useState("");
    const [cargandoComentarios, setCargandoComentarios] = useState(true);

    
    useEffect(() => {

        async function cargarCatalogo() {

            try {

                const respuesta = await fetch("/catalogo.json");

                if (!respuesta.ok) {
                    throw new Error("No se pudo encontrar el archivo catalogo.json.");
                }

                const texto = await respuesta.text();

                const resultado = procesarCatalogo(texto);

                setProductos(resultado.disponibles);
                setCategorias(resultado.agrupados);

                
                console.log("Resultado de JSON.stringify():");
                console.log(resultado.textoFinal);

            } catch (error) {

                setErrorCatalogo(error.message);

            } finally {

                setCargandoCatalogo(false);

            }
        }

        cargarCatalogo();

    }, []);

    
    useEffect(() => {

        async function cargarComentarios() {

            try {

                const respuesta = await fetch(
                    "https://jsonplaceholder.typicode.com/comments"
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudieron obtener los comentarios.");
                }

                const datos = await respuesta.json();

                
                setComentarios(datos.slice(0, 10));

            } catch (error) {

                console.error(error);

                setErrorComentarios(
                    "No fue posible cargar los comentarios. Comprueba tu conexion."
                );

            } finally {

                setCargandoComentarios(false);

            }
        }

        cargarComentarios();

    }, []);

    
    const formatoPrecio = (precio) => {

        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(precio);

    };

    return (

        <main className="contenedor">

            <h1>Mi catalogo virtual</h1>

            <section>

                <h2>Productos disponibles</h2>

                {cargandoCatalogo && (
                    <p>Cargando productos...</p>
                )}

                {errorCatalogo && (
                    <p>Error: {errorCatalogo}</p>
                )}

                {!cargandoCatalogo && !errorCatalogo && (

                    productos.length > 0 ? (

                        <ul>

                            {productos.map((producto) => (

                                <li key={producto.id}>

                                    <strong>{producto.nombre}</strong>

                                    <p>
                                        Categoria: {producto.categoria}
                                    </p>

                                    <p>
                                        Precio: {formatoPrecio(producto.precio)}
                                    </p>

                                    <p>
                                        Dimensiones: {producto.dimensiones.alto} x
                                        {producto.dimensiones.ancho} x
                                        {producto.dimensiones.profundidad}{" "}
                                        {producto.dimensiones.unidad}
                                    </p>

                                </li>

                            ))}

                        </ul>

                    ) : (

                        <p>No hay productos disponibles.</p>

                    )

                )}

            </section>

            <section>

                <h2>Productos agrupados por categoria</h2>

                {Object.entries(categorias).map(([categoria, lista]) => (

                    <div key={categoria}>

                        <h3>{categoria}</h3>

                        <ul>

                            {lista.map((producto) => (

                                <li key={producto.id}>
                                    {producto.nombre}
                                </li>

                            ))}

                        </ul>

                    </div>

                ))}

            </section>

            <section>

                <h2>Comentarios de JSONPlaceholder</h2>

                {cargandoComentarios && (
                    <p>Cargando comentarios...</p>
                )}

                {errorComentarios && (
                    <p>{errorComentarios}</p>
                )}

                {!cargandoComentarios &&
                    !errorComentarios &&
                    comentarios.length === 0 && (

                        <p>No hay comentarios disponibles.</p>

                    )}

                {!cargandoComentarios &&
                    !errorComentarios &&
                    comentarios.length > 0 && (

                       <div className="lista-comentarios">
                        
{comentarios.map((comentario, indice) => (

    <article
        className="tarjeta-comentario"
        key={comentario.id}
    >

        <h3>
            Comentario número {indice + 1}
        </h3>

        <p>
            <strong>Nombre:</strong> Usuario {indice + 1}
        </p>

        <p>
            <strong>Correo electrónico:</strong>{" "}
            {comentario.email}
        </p>

        <p>
            <strong>Contenido:</strong>
        </p>

        <p className="texto-comentario">
            {comentariosEnEspanol[indice]}
        </p>

      </article>

))}

                       </div>

                    )}

            </section>

        </main>

    );

}

export default App;
