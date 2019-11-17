const express = require('express')
const router = express()
const modules = require("../modules.js");


// [GET] User Start
router.get('/', (req, res, next) => {

        // Variable
        let response,
            sql_array = [],
            sql = `
        SELECT * FROM user ;
    `;

        modules.db.query(sql, sql_array, function(err, rows, fields) {
            try {
                if (err) throw {
                    code: 500,
                    message: err.message
                }
                if (rows.length == 0) throw {
                    code: 200,
                    message: 'User Tidak Di Temukan'
                }
            } catch (e) {
                response = {
                    status: false,
                    code: e.code,
                    message: e.message
                }
                return next(response);
            }

            response = {
                status: true,
                code: 200,
                data: rows,
            }
            return next(response);

        })

    })
    // [GET] User End

// [POST] Register Start
router.post('/register', (req, res, next) => {

        let response;

        // Validator
        try {
            if (("authorization" in req.headers) || ("authorization" in req.query)) throw {
                code: 200,
                message: "Anda sudah masuk"
            }
            if (!("name" in req.body) || req.body.name.trim() == "") throw {
                code: 200,
                message: "Nama tidak boleh kosong"
            }
            if (!(/^[A-Za-z\s]+$/.test(req.body.name))) throw {
                code: 200,
                message: "Nama tidak valid"
            }
            if (!("email" in req.body) || req.body.email.trim() == "") throw {
                    code: 200,
                    message: "Email tidak boleh kosong"
                }
                // if (!(modules.validator.isEmail(req.body.email))) throw {
                //     code: 200,
                //     message: "Email tidak valid"
                // }
            if (!("password" in req.body) || req.body.password.trim() == "") throw {
                code: 200,
                message: "Password tidak boleh kosong"
            }
        } catch (e) {
            response = {
                status: false,
                code: e.code,
                message: e.message
            }
            return next(response);
        }

        // Variable
        let sql_array = [req.body.email],
            sql = "SELECT *, COUNT(*) as count_user FROM user WHERE email = ?;",
            status_user = "pending",
            token = modules.uuidv1(),
            password = modules.crypto.AES.encrypt(req.body.password, process.env.SALT).toString();

        modules.db.query(sql, sql_array, function(err, rows, fields) {
            try {
                if (err) throw {
                    code: 500,
                    message: err.message
                }
                if (rows[0]["count_user"] != 0) throw {
                    code: 200,
                    message: "Email sudah digunakan"
                }
            } catch (e) {
                response = {
                    status: false,
                    code: e.code,
                    message: e.message
                }
                return next(response);
            }

            sql_array = [req.body.username.trim(), req.body.name.trim(), req.body.email.trim().toLowerCase(), status_user, password, token]
            sql = "INSERT INTO user(username, name, email, status_user , password, token) VALUES (?, ?, ?, ?, ?, ?);"
            modules.db.query(sql, sql_array, function(err, rows, fields) {
                try {
                    if (err) throw {
                        code: 500,
                        message: err.message
                    }
                } catch (e) {
                    response = {
                        status: false,
                        code: e.code,
                        message: e.message
                    }
                    return next(response);
                }

                token = modules.jwt.sign({
                    token: token
                }, process.env.SALT)

                response = {
                    status: true,
                    code: 200,
                    data: {
                        token: token
                    }
                }
                return next(response);
            })
        });
    })
    // [POST] Register End

// [POST] Login Start
router.post('/login', (req, res, next) => {

        let response;

        // Validator
        try {
            if (("authorization" in req.headers) || ("authorization" in req.query)) throw {
                code: 200,
                message: "Anda sudah masuk"
            }
            if (!("email" in req.body) || req.body.email.trim() == "") throw {
                code: 200,
                message: "Email tidak boleh kosong"
            }
            if (!("password" in req.body) || req.body.password.trim() == "") throw {
                code: 200,
                message: "Password tidak boleh kosong"
            }
        } catch (e) {
            response = {
                status: false,
                code: e.code,
                message: e.message
            }
            return next(response);
        }

        // Variable
        let sql_array = [req.body.email],
            sql = "SELECT *, COUNT(*) as count_user FROM user WHERE email = ?;",
            token

        modules.db.query(sql, sql_array, function(err, rows, fields) {
            try {
                if (err) throw {
                    code: 500,
                    message: err.message
                }
                if (rows[0]["count_user"] == 0 || modules.crypto.AES.decrypt(rows[0].password, process.env.SALT).toString(modules.crypto.enc.Utf8) != req.body.password) throw {
                    code: 200,
                    message: "Email atau Password salah"
                }
            } catch (e) {
                response = {
                    status: false,
                    code: e.code,
                    message: e.message
                }
                return next(response);
            }

            token = modules.jwt.sign({
                token: rows[0]["token"]
            }, process.env.SALT)

            response = {
                status: true,
                code: 200,
                data: token
            }
            return next(response);
        });
    })
    // [POST] Login End


