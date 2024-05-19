const pool = require('../../db');
const queries = require('./queries');

const getStudents = (req, res) => {
    pool.query(queries.getStudents, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getStudentById = (req, res) => {

    const id = parseInt(req.params.id);

    pool.query(queries.getStudentById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const addStudent = (req, res) => {

    const { name, email, age, dob } = req.body;

    // check if emails is already exist
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (error) {
            console.error("Error executing query", error.stack);
            return res.status(500).send("Internal server error");
        }
        if (results.rows.length) {
            return res.status(400).send("Email already exists.");
        }

        // add student to database
        pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
            if (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal server error");
            }
            return res.status(200).send("Student added successfully");
        });
    });

    
};

const deleteStudent = (req, res) =>  {
    const id = parseInt(req.params.id);

    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if (noStudentFound) {
            res.send("Student does not exist in database");
        };
        
        pool.query(queries.deleteStudent, [id], (error, results) => {
            if (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal server error");
            }
            return res.status(200).send("Student delete successfully");
        });
    });
};

const updateStudent = (req, res) => {
    const id = parseInt(req.params.id)
    const { name } = req.body

    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if (noStudentFound) {
            res.send("Student does not exist in database");
        };

        pool.query(queries.updateStudent, [name, id], (error, results) => {
            if (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal server error");
            }
            return res.status(200).send("Updated successfully")
        });
    });
        
};

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
};