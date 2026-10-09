const express = require("express");
const router = express.Router();

const db = require("../config/database");


// =================================
// DANH SÁCH + SEARCH + SORT + PAGE
// =================================
router.get("/", async (req, res) => {

    try {

        const search =
            (req.query.search || "").trim();

        const sort =
            req.query.sort || "newest";

        const order =
            req.query.order === "asc"
                ? "asc"
                : "desc";


        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = 10;
        const offset =
            (page - 1) * limit;


        const allowedSort = {
            newest: "id",
            name: "name",
            email: "email"
        };


        const sortColumn =
            allowedSort[sort] || "id";

        const sortDirection =
            order === "asc"
                ? "ASC"
                : "DESC";


        let where = "WHERE 1=1";

        const params = [];


        if (search) {

            where += `
                AND (
                    name LIKE ?
                    OR phone LIKE ?
                    OR email LIKE ?
                    OR address LIKE ?
                )
            `;

            params.push(
                `%${search}%`,
                `%${search}%`,
                `%${search}%`,
                `%${search}%`
            );
        }


        const [countRows] =
            await db.query(
                `
                SELECT COUNT(*) AS total
                FROM suppliers
                ${where}
                `,
                params
            );


        const totalItems =
            countRows[0].total;

        const totalPages =
            Math.max(
                Math.ceil(
                    totalItems / limit
                ),
                1
            );


        const [suppliers] =
            await db.query(
                `
                SELECT *
                FROM suppliers
                ${where}
                ORDER BY
                    ${sortColumn}
                    ${sortDirection}
                LIMIT ?
                OFFSET ?
                `,
                [
                    ...params,
                    limit,
                    offset
                ]
            );


        res.render(
            "suppliers/index",
            {
                suppliers,

                filters: {
                    search,
                    sort,
                    order
                },

                pagination: {
                    page,
                    totalItems,
                    totalPages
                }
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Lỗi tải danh sách nhà cung cấp"
        );
    }
});


// ===============================
// THÊM
// ===============================
router.post("/add", async (req, res) => {

    const {
        name,
        phone,
        email,
        address
    } = req.body;


    if (!name) {
        return res.status(400).send(
            "Tên nhà cung cấp là bắt buộc"
        );
    }


    try {

        await db.query(
            `
            INSERT INTO suppliers
            (
                name,
                phone,
                email,
                address
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                name.trim(),
                phone || null,
                email || null,
                address || null
            ]
        );

        res.redirect("/suppliers");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Không thể thêm nhà cung cấp"
        );
    }
});


// ===============================
// TRANG SỬA
// ===============================
router.get("/:id/edit", async (req, res) => {

    try {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM suppliers
                WHERE id = ?
                `,
                [req.params.id]
            );


        if (rows.length === 0) {
            return res.status(404).send(
                "Không tìm thấy nhà cung cấp"
            );
        }


        res.render(
            "suppliers/edit",
            {
                supplier: rows[0]
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Lỗi tải nhà cung cấp"
        );
    }
});


// ===============================
// CẬP NHẬT
// ===============================
router.post("/:id/edit", async (req, res) => {

    const {
        name,
        phone,
        email,
        address
    } = req.body;


    if (!name) {
        return res.status(400).send(
            "Tên nhà cung cấp là bắt buộc"
        );
    }


    try {

        const [result] =
            await db.query(
                `
                UPDATE suppliers
                SET
                    name = ?,
                    phone = ?,
                    email = ?,
                    address = ?
                WHERE id = ?
                `,
                [
                    name.trim(),
                    phone || null,
                    email || null,
                    address || null,
                    req.params.id
                ]
            );


        if (result.affectedRows === 0) {
            return res.status(404).send(
                "Không tìm thấy nhà cung cấp"
            );
        }


        res.redirect(
            `/suppliers/${req.params.id}`
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Không thể cập nhật nhà cung cấp"
        );
    }
});


// ===============================
// XEM CHI TIẾT
// ===============================
router.get("/:id", async (req, res) => {

    try {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM suppliers
                WHERE id = ?
                `,
                [req.params.id]
            );


        if (rows.length === 0) {
            return res.status(404).send(
                "Không tìm thấy nhà cung cấp"
            );
        }


        const [products] =
            await db.query(
                `
                SELECT
                    id,
                    sku,
                    name,
                    price,
                    quantity
                FROM products
                WHERE supplier_id = ?
                ORDER BY id DESC
                `,
                [req.params.id]
            );


        res.render(
            "suppliers/detail",
            {
                supplier: rows[0],
                products
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Lỗi tải nhà cung cấp"
        );
    }
});


// ===============================
// XÓA
// ===============================
router.post("/delete/:id", async (req, res) => {

    try {

        await db.query(
            `
            DELETE FROM suppliers
            WHERE id = ?
            `,
            [req.params.id]
        );

        res.redirect("/suppliers");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Không thể xóa nhà cung cấp"
        );
    }
});


module.exports = router;
