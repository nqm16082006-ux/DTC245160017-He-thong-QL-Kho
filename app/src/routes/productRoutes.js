const express = require("express");
const router = express.Router();

const db = require("../config/database");


// ===============================
// DANH SÁCH + SEARCH + FILTER
// SORT + PAGINATION
// ===============================
router.get("/", async (req, res) => {
    try {
        const search = (req.query.search || "").trim();
        const supplier = req.query.supplier || "";
        const stock = req.query.stock || "";

        const sort = req.query.sort || "newest";
        const order = req.query.order === "asc" ? "asc" : "desc";

        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = 10;
        const offset = (page - 1) * limit;


        // Chỉ cho phép các cột sort này
        const allowedSort = {
            newest: "p.id",
            name: "p.name",
            price: "p.price",
            quantity: "p.quantity",
            sku: "p.sku"
        };

        const sortColumn =
            allowedSort[sort] || "p.id";

        const sortDirection =
            order === "asc" ? "ASC" : "DESC";


        // WHERE động nhưng VALUE vẫn parameterized
        let where = "WHERE 1=1";
        const params = [];


        // Search theo tên hoặc SKU
        if (search) {
            where += `
                AND (
                    p.name LIKE ?
                    OR p.sku LIKE ?
                )
            `;

            params.push(
                `%${search}%`,
                `%${search}%`
            );
        }


        // Lọc theo nhà cung cấp
        if (supplier) {
            where += " AND p.supplier_id = ?";
            params.push(supplier);
        }


        // Lọc theo tồn kho
        if (stock === "out") {
            where += " AND p.quantity = 0";
        }

        if (stock === "low") {
            where += `
                AND p.quantity BETWEEN 1 AND 10
            `;
        }

        if (stock === "available") {
            where += " AND p.quantity > 10";
        }


        // Đếm tổng số bản ghi
        const [countRows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM products p
            ${where}
            `,
            params
        );

        const totalItems =
            countRows[0].total;

        const totalPages =
            Math.max(
                Math.ceil(totalItems / limit),
                1
            );


        // Lấy dữ liệu
        const queryParams = [
            ...params,
            limit,
            offset
        ];

        const [products] = await db.query(
            `
            SELECT
                p.id,
                p.name,
                p.sku,
                p.price,
                p.quantity,
                p.supplier_id,
                p.created_at,
                s.name AS supplier_name
            FROM products p
            LEFT JOIN suppliers s
                ON p.supplier_id = s.id
            ${where}
            ORDER BY ${sortColumn} ${sortDirection}
            LIMIT ?
            OFFSET ?
            `,
            queryParams
        );


        const [suppliers] = await db.query(
            `
            SELECT id, name
            FROM suppliers
            ORDER BY name ASC
            `
        );


        res.render(
            "products/index",
            {
                products,
                suppliers,

                filters: {
                    search,
                    supplier,
                    stock,
                    sort,
                    order
                },

                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages
                }
            }
        );

    } catch (error) {
        console.error(
            "Lỗi tải sản phẩm:",
            error
        );

        res.status(500).send(
            "Lỗi tải danh sách sản phẩm"
        );
    }
});


// ===============================
// THÊM SẢN PHẨM
// ===============================
router.post("/add", async (req, res) => {

    const {
        name,
        sku,
        price,
        supplier_id
    } = req.body;


    if (
        !name ||
        !sku ||
        price === undefined
    ) {
        return res.status(400).send(
            "Thiếu thông tin sản phẩm"
        );
    }


    if (Number(price) < 0) {
        return res.status(400).send(
            "Giá sản phẩm không hợp lệ"
        );
    }


    try {

        await db.query(
            `
            INSERT INTO products
            (
                name,
                sku,
                price,
                quantity,
                supplier_id
            )
            VALUES (?, ?, ?, 0, ?)
            `,
            [
                name.trim(),
                sku.trim(),
                price,
                supplier_id || null
            ]
        );

        res.redirect("/products");

    } catch (error) {

        console.error(
            "Lỗi thêm sản phẩm:",
            error
        );

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).send(
                "SKU đã tồn tại"
            );
        }

        res.status(500).send(
            "Không thể thêm sản phẩm"
        );
    }
});


// ===============================
// TRANG SỬA
// QUAN TRỌNG: đặt trước /:id
// ===============================
router.get("/:id/edit", async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT *
            FROM products
            WHERE id = ?
            `,
            [req.params.id]
        );


        if (rows.length === 0) {
            return res.status(404).send(
                "Không tìm thấy sản phẩm"
            );
        }


        const [suppliers] = await db.query(
            `
            SELECT id, name
            FROM suppliers
            ORDER BY name ASC
            `
        );


        res.render(
            "products/edit",
            {
                product: rows[0],
                suppliers
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Lỗi tải sản phẩm"
        );
    }
});


// ===============================
// CẬP NHẬT SẢN PHẨM
// KHÔNG UPDATE quantity
// ===============================
router.post("/:id/edit", async (req, res) => {

    const {
        name,
        sku,
        price,
        supplier_id
    } = req.body;


    if (
        !name ||
        !sku ||
        price === undefined
    ) {
        return res.status(400).send(
            "Thông tin không hợp lệ"
        );
    }


    if (Number(price) < 0) {
        return res.status(400).send(
            "Giá không hợp lệ"
        );
    }


    try {

        const [result] = await db.query(
            `
            UPDATE products
            SET
                name = ?,
                sku = ?,
                price = ?,
                supplier_id = ?
            WHERE id = ?
            `,
            [
                name.trim(),
                sku.trim(),
                price,
                supplier_id || null,
                req.params.id
            ]
        );


        if (result.affectedRows === 0) {
            return res.status(404).send(
                "Không tìm thấy sản phẩm"
            );
        }


        res.redirect(
            `/products/${req.params.id}`
        );

    } catch (error) {

        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).send(
                "SKU đã tồn tại"
            );
        }

        res.status(500).send(
            "Không thể cập nhật sản phẩm"
        );
    }
});


// ===============================
// XEM CHI TIẾT
// ===============================
router.get("/:id", async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                p.*,
                s.name AS supplier_name,
                s.phone AS supplier_phone,
                s.email AS supplier_email
            FROM products p
            LEFT JOIN suppliers s
                ON p.supplier_id = s.id
            WHERE p.id = ?
            `,
            [req.params.id]
        );


        if (rows.length === 0) {
            return res.status(404).send(
                "Không tìm thấy sản phẩm"
            );
        }


        const [transactions] =
            await db.query(
                `
                SELECT
                    transaction_type,
                    quantity,
                    note,
                    created_at
                FROM inventory_transactions
                WHERE product_id = ?
                ORDER BY id DESC
                LIMIT 20
                `,
                [req.params.id]
            );


        res.render(
            "products/detail",
            {
                product: rows[0],
                transactions
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Lỗi tải chi tiết sản phẩm"
        );
    }
});


// ===============================
// XÓA SẢN PHẨM
// ===============================
router.post("/delete/:id", async (req, res) => {

    try {

        await db.query(
            `
            DELETE FROM products
            WHERE id = ?
            `,
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
