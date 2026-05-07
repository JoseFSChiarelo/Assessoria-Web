import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import { AppLayout } from "../layouts/AppLayout.jsx";
import { AssessmentCreate } from "../pages/AssessmentCreate.jsx";
import { AssessmentEdit } from "../pages/AssessmentEdit.jsx";
import { AssessmentHistory } from "../pages/AssessmentHistory.jsx";
import { AssessmentView } from "../pages/AssessmentView.jsx";
import { Dashboard } from "../pages/Dashboard.jsx";
import { Login } from "../pages/Login.jsx";
import { NotFound } from "../pages/NotFound.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assessorias" element={<AssessmentHistory />} />
          <Route path="assessorias/nova" element={<AssessmentCreate />} />
          <Route path="assessorias/:id" element={<AssessmentView />} />
          <Route path="assessorias/:id/editar" element={<AssessmentEdit />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
