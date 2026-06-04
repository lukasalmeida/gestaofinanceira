const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const healthRoutes = require('./routes/health.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/', healthRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API Financeira Online"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});