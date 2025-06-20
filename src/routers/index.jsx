import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/HomePage";
import PrivateRoute from "./PrivateRoute";
import GroupPage from "@/pages/GroupPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import Groups from "../pages/Groups";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/groups" element={<Groups/>}/>
          <Route path="/groups/:id" element={<GroupPage />} />
          <Route path="/profile" element={<ProfilePage/>}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
