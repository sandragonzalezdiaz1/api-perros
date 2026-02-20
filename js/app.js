// Espera a que el DOM esté completamente cargado antes de ejecutar el código
$().ready(() => {
  // Contenedor principal
  const contenedor = document.getElementById("demo");

  // Función para crear un <li> y añadirlo a la lista
  function crearLi(contenido, lista) {
    let item = document.createElement("li");
    item.innerHTML = contenido;
    lista.appendChild(item);
  }

  // Función para mostrar el estado de carga
  function mostrarLoader(){
    contenedor.innerHTML = "";
    let parrafo = document.createElement("p");
    parrafo.className = "loader";
    parrafo.textContent = "🐶 Cargando datos...";
    contenedor.appendChild(parrafo);

  }

  $("#btn-breeds").click(() => {
    mostrarLoader();
    $.ajax({
      url: "https://dogapi.dog/api/v2/breeds?page[size]=30",
      type: "GET",
      dataType: "json",
      success: (respuesta) => {
        //console.log(respuesta.data);

        // Limpiamos el contenedor anterior
        document.getElementById("demo").innerHTML = "";

        // Recorremos el array de razas recibido en respuesta.data
        respuesta.data.forEach((breed) => {
          let articulo = document.createElement("article");
          let lista = document.createElement("ul");

          // Objeto para traducir las claves de la API en etiquetas más legibles
          let etiquetas = {
            life: "Esperanza de vida",
            female_weight: "Peso hembra",
            male_weight: "Peso macho",
          };

          // Recorremos todas las propiedades de breed.attributes
          for (let [clave, valor] of Object.entries(breed.attributes)) {
            //console.log(clave, ":", valor)
            let texto;

            // Si la propiedad es el nombre, la mostramos como título
            if (clave === "name") {
              let titulo = document.createElement("h3");
              titulo.textContent = "🐶 " + valor;
              articulo.appendChild(titulo);
            } else if (clave === "hypoallergenic") {
              // Formateamos el valor booleano para mostrar Sí / No
              texto = `<strong>Hipoalergénico:</strong> ${valor ? "Sí" : "No"}`;
              crearLi(texto, lista);

              // Si el valor es un objeto (por ejemplo {min, max})
              // lo formateamos mostrando el rango
            } else if (typeof valor === "object" && valor !== null) {
              let etiqueta = etiquetas[clave] || clave;

              if (clave === "life") {
                texto = `<strong>${etiqueta}:</strong> ${valor.min} - ${valor.max} años`;
                crearLi(texto, lista);
              } else {
                texto = `<strong>${etiqueta}:</strong> ${valor.min} - ${valor.max} kg`;
                crearLi(texto, lista);
              }

              // Para cualquier otro valor simple (ej: descripcion de la raza)
            } else {
              crearLi(valor, lista);
            }
          }

          articulo.appendChild(lista);
          contenedor.appendChild(articulo);
        });
      },
      error: () => {
        contenedor.innerHTML = "";

        const mensajeError = document.createElement("div");
        mensajeError.className = "error-box";
        mensajeError.textContent =
          "⚠️ No se pudieron recuperar las razas de los perros. Inténtalo de nuevo más tarde.";
        contenedor.appendChild(mensajeError);
      },
    });
  });

  $("#btn-facts").click(() => {
    mostrarLoader();
    $.ajax({
      url: "https://dogapi.dog/api/v2/facts?limit=5",
      type: "GET",
      dataType: "json",
      success: (respuesta) => {
        //console.log(respuesta.data)

        // Limpiamos el contenedor anterior
        contenedor.innerHTML = "";

        // Recorremos el array de datos curiosos
        respuesta.data.forEach((fact) => {
          //console.log(fact.attributes.body)

          let parrafo = document.createElement("p");
          parrafo.className = "fact";
          parrafo.textContent = fact.attributes.body;

          contenedor.appendChild(parrafo);
        })
      },
      error: () => {
        contenedor.innerHTML = "";

        const mensajeError = document.createElement("div");
        mensajeError.className = "error-box";
        mensajeError.textContent =
          "⚠️ No se pudieron cargar los datos. Inténtalo de nuevo más tarde.";
        contenedor.appendChild(mensajeError);
      }
    })
  })
})
