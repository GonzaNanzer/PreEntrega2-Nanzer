//Clases:
class Producto{
    //Constructor:
    constructor(nombre,precio,stock){
        this.nombre = nombre.toUpperCase();
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
    }

    //Metodos:
    //Sirve para modificar manualmente el precio de un producto:
    modificarPecio(nuevoPrecio) {
        this.precio = parseFloat(nuevoPrecio);
    }

    //Sirve para modificar manualmente el stock de un producto:
    modificarStockManual(nuevoStock){
        this.stock =parseInt(nuevoStock) ;
    }

    //Reduce la cantidad disponible de un producto por venta:
    reducirStock(cantidadVendida){
        this.stock = this.stock - cantidadVendida;
    }
}

class Pedido{
    constructor(nombreCliente){
        this.nombreCliente = nombreCliente;
        this.productosPedidos = [];
    }

    agregarProductoAlPedido(nombreProducto, cantidad){
        this.productosPedidos.push({nombreProducto, cantidad});
    }

    mostrarResumen(nuevoPedido){
        let fecha = new Date();
        let resumen = ` Item        Cantidad        Total`;
        for(let item of nuevoPedido.productosPedidos){
            resumen = resumen + `
            ${item.nombreProducto}          ${item.cantidad}        ${listadoProductos.find((elem) => elem.nombre === item.nombreProducto).precio * item.cantidad}`
        }
        alert(`Pedido de ${nuevoPedido.nombreCliente} creado el ${fecha.getDay()} del ${fecha.getMonth()} del ${fecha.getFullYear()}
                ${resumen} 
            El total del pedido es ${this.calcularTotal(nuevoPedido)}`);
    }

    calcularTotal(nuevoPedido){
        let total = 0;
        for(let item of nuevoPedido.productosPedidos){
            total = total + listadoProductos.find((elem) => elem.nombre === item.nombreProducto).precio * item.cantidad;
        }
        return total;
    }

}

// Variables: 
const listadoProductos = [new Producto("tenedor",150,30), new Producto("Cuchara",180,27)]; //Almacena instancias de la clase Producto. Inicia con tenedor y cuchara.
const listadoPedidos = []; //Almacena instancias de la clase Pedido, para usarse en la generación de estadísticas.

//Inicio
main();

//Menu inicial:
function main(){
    while(true){
        let opcion = prompt(`Seleccionar opción:
                                - Crear nuevo pedido: ingrese 1.
                                - Agregar productos: ingrese 2.
                                - Modificar producto existente: ingrese 3.
                                - Ver estadísticas de la sesión: ingrese 4.`);
        if(opcion == 1){
            crearPedido();
        }
        else if(opcion == 2){
            agregarProductosOfrecidos();
        }
        else if(opcion == 3){
            modificarProducto();
        }
        else if(opcion == 4){
            mostrarEstadisticas();
        }
        else{
            alert("Por favor ingrese un valor correcto.");
        }
    }
}

//Funcion para crear un nuevo pedido.
function crearPedido(){
    let nombreCliente = prompt("Ingrese el nombre del cliente");
    nuevoPedido = new Pedido(nombreCliente);
    let pedidoEnCurso = true;
    while(pedidoEnCurso){
        let ofrecemos = "Contamos con: \n";
        listadoProductos.forEach((elem) => ofrecemos = ofrecemos + elem.nombre + "\n");
        let nombreProducto = prompt(`Tipee el producto a agregar o presione cancelar para terminar. ${ofrecemos}`);
        if(nombreProducto !== null){
            nombreProducto = nombreProducto.toUpperCase();
            let resultado = listadoProductos.find((elem) => elem.nombre === nombreProducto);
            if(resultado !== undefined){
                cantidad= prompt(`El stock de ${resultado.nombre} es ${resultado.stock}. Ingrese la cantidad que desea agregar al pedido: `);
                if(cantidad < 0 || cantidad > resultado.stock || isNaN(cantidad)){
                    alert("La cantidad ingresada no es válida. No se agregó este producto al pedido.")
                }
                else{
                    nuevoPedido.agregarProductoAlPedido(nombreProducto,cantidad);
                    resultado.reducirStock(cantidad);
                }
            }
            else{
                alert("No se encontró el producto.");
            }
        }
        else{
            pedidoEnCurso = false;
        }
    }
    listadoPedidos.push(nuevoPedido);
    nuevoPedido.mostrarResumen(nuevoPedido);
}

