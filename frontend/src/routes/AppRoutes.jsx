import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import EmployerLayout from '../layouts/EmployerLayout';
import JobSeekerLayout from '../layouts/JobSeekerLayout';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import EmployerDashboard from '../pages/employer/EmployerDashboard';
import CreateJob from '../pages/employer/CreateJob';
import EditJob from '../pages/employer/EditJob';
import MyJobs from '../pages/employer/MyJobs';
import ViewApplicants from '../pages/employer/ViewApplicants';
import JobSeekerDashboard from '../pages/jobseeker/JobSeekerDashboard';
import BrowseJobs from '../pages/jobseeker/BrowseJobs';
import JobDetails from '../pages/jobseeker/JobDetails';
import ApplyJob from '../pages/jobseeker/ApplyJob';
import MyApplications from '../pages/jobseeker/MyApplications';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="jobs" element={<BrowseJobs />} />
              <Route path="jobs/:id" element={<JobDetails />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
            <Route element={<EmployerLayout />}>
              <Route path="employer/dashboard" element={<EmployerDashboard />} />
              <Route path="employer/jobs" element={<MyJobs />} />
              <Route path="employer/jobs/create" element={<CreateJob />} />
              <Route path="employer/jobs/:id/edit" element={<EditJob />} />
              <Route path="employer/jobs/:id/applicants" element={<ViewApplicants />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['jobseeker']} />}>
            <Route element={<JobSeekerLayout />}>
              <Route path="jobseeker/dashboard" element={<JobSeekerDashboard />} />
              <Route path="jobseeker/applications" element={<MyApplications />} />
              <Route path="jobs/:id/apply" element={<ApplyJob />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
