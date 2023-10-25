import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import About from "../pages/About";
import Home from "../pages/Home";
import Page404 from "../pages/Page404";
import Header from "../partials/Header";
import { ProSidebarProvider } from "react-pro-sidebar";
import MySidebar from "../partials/MySidebar";
import { Stack } from "@mui/system";
import { CssBaseline, Grid } from "@mui/material";
import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgetPassword from "../pages/auth/ForgetPassword";
import Students from "../pages/students/Students";
import StudentDetails from "../pages/students/StudentDetails";
import StudentMove from "../pages/students/studentMove";
import Results from "../pages/results";
import Cocurricular from "../pages/cocurricular";
import Billing from "../pages/billing";
import Infrastructure from "../pages/infrastructure";
import Footer2 from "../partials/Footer2";
import Footer from "../partials/Footer";
import PaymentMethods from "../pages/billing/PaymentMethods";
import { useSelector } from "react-redux";
import UserHeader from "../partials/UserHeader";
import UserHome from "../pages/userApp";
import { UserSidebar } from "../partials/UserSidebar";
import { Subscription } from "../pages/userApp/Subscription";
import { ResultDetails } from "../pages/results/ResultDetails";
import StudentInactive from "../pages/students/StudentInactive";
import CocurricularInactive from "../pages/cocurricular/CocurricularInactive";
import { EventDetails } from "../pages/cocurricular/EventDetails";
import { EventDetails2 } from "../pages/userApp/EventDetails2";
import AdminProfile from "../pages/AdminProfile";
import ResetPasswordWithToken from "../pages/auth/ResetPasswordWithToken";
import { StudentProfile } from "../pages/userApp/StudentProfile";
import RegisterSchool from "../pages/RegisterSchool";
import UserPanel from "../pages/userApp/UserPanel";
import { useMediaQuery } from '@mui/material'

export default function MyRoutes() {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const mob = useMediaQuery('(max-width:800px)')
  return (
    <ProSidebarProvider>
      <BrowserRouter>
        <CssBaseline />
        {isLoggedIn ? (
          <>
            {role === "school" ? (
              <>
                <Header />
                <Stack direction={"row"} sx={{ backgroundColor: "#F4F7FC" }}>
                  <MySidebar />
                  <Routes sx={{ width: "100%" }}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/admin-profile" element={<AdminProfile />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/cocurricular" element={<Cocurricular />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/students-move" element={<StudentMove />} />
                    <Route
                      path="/archieved-students"
                      element={<StudentInactive />}
                    />
                    <Route
                      path="/archieved-events"
                      element={<CocurricularInactive />}
                    />
                    <Route
                      path="/infrastructure"
                      element={<Infrastructure />}
                    />
                    <Route
                      path="/payment-methods"
                      element={<PaymentMethods />}
                    />
                    <Route
                      path="/event-details/:id"
                      element={<EventDetails />}
                    />
                    <Route
                      path="/student-details/:id/:change_session_id"
                      element={<StudentDetails />}
                    />
                    <Route
                      path="/result-details/:id/:classID/:sectionID"
                      element={<ResultDetails />}
                    />
                    {/* <Route path='/register-school' element={<RegisterSchool />} /> */}
                    <Route
                      path="/change-password"
                      element={<ResetPasswordWithToken />}
                    />
                    <Route path="/*" element={<Navigate to={"/"} />} />{" "}
                    {/* it will navigate to / page  */}
                    <Route path="/*" element={<Page404 />} />{" "}
                    {/* if all the above links not found  */}
                  </Routes>
                </Stack>
                <Footer2 />
              </>
            ) : role === "admin" ? (
              <>
                <Header />
                <Stack direction={"row"} sx={{ backgroundColor: "#F4F7FC" }}>
                  {/* <MySidebar /> */}
                  <Routes>
                    <Route path="/" element={<RegisterSchool />} />
                    {/* <Route path='/about' element={<About />} />
                        <Route path='/admin-profile' element={<AdminProfile />} />
                        <Route path='/students' element={<Students />} />
                        <Route path='/results' element={<Results />} />
                        <Route path='/cocurricular' element={<Cocurricular />} />
                        <Route path='/billing' element={<Billing />} />
                        <Route path='/archieved-students' element={<StudentInactive />} />
                        <Route path='/archieved-events' element={<CocurricularInactive />} />
                        <Route path='/infrastructure' element={<Infrastructure />} />
                        <Route path='/payment-methods' element={<PaymentMethods />} />
                        <Route path='/event-details/:id' element={<EventDetails />} />
                        <Route path='/student-details/:id' element={<StudentDetails />} />
                        <Route path='/result-details/:id' element={<ResultDetails />} /> */}
                    <Route path="/register-school" element={<RegisterSchool />} />
                    {/* <Route path='/change-password' element={<ResetPasswordWithToken />} /> */}
                    <Route path="/*" element={<Navigate to={"/"} />} />{" "}
                    {/* it will navigate to / page  */}
                    <Route path="/*" element={<Page404 />} />{" "}
                    {/* if all the above links not found  */}
                  </Routes>
                </Stack>
                <Footer />
              </>
            ) : role === "student" ? (
              // student
              <>
                <UserHeader />
                <Grid container sx={{ backgroundColor: "#F4F7FC", }}>{!mob ? (<Grid item lg={1.7} md={1.7} sm={12} xs={12} mt={6}><UserSidebar /></Grid>) : (null)}
                  <Grid item lg={10.3} md={10.3} sm={12} xs={12} mt={0}>
                    <Routes>
                      <Route path="/" element={<UserHome />} />
                      <Route path="/student-overview/:activeTab" element={<UserPanel />} />
                      <Route path="/student-details" element={<StudentProfile />} />
                      <Route path="/subscription" element={<Subscription />} />
                      <Route path="/*" element={<Navigate to={"/"} />} />
                      <Route path="/event-details/:id" element={<EventDetails2 />}
                      />
                      {/* it will navigate to / page  */}
                      <Route path="/*" element={<Page404 />} />
                      {/* if all the above links not found  */}
                    </Routes>
                  </Grid>
                </Grid>
                {mob ? null :<Footer />}
              </>
            ) : (
              <>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/forget-password" element={<ForgetPassword />} />
                  {/* <Route path='/register-school' element={<RegisterSchool />} /> */}
                  <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
                  <Route path="/*" element={<Login />} />
                </Routes>
              </>
            )}
          </>
        ) : (
          <>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              {/* <Route path='/register-school' element={<RegisterSchool />} /> */}
              <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
              <Route path="/*" element={<Login />} />
            </Routes>
          </>
        )}
      </BrowserRouter>
    </ProSidebarProvider>
  );
}
