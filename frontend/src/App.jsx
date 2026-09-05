import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Auth & Common Pages
import Login from './pages/Login'

// Department Pages
import PostProblem from './pages/department/PostProblem'
import ReviewApplications from './pages/department/ReviewApplications'
import PilotTracker from './pages/department/PilotTracker'
import ConvertToContract from './pages/department/ConvertToContract'

// Startup Pages
import BrowseProblems from './pages/startup/BrowseProblems'
import ApplyToProblem from './pages/startup/ApplyToProblem'
import SubmitMilestone from './pages/startup/SubmitMilestone'

// Route Guard Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Department Routes (Protected) */}
          <Route path="/department/post" element={<ProtectedRoute><PostProblem /></ProtectedRoute>} />
          <Route path="/department/reviews" element={<ProtectedRoute><ReviewApplications /></ProtectedRoute>} />
          <Route path="/department/tracker" element={<ProtectedRoute><PilotTracker /></ProtectedRoute>} />
          <Route path="/department/contract" element={<ProtectedRoute><ConvertToContract /></ProtectedRoute>} />

          {/* Startup Routes (Protected) */}
          <Route path="/startup/browse" element={<ProtectedRoute><BrowseProblems /></ProtectedRoute>} />
          <Route path="/startup/apply" element={<ProtectedRoute><ApplyToProblem /></ProtectedRoute>} />
          <Route path="/startup/milestones" element={<ProtectedRoute><SubmitMilestone /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App