const express = require("express");
const router = express.Router();

const db = require("../config/database");


// Trang nhập / xuất kho
router.get("/", async (req, res) => {

    try {

        const [products] = await db.query(`
            SELECT *
            FROM products
            ORDER BY name
        `);

        const [transactions] = await db.query(`
            SELECT
                t.id,
                p.name AS product_name,
                p.sku,
                t.transaction_type,
                t.quantity,
                t.note,
                t.created_at
            FROM inventory_transactions t
            JOIN products p
                ON t.product_id = p.id
            ORDER BY t.id DESC
            LIMIT 50
        `);

        res.render(
            "inventory/index",
            {
                products,
                transactions,
                message: req.query.message || null,
                error: req.query.error || null
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Lỗi tải dữ liệu kho"
        );
    }
});


// NHẬP KHO
router.post("/import", async (req, res) => {

    const productId = req.body.product_id;

    const quantity =
        parseInt(req.body.quantity);

    const note = req.body.note || "";

    if (!quantity || quantity <= 0) {

        return res.redirect(
            "/inventory?error=Số lượng nhập phải lớn hơn 0"
        );
    }


    const connection =
        await db.getConnection();

    try {

        await connection.beginTransaction();


        await connection.query(
            `
            UPDATE products
            SET quantity = quantity + ?
            WHERE id = ?
            `,
            [
                quantity,
                productId
            ]
        );


        await connection.query(
            `
            INSERT INTO inventory_transactions
            (
                product_id,
                transaction_type,
                quantity,
                note
            )
            VALUES (?, 'IMPORT', ?, ?)
            `,
            [
                productId,
                quantity,
                note
            ]
        );


        await connection.commit();

        res.redirect(
            "/inventory?message=Nhập kho thành công"
        );

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.redirect(
            "/inventory?error=Nhập kho thất bại"
        );

    } finally {

        connection.release();
    }
});


// XUẤT KHO
router.post("/export", async (req, res) => {

    const productId = req.body.product_id;

    const quantity =
        parseInt(req.body.quantity);

    const note = req.body.note || "";

    if (!quantity || quantity <= 0) {

        return res.redirect(
            "/inventory?error=Số lượng xuất phải lớn hơn 0"
        );
    }


    const connection =
        await db.getConnection();

    try {

        await connection.beginTransaction();


        const [rows] =
            await connection.query(
                `
                SELECT quantity
                FROM products
                WHERE id = ?
                FOR UPDATE
                `,
                [productId]
            );


        if (rows.length === 0) {

            throw new Error(
                "Không tìm thấy sản phẩm"
            );
        }


        if (
            rows[0].quantity < quantity
        ) {

            await connection.rollback();

            return res.redirect(
                "/inventory?error=Không đủ hàng trong kho"
            );
        }


        await connection.query(
            `
            UPDATE products
            SET quantity = quantity - ?
            WHERE id = ?
            `,
            [
                quantity,
                productId
            ]
        );


        await connection.query(
            `
            INSERT INTO inventory_transactions
            (
                product_id,
                transaction_type,
                quantity,
                note
            )
            VALUES (?, 'EXPORT', ?, ?)
            `,
            [
                productId,
                quantity,
                note
            ]
        );


        await connection.commit();

        res.redirect(
            "/inventory?message=Xuất kho thành công"
        );

    } catch (error) {

        try {
            await connection.rollback();
        } catch {}

        console.error(error);

        res.redirect(
            "/inventory?error=Xuất kho thất bại"
        );

    } finally {

        connection.release();
    }
});


module.exports = router;
