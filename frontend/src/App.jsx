import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [backendMessage, setBackendMessage] = useState('Connecting to backend...')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [userName, setUserName] = useState('')
  const [departments, setDepartments] = useState([])
const [departmentName, setDepartmentName] = useState('')
const [departmentCode, setDepartmentCode] = useState('')
const [departmentMessage, setDepartmentMessage] = useState('') 
const [faculty, setFaculty] = useState([])
const [facultyName, setFacultyName] = useState('')
const [facultyEmail, setFacultyEmail] = useState('')
const [facultyPassword, setFacultyPassword] = useState('')
const [employeeId, setEmployeeId] = useState('')
const [facultyDepartment, setFacultyDepartment] = useState('')
const [facultyExpertise, setFacultyExpertise] = useState('')
const [facultyMessage, setFacultyMessage] = useState('')
  const handleLogin = async (e) => {
  e.preventDefault()

  setLoginMessage('Logging in...')

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }) 
    })

    const data = await response.json()

    if (response.ok) {
  console.log('Logged in user:', data.user)

 setUserRole(data.user.role)
setUserName(data.user.name)
setIsLoggedIn(true)

if (data.user.role === 'admin') {
  loadDepartments()
}
} 

  } catch (error) {
    console.error(error)
    setLoginMessage('Unable to connect to server')
  }
}
const loadDepartments = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/departments')
    const data = await response.json()

    if (data.success) {
      setDepartments(data.departments)
    }
  } catch (error) {
    console.error('Error loading departments:', error)
  }
}
const loadFaculty = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/faculty')
    const data = await response.json()

    if (data.success) {
      setFaculty(data.faculty)
    }
  } catch (error) {
    console.error('Error loading faculty:', error)
  }
}
const handleAddDepartment = async (e) => {
  e.preventDefault()

  setDepartmentMessage('Adding department...')

  try {
    const response = await fetch('http://localhost:5000/api/departments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        department_name: departmentName,
        department_code: departmentCode
      })
    })

    const data = await response.json()

    if (response.ok) {
      setDepartmentMessage('Department added successfully!')

      setDepartmentName('')
      setDepartmentCode('')

      loadDepartments()
    } else {
      setDepartmentMessage(data.message)
    }

  } catch (error) {
    console.error(error)
    setDepartmentMessage('Unable to connect to server')
  }
}
const handleAddFaculty = async (e) => {
  e.preventDefault()

  setFacultyMessage('Adding faculty...')

  try {
    const response = await fetch('http://localhost:5000/api/faculty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: facultyName,
        email: facultyEmail,
        password: facultyPassword,
        employee_id: employeeId,
        department_id: facultyDepartment,
        expertise: facultyExpertise
      })
    })

    const data = await response.json()

    if (response.ok) {
      setFacultyMessage('Faculty added successfully!')

      setFacultyName('')
      setFacultyEmail('')
      setFacultyPassword('')
      setEmployeeId('')
      setFacultyDepartment('')
      setFacultyExpertise('')
    } else {
      setFacultyMessage(data.message)
    }

  } catch (error) {
    console.error(error)
    setFacultyMessage('Unable to connect to server')
  }
}
  useEffect(() => {
  fetch('http://localhost:5000/api/test')
    .then(response => response.json())
    .then(data => {
      setBackendMessage(data.message)
    })
    .catch(() => {
      setBackendMessage('Backend connection failed')
    })
  }, [])
  useEffect(() => {
  if (isLoggedIn && userRole === 'admin') {
    loadDepartments()
    loadFaculty()
  }
}, [isLoggedIn, userRole])
 if (isLoggedIn && userRole === 'admin') {
  return (
    <div className="dashboard-page">

      <h1>SARMS Admin Dashboard</h1>

      <h2>Welcome, {userName}! 👋</h2>

      <p>You are logged in as Administrator.</p>

      <div>
        <h3>Department Management</h3>

        <form onSubmit={handleAddDepartment}>

          <div>
            <label>Department Name</label>

            <input
              type="text"
              placeholder="Enter department name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Department Code</label>

            <input
              type="text"
              placeholder="Enter department code"
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            Add Department
          </button>

        </form>

        <p>{departmentMessage}</p>

        <h3>Existing Departments</h3>

        {departments.length === 0 ? (
          <p>No departments available.</p>
        ) : (
          departments.map((department) => (
            <div key={department.id}>
              <strong>{department.department_name}</strong>
              {' - '}
              {department.department_code}
            </div>
          ))
        )}

      </div>
            <div>
        <h3>Faculty Management</h3>

        <form onSubmit={handleAddFaculty}>

          <div>
            <label>Faculty Name</label>

            <input
              type="text"
              placeholder="Enter faculty name"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter faculty email"
              value={facultyEmail}
              onChange={(e) => setFacultyEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter faculty password"
              value={facultyPassword}
              onChange={(e) => setFacultyPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Employee ID</label>

            <input
              type="text"
              placeholder="Enter employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Department</label>

            <select
              value={facultyDepartment}
              onChange={(e) => setFacultyDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>

              {departments.map((department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.department_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Expertise</label>

            <input
              type="text"
              placeholder="Example: Java, Database, Web Development"
              value={facultyExpertise}
              onChange={(e) => setFacultyExpertise(e.target.value)}
            />
          </div>

          <button type="submit">
            Add Faculty
          </button>

        </form>

        <p>{facultyMessage}</p>

        <h3>Existing Faculty</h3>

        {faculty.length === 0 ? (
          <p>No faculty available.</p>
        ) : (
          faculty.map((member) => (
            <div key={member.id}>
              <strong>{member.name}</strong>
              {' - '}
              {member.employee_id}
              {' - '}
              {member.department_name}
            </div>
          ))
        )}

      </div>

    </div>
  )
}
if (isLoggedIn && userRole === 'hod') {
  return (
    <div className="dashboard-page">
      <h1>SARMS HOD Dashboard</h1>
      <h2>Welcome, {userName}! 👋</h2>
      <p>You are logged in as HOD.</p>
    </div>
  )
}

if (isLoggedIn && userRole === 'faculty') {
  return (
    <div className="dashboard-page">
      <h1>SARMS Faculty Dashboard</h1>
      <h2>Welcome, {userName}! 👋</h2>
      <p>You are logged in as Faculty.</p>
    </div>
  )
}

if (isLoggedIn && userRole === 'student') {
  return (
    <div className="dashboard-page">
      <h1>SARMS Student Dashboard</h1>
      <h2>Welcome, {userName}! 👋</h2>
      <p>You are logged in as Student.</p>
    </div>
  )
}
  
  return (
    <div className="login-page">

      <div className="login-box">

        <div className="logo-section">
          <div className="logo">S</div>

          <h1>SARMS</h1>

          <p>
            Smart Academic Resource Management System
          </p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>

          <h2>Welcome Back</h2>

          <p className="login-text">      
        Login to continue to your dashboard
        </p>

          <label>Email</label>

          <input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

           <label>Password</label>

            <input
    type="password"
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <button type="submit">
    Login
  </button>

  <p className="connection-status">
    {backendMessage}
  </p>

  <p className="login-message">
    {loginMessage}
  </p>

</form>

      </div>

    </div>
  )
}

export default App