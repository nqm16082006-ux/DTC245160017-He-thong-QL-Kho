
const express = require("express");
const router = express.Router();

const db = require("../config/database");


// Danh sách nhà cung cấp
router.get("/", async (req, res) => {
    try {
        const [suppliers] = await db.query(
            "SELECT * FROM suppliers ORDER BY id DESC"
        );

        res.render("suppliers/index", {
            suppliers
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi tải danh sách nhà cung cấp");
    }
});


// Thêm nhà cung cấp
router.post("/add", async (req, res) => {

    const {
        name,
        phone,
        email,
        address
    } = req.body;

    try {

        await db.query(
            `INSERT INTO suppliers
            (name, phone, email, address)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                phone,
                email,
                address
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


// Xóa nhà cung cấp
router.post("/delete/:id", async (req, res) => {

    try {

        await db.query(
            "DELETE FROM suppliers WHERE id = ?",
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
