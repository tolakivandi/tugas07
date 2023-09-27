const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const connection = require("../config/db");

router.get("/", function (req, res) {
  connection.query(
    "SELECT * FROM kartu_keluarga ORDER BY no_kk DESC",
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
    body("alamat").notEmpty(),
    body("rt").notEmpty(),
    body("rw").notEmpty(),
    body("kode_pos").notEmpty(),
    body("desa_kelurahan").notEmpty(),
    body("kecamatan").notEmpty(),
    body("kabupaten_kota").notEmpty(),
    body("provinsi").notEmpty(),
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
      alamat: req.body.alamat,
      rt: req.body.rt,
      rw: req.body.rw,
      kode_pos: req.body.kode_pos,
      desa_kelurahan: req.body.desa_kelurahan,
      kecamatan: req.body.kecamatan,
      kabupaten_kota: req.body.kabupaten_kota,
      provinsi: req.body.provinsi,
    };

    connection.query(
      "INSERT INTO kartu_keluarga SET ?",
      data,
      function (err, result) {
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
      }
    );
  }
);

router.post(
  "/add",
  [
    body("nik").notEmpty(),
    body("nama_lengkap").notEmpty(),
    body("jenis_kelamin").notEmpty(),
    body("tempat_lahir").notEmpty(),
    body("tanggal_lahir").notEmpty(),
    body("agama").notEmpty(),
    body("pendidikan").notEmpty(),
    body("jenis_pekerjaan").notEmpty(),
    body("golongan_darah").notEmpty(),
    body("kewarganegaraan").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const data = {
      nik: req.body.nik,
      nama_lengkap: req.body.nama_lengkap,
      jenis_kelamin: req.body.jenis_kelamin,
      tempat_lahir: req.body.tempat_lahir,
      tanggal_lahir: req.body.tanggal_lahir,
      agama: req.body.agama,
      pendidikan: req.body.pendidikan,
      jenis_pekerjaan: req.body.jenis_pekerjaan,
      golongan_darah: req.body.golongan_darah,
      kewarganegaraan: req.body.kewarganegaraan,
    };

    connection.query("INSERT INTO ktp SET ?", data, function (err, result) {
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

router.get("/:kk", function (req, res) {
  const kk = req.params.kk;
  connection.query(
    "SELECT * FROM kartu_keluarga WHERE no_kk = ?",
    kk,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server error",
          error: err,
        });
      } else if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data berhasil ditemukan",
          data: rows[0], // Hanya satu baris yang diambil karena nik bersifat unik
        });
      }
    }
  );
});

router.get("/:nik", function (req, res) {
  const nik = req.params.nik;
  connection.query(
    "SELECT * FROM ktp WHERE nik = ?",
    nik,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server error",
        });
      } else if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data berhasil ditemukan",
          data: rows[0], // Hanya satu baris yang diambil karena nik bersifat unik
        });
      }
    }
  );
});

router.patch("/update/:no_kk", (req, res) => {
  const no_kk = req.params.no_kk;
  const updatedData = {
    no_kk: req.body.no_kk,
    alamat: req.body.alamat,
    rt: req.body.rt,
    rw: req.body.rw,
    kode_pos: req.body.kode_pos,
    desa_kelurahan: req.body.desa_kelurahan,
    kecamatan: req.body.kecamatan,
    kabupaten_kota: req.body.kabupaten_kota,
    provinsi: req.body.provinsi,
  };

  connection.query(
    "UPDATE kartu_keluarga SET ? WHERE no_kk = ?",
    [updatedData, no_kk],
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

router.delete("/delete/:no_kk", (req, res) => {
  const no_kk = req.params.no_kk;

  connection.query(
    "DELETE FROM kartu_keluarga WHERE no_kk = ?",
    no_kk,
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
