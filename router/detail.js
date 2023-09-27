const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const connection = require("../config/db");

router.get("/", function (req, res) {
  connection.query(
    "SELECT * FROM detail_kk ORDER BY id_detail DESC",
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server error",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data berhasil",
          data: rows,
        });
      }
    }
  );
});

router.post(
  "/add",
  [
    body("no_kk").notEmpty(),
    body("nik").notEmpty(),
    body("status_hubungan_dalam_keluarga").notEmpty(),
    body("ayah").notEmpty(),
    body("ibu").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const data = {
      no_kk: req.body.no_kk,
      nik: req.body.nik,
      status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
      ayah: req.body.ayah,
      ibu: req.body.ibu,
    };

    connection.query("INSERT INTO detail_kk SET ?", data, function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server error",
        });
      } else {
        data.id = result.insertId;
        return res.status(201).json({
          status: true,
          message: "Data berhasil ditambahkan",
          data: data,
        });
      }
    });
  }
);


router.patch("/update/:id_detail", (req, res) => {
  const id_detail = req.params.id_detail;
  const updatedData = {
    no_kk: req.body.no_kk,
    nik: req.body.nik,
    status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
    ayah: req.body.ayah,
    ibu: req.body.ibu,
  };

  connection.query(
    "UPDATE detail_kk SET ? WHERE id_detail = ?",
    [updatedData, id_detail],
    function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server error",
        });
      } else if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data berhasil diupdate",
        });
      }
    }
  );
});

router.delete("/delete/:id_detail", (req, res) => {
  const id_detail = req.params.id_detail;

  connection.query(
    "DELETE FROM detail_kk WHERE id_detail = ?",
    id_detail,
    function (err, result) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server error",
        });
      } else if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data berhasil dihapus",
        });
      }
    }
  );
});


module.exports = router;