// Add user
// [POST] Register Start
router.post('/backend/register', (req, res, next) => {

        let response;

        // Validator
        try {
            if (!("name" in req.body) || req.body.name.trim() == "") throw {
                code: 200,
                message: "Nama tidak boleh kosong"
            }
            if (!(/^[A-Za-z\s]+$/.test(req.body.name))) throw {
                code: 200,
                message: "Nama tidak valid"
            }
            if (!("email" in req.body) || req.body.email.trim() == "") throw {
                    code: 200,
                    message: "Email tidak boleh kosong"
                }
                // if (!(modules.validator.isEmail(req.body.email))) throw {
                //     code: 200,
                //     message: "Email tidak valid"
                // }
            if (!("password" in req.body) || req.body.password.trim() == "") throw {
                code: 200,
                message: "Password tidak boleh kosong"
            }
        } catch (e) {
            response = {
                status: false,
                code: e.code,
                message: e.message
            }
            return next(response);
        }

        // Variable
        let sql_array = [req.body.email],
            sql = "SELECT *, COUNT(*) as count_user FROM user WHERE email = ?;",
            token = modules.uuidv1(),
            password = modules.crypto.AES.encrypt(req.body.password, process.env.SALT).toString();

        modules.db.query(sql, sql_array, function(err, rows, fields) {
            try {
                if (err) throw {
                    code: 500,
                    message: err.message
                }
                if (rows[0]["count_user"] != 0) throw {
                    code: 200,
                    message: "Email sudah digunakan"
                }
            } catch (e) {
                response = {
                    status: false,
                    code: e.code,
                    message: e.message
                }
                return next(response);
            }

            sql_array = [req.body.username.trim(), req.body.name.trim(), req.body.email.trim().toLowerCase(), req.body.status_user.trim(), password, token]
            sql = "INSERT INTO user(username, name, email, status_user , password, token) VALUES (?, ?, ?, ?, ?, ?);"
            modules.db.query(sql, sql_array, function(err, rows, fields) {
                try {
                    if (err) throw {
                        code: 500,
                        message: err.message
                    }
                } catch (e) {
                    response = {
                        status: false,
                        code: e.code,
                        message: e.message
                    }
                    return next(response);
                }

                token = modules.jwt.sign({
                    token: token
                }, process.env.SALT)

                response = {
                    status: true,
                    code: 200,
                    data: {
                        token: token
                    }
                }
                return next(response);
            })
        });
    })
    // [POST] Register End

// [PUT] User Start
router.put('/edit/:id_user', (req, res, next) => {
        // Variable
        let response;

        // Validator
        try {
            if (!("id_user" in req.params) || req.params.id_user.trim() == "") throw {
                code: 200,
                message: "Id User User kosong"
            }
        } catch (e) {
            console.log(e)
            response = {
                status: false,
                code: e.code,
                message: e.message
            }
            return next(response);
        }

        let sql_array = [req.body.status_user.trim(), req.params.id_user.trim()]
        sql = `
           UPDATE user SET status_user = ? WHERE id_user = ?;
           `;

        modules.db.query(sql, sql_array, function(err, rows, fields) {
            try {
                if (err) throw {
                    code: 500,
                    message: err.message
                }
            } catch (e) {
                response = {
                    status: false,
                    code: e.code,
                    message: e.message
                }
                return next(response);
            }

            response = {
                status: true,
                code: 200,
                data: {
                    Product: rows,
                }
            }
            return next(response);

        })

    })
    // [PUT] User End



// [DELETE] User Start
router.delete('/delete/:id_user', (req, res, next) => {
        // Variable
        let response;
        // Validator
        try {
            if (!("id_user" in req.params) || req.params.id_user.trim() == "") throw {
                code: 200,
                message: "Id user tidak boleh kosong"
            }
        } catch (e) {
            response = {
                status: false,
                code: e.code,
                message: e.message
            }
            return next(response);
        }

        let sql_array = [req.params.id_user.trim()]
        sql = `DELETE FROM user WHERE id_user = ?`;
        modules.db.query(sql, sql_array, function(err, rows, fields) {
            try {
                if (err) throw {
                    code: 500,
                    message: err.message
                }
            } catch (e) {
                response = {
                    status: false,
                    code: e.code,
                    message: e.message
                }
                return next(response);
            }

            response = {
                status: true,
                code: 200,
                data: {}
            }
            return next(response);

        })
    })
    // [DELETE] User End


// [GET] User Start
router.get('/me', modules.function.isAuthenticated, (req, res, next) => {
        return next({
            status: true,
            code: 200,
            data: req.user,
        });
    })
    // [GET] User End

module.exports = router;