//Funcion para agregar un producto a la tienda
function agregarProductosOfrecidos(){
    let seguirCargando = true;
    while(seguirCargando){
        let confirma;
        nombre = prompt("Nombre del nuevo producto:").toUpperCase();
        if(listadoProductos.some((elem)=>elem.nombre == nombre)){
            alert("El producto ya existe. Modifique los datos en la opción 3.");
            main();
        }
        else{
            do{precio = parseFloat(prompt(`Precio para ${nombre}`));}while(isNaN(precio) || precio <= 0);
            do{stock = parseInt(prompt(`Stock de ${nombre}`));}while(isNaN(stock)|| stock <= 0);
            confirma = prompt(`Se agregarán ${stock} unidades de ${nombre} al inventario, con un precio unitario de ${precio}. Desea confirmar?`);
        }
        if(confirma !== null){
            listadoProductos.push(new Producto(nombre,precio,stock));
        }
        else{
            alert("Carga cancelada.")
        }
        let eleccion = prompt("Presione aceptar para cargar mas productos o cancelar para regresar al menu.")
        if(eleccion === null){
            seguirCargando = false;
        }
    }
}

//Funcion para modificar un producto:
function modificarProducto(){
    let items = "Contamos con: \n"
    listadoProductos.forEach((elem) => items = items + elem.nombre + "\n");
    let nombreProducto = prompt(`Tipee el producto para modificar. ${items}`).toUpperCase();
    if(listadoProductos.some((elem)=>elem.nombre === nombreProducto)){
        let nuevoPrecio = 0;
        do{
            nuevoPrecio = prompt(`Ingrese el nuevo precio para ${nombreProducto}, o cancelar para no modificar. El precio actual es ${listadoProductos.find((elem) => elem.nombre === nombreProducto).precio}`);
            if(nuevoPrecio === null){
                alert("No se modificó el precio.");
                break;
            }
            listadoProductos.find((elem) => elem.nombre === nombreProducto).modificarPecio(nuevoPrecio);
        } while (isNaN(nuevoPrecio));
        let nuevoStock = 0;
        do{
            nuevoStock = prompt(`Ingrese el nuevo stock para ${nombreProducto}, o cancelar para no modificar. El stock actual es ${listadoProductos.find((elem)=>elem.nombre === nombreProducto).stock}`);
            if(nuevoStock === null){
                alert(`No se modificó el stock.`);
                main();
            }
            listadoProductos.find((elem) => elem.nombre === nombreProducto).modificarStockManual(nuevoStock);
        } while (isNaN(nuevoStock));
        listadoProductos.find((elem) => elem.nombre === nombreProducto).modificarStockManual(nuevoStock);
        alert(`Se modificaron correctamente los valores para ${nombreProducto}`);
    }
    else{
        alert("Producto no encontrado.");
    }
}

//Funciones para ver estadísticas del día sobre: Resumen de pedidos del día; Recaudación total; Productos con bajo stock.
function mostrarEstadisticas(){
    alert(resumenPedidosDia());
    alert(recaudacionTotalDia());
    alert(stocksLimite());
}

function resumenPedidosDia(){
//Eliminar pedidos vacíos
    listadoPedidos.sort((a,b) => a.productosPedidos.length - b.productosPedidos.length); 
    while (listadoPedidos.length > 0 && listadoPedidos[0].productosPedidos.length === 0) {
        listadoPedidos.shift();
    }
//Armar el mensaje de resumen
    let mensaje = `Pedidos del día: `;
    let i = 1;
    for(const pedido of listadoPedidos){
        let sumaProductos = 0;
        pedido.productosPedidos.forEach((elem) => sumaProductos = sumaProductos + parseInt(elem.cantidad));
        mensaje = mensaje + `
        - Pedido ${i}, de ${pedido.nombreCliente}: ${sumaProductos} productos por $ ${pedido.calcularTotal(pedido)}.-`
        i++;
    }
    return mensaje;
}

function recaudacionTotalDia(){
    let recaudacion = 0;
    for(const pedido of listadoPedidos){
        recaudacion = recaudacion + parseFloat(pedido.calcularTotal(pedido));
    }
    let mensaje = `La recaudación del día fue de $${recaudacion}.-`;
    return mensaje;
}

function stocksLimite(){
    let itemsParaReponer = [];
    for(const producto of listadoProductos){
        if(producto.stock < 5){
            itemsParaReponer.push(producto.nombre);
        }
    }
    let listaItemsParaReponer = itemsParaReponer.join(", ");
    let mensaje = "Es necesario reponer: " + listaItemsParaReponer;
    return mensaje;
}