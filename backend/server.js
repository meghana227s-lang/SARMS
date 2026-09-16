const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;


// ===============================
// HOME ROUTE
// ===============================

app.get('/', (req, res) => {
    res.send('SARMS Backend is running!');
});


// ===============================
// BACKEND TEST ROUTE
// ===============================

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Frontend connected to SARMS backend successfully!'
    });
});


// ===============================
// LOGIN ROUTE
// ===============================

app.post('/api/login', async (req, res) => {

    const { email, password } = req.body;

    try {

        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        // User not found
        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });

        }

        const user = users[0];

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        // Password incorrect
        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });

        }

        // Login successful
        res.json({

            success: true,

            message: 'Login successful',

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error('LOGIN ERROR:', error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }

});
// ===============================
// DEPARTMENT ROUTES
// ===============================

// Get all departments
app.get('/api/departments', async (req, res) => {

    try {

        const [departments] = await db.query(
            'SELECT * FROM departments ORDER BY id DESC'
        );

        res.json({
            success: true,
            departments: departments
        });

    } catch (error) {

        console.error('GET DEPARTMENTS ERROR:', error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }

});


// Add a new department
app.post('/api/departments', async (req, res) => {

    const { department_name, department_code } = req.body;

    if (!department_name || !department_code) {

        return res.status(400).json({
            success: false,
            message: 'Department name and code are required'
        });

    }

    try {

        const [result] = await db.query(
            'INSERT INTO departments (department_name, department_code) VALUES (?, ?)',
            [department_name, department_code]
        );

        res.status(201).json({
            success: true,
            message: 'Department added successfully',
            department: {
                id: result.insertId,
                department_name: department_name,
                department_code: department_code
            }
        });

    } catch (error) {

        console.error('ADD DEPARTMENT ERROR:', error);

        if (error.code === 'ER_DUP_ENTRY') {

            return res.status(400).json({
                success: false,
                message: 'Department code already exists'
            });

        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }

});

// ===============================
// START SERVER
// ===============================

// ===============================
// FACULTY ROUTES
// ===============================

// ===============================
// FACULTY ROUTES
// ===============================

// Get all faculty
app.get('/api/faculty', async (req, res) => {

    try {

        const [faculty] = await db.query(`
            SELECT
                faculty.id,
                faculty.employee_id,
                users.name,
                users.email,
                faculty.expertise,
                faculty.workload,
                departments.department_name,
                departments.department_code
            FROM faculty
            JOIN users
                ON faculty.user_id = users.id
            JOIN departments
                ON faculty.department_id = departments.id
            ORDER BY faculty.id DESC
        `);

        res.json({
            success: true,
            faculty: faculty
        });

    } catch (error) {

        console.error('GET FACULTY ERROR:', error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }

});


// Add a new faculty
app.post('/api/faculty', async (req, res) => {

    const {
        name,
        email,
        password,
        employee_id,
        department_id,
        expertise
    } = req.body;

    if (
        !name ||
        !email ||
        !password ||
        !employee_id ||
        !department_id
    ) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, password, employee ID and department are required'
        });
    }

    try {

        // Check whether email already exists
        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Check whether employee ID already exists
        const [existingFaculty] = await db.query(
            'SELECT id FROM faculty WHERE employee_id = ?',
            [employee_id]
        );

        if (existingFaculty.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user account
        const [userResult] = await db.query(
            `INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, 'faculty')`,
            [name, email, hashedPassword]
        );

        // Create faculty record
        const [facultyResult] = await db.query(
            `INSERT INTO faculty
            (user_id, department_id, employee_id, expertise)
            VALUES (?, ?, ?, ?)`,
            [
                userResult.insertId,
                department_id,
                employee_id,
                expertise || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Faculty added successfully',
            faculty: {
                id: facultyResult.insertId,
                user_id: userResult.insertId,
                name: name,
                email: email,
                employee_id: employee_id,
                department_id: department_id,
                expertise: expertise || null
            }
        });

    } catch (error) {

        console.error('ADD FACULTY ERROR:', error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }

});

    
       
    
app.listen(PORT, () => {

    console.log(
        `SARMS Backend running on http://localhost:${PORT}`
    );

});