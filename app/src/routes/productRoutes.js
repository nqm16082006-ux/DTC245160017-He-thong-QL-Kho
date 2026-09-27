const express = require("express");
const router = express.Router();

const db = require("../config/database");


// Danh sách sản phẩm
router.get("/", async (req, res) => {

    try {

        const [products] = await db.query(`
            SELECT
                p.id,
                p.name,
                p.sku,
                p.price,
                p.quantity,
                s.name AS supplier_name
            FROM products p
            LEFT JOIN suppliers s
                ON p.supplier_id = s.id
            ORDER BY p.id DESC
        `);

        const [suppliers] = await db.query(
            "SELECT * FROM suppliers ORDER BY name"
        );

        res.render(
            "products/index",
            {
                products,
                suppliers
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Lỗi tải danh sách sản phẩm"
        );
    }
});


// Thêm sản phẩm
router.post("/add", async (req, res) => {

    const {
        name,
        sku,
        price,
        supplier_id
    } = req.body;

    try {

        await db.query(
            `INSERT INTO products
            (name, sku, price, quantity, supplier_id)
            VALUES (?, ?, ?, 0, ?)`,
            [
                name,
                sku,
                price,
                supplier_id || null
            ]
        );

        res.redirect("/products");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Không thể thêm sản phẩm"
        );
    }
});


// Xóa sản phẩm
router.post("/delete/:id", async (req, res) => {

    try {

        await db.query(
            "DELETE FROM products WHERE id = ?",
            [req.params.id]
        );

        res.redirect("/products");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Không thể xóa sản phẩm"
        );
    }
});


module.exports = router;
