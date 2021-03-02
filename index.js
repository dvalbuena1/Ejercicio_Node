const axios = require("axios");
const http = require("http");
const fs = require("fs");

const JSDOM = require("jsdom").JSDOM;

function loadHeaderTable(dom) {
  let tr = dom.window.document.querySelector("#TableJson > thead > tr");

  let th1 = dom.window.document.createElement("th");
  th1.scope = "col";
  th1.textContent = "ID";

  let th2 = dom.window.document.createElement("th");
  th2.scope = "col";
  th2.textContent = "Nombre";

  let th3 = dom.window.document.createElement("th");
  th3.scope = "col";
  th3.textContent = "Contacto";

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
}

async function loadProveedores(callback) {
  const proveedores = await axios.get(
    "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json",
  );
  console.log(proveedores);
  fs.readFile("index.html", (err, data) => {
    const dom = new JSDOM(data.toString());
    let h2 = dom.window.document.querySelector("body > main > div > h2");
    h2.textContent = "Listado de Proveedores";

    loadHeaderTable(dom);

    let tbody = dom.window.document.querySelector("#TableJson > tbody");
    proveedores.data.forEach((value) => {
      let tr = dom.window.document.createElement("tr");

      let th = dom.window.document.createElement("th");
      th.scope = "row";
      th.textContent = value.idproveedor;

      let td1 = dom.window.document.createElement("td");
      td1.textContent = value.nombrecompania;

      let td2 = dom.window.document.createElement("td");
      td2.textContent = value.nombrecontacto;

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);

      tbody.appendChild(tr);
    });

    data = dom.serialize();
    callback(data);
  });
}

async function loadClientes(callback) {
  const clientes = await axios.get(
    "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json",
  );

  console.log(clientes);
  fs.readFile("index.html", (err, data) => {
    const dom = new JSDOM(data.toString());
    let h2 = dom.window.document.querySelector("body > main > div > h2");
    h2.textContent = "Listado de Clientes";

    loadHeaderTable(dom);

    let tbody = dom.window.document.querySelector("#TableJson > tbody");
    clientes.data.forEach((value) => {
      let tr = dom.window.document.createElement("tr");

      let th = dom.window.document.createElement("th");
      th.scope = "row";
      th.textContent = value.idCliente;

      let td1 = dom.window.document.createElement("td");
      td1.textContent = value.NombreCompania;

      let td2 = dom.window.document.createElement("td");
      td2.textContent = value.NombreContacto;

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);

      tbody.appendChild(tr);
    });

    data = dom.serialize();
    callback(data);
  });
}

//Create server
http
  .createServer(function (req, res) {
    if (req.url == "/api/proveedores") {
      loadProveedores((data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
    } else if (req.url == "/api/clientes") {
      loadClientes((data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
    } else {
      res.end("No existe");
    }
  })
  .listen(8081);
