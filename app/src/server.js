require("dotenv").config();

const express = require("express");
const path = require("path");

const db = require("./config/database");

const productRoutes =
    require("./routes/productRoutes");

const supplierRoutes =
    require("./routes/supplierRoutes");

const inventoryRoutes =
    require("./routes/inventoryRoutes");


const app = express();

const PORT =
    process.env.PORT || 3000;


// EJS
app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(__dirname, "views")
);


// Middleware
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.json()
);

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


// Dashboard
app.get("/", async (req, res) => {

    try {

        const [[productCount]] =
            await db.query(`
                SELECT COUNT(*) AS total
                FROM products
            `);


        const [[supplierCount]] =
            await db.query(`
                SELECT COUNT(*) AS total
                FROM suppliers
            `);


        const [[stock]] =
            await db.query(`
                SELECT
                    COALESCE(
                        SUM(quantity),
                        0
                    ) AS total
                FROM products
            `);


        res.render(
            "dashboard",
            {
                productCount:
                    productCount.total,

                supplierCount:
                    supplierCount.total,

                stock:
                    stock.total
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Database connection error"
        );
    }
});


// Health check
app.get("/health", async (req, res) => {

    try {

        await db.query(
            "SELECT 1"
        );

        res.status(200).json({
            status: "healthy",
            database: "connected"
        });

    } catch (error) {

        res.status(500).json({
            status: "unhealthy",
            database: "disconnected"
        });
    }
});


// Routes
app.use(
    "/products",
    productRoutes
);

app.use(
    "/suppliers",
    supplierRoutes
);

app.use(
    "/inventory",
    inventoryRoutes
);


// Start
app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Inventory App running on port ${PORT}`
        );
    }
);
