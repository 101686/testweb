const http = require("http");
const { Connection, Request } = require("tedious");
http
  .createServer(function (req, res) {
    res.write("Hello world!");
    res.end();
  })
  .listen(8080);

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "Jan", // update me
      password: "Green789" // update me
    },
    type: "default"
  },
  server: "jandbxyxy.database.windows.net,1433", // update me
  options: {
    database: "mydb", //update me
    encrypt: true
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT TOP 20 pc.Name as CategoryName,
                       p.name as ProductName
         FROM [SalesLT].[ProductCategory] pc
         JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", (columns) => {
    columns.forEach((column) => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });

  connection.execSql(request);
}
