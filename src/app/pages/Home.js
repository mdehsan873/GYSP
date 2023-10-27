import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CssBaseline,
  Stack,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import HomeCard from "../components/HomeCard";
import AddBulkResult from "./results/AddBulkResult";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddStudentDialog from "../components/dialogs/students/AddStudentDialog";
import AddBulkStudent from "../components/dialogs/AddBulkStudent";
import AddCocurricularEventDialog from "../components/dialogs/cocurricular/AddCocurricularEventDialog";
import AddTestDialog from "./infrastructure/AddTestDialog";
import AddTeacher from "./infrastructure/AddTeacher";
import AddClass from "./infrastructure/AddClass";
import AddSubject from "./infrastructure/AddSubject";
import AxiosObj from "../axios/AxiosObj";
import { getAxiosWithToken } from "../axios/AxiosObj";
import secureLocalStorage from "react-secure-storage";
import { resetLocal } from './../partials/localStorage'

export default function Home() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { school } = useSelector((state) => state.infra);
  const [countStudent, setCountStudent] = useState("Loading...");
  const [countResult, setCountResult] = useState("Loading...");
  const [countEvent, setCountEvent] = useState("Loading...");

  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [openAddResult, setOpenAddResult] = useState(false);
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [openAddTest, setOpenAddTest] = useState(false);
  const [openAddTeacher, setOpenAddTeacher] = useState(false);
  const [openAddClass, setOpenAddClass] = useState(false);
  const [openAddSubject, setOpenAddSubject] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);

  const DialogBtnWrapper = ({ openHandler, children }) => {
    return (
      <Button
        color="info"
        onClick={() => {
          openHandler(true);
        }}
      >
        {children}
      </Button>
    );
  };

  const LinkBtnWrapper = ({ children, path }) => {
    return (
      <Link to={path}>
        <Typography className="secondary">
          <Button color="info" style={{ textTransform: "capitalize" }}>
            {children}
          </Button>
        </Typography>
      </Link>
    );
  };

  const fetchData = async () => {
    if (secureLocalStorage.getItem("access")) {
      if (countStudent === "Loading...") {
        // student
        if (secureLocalStorage.getItem("countStudent")) {
          setCountStudent(secureLocalStorage.getItem("countStudent"));
        } else {
          try {
            let config = {
              method: 'GET',
              maxBodyLength: Infinity,
              url: "student/get/all/?page=1&limit=10",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
              },
            };
            const AxiosObj = getAxiosWithToken();
            const studentResponse = await AxiosObj.request(config);
            setCountStudent(studentResponse.data?.count);
            secureLocalStorage.setItem('countStudent', studentResponse.data?.count)

          } catch (error) {
            if (error.response.status === 401) {
              window.location.reload(true);
            }
            setCountStudent("Loading...");
          }
        }
      }

      if (countResult === "Loading...") {
        setCountResult(1);
      }

      
        if (countEvent === "Loading...") {
          if (secureLocalStorage.getItem("countEvent")) {
            setCountEvent(secureLocalStorage.getItem("countEvent"));
          } else {
            try {
              let config = {
                method: 'GET',
                maxBodyLength: Infinity,
                url: "event/get/events/",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
              };
              const AxiosObj = getAxiosWithToken();
              const eventResponse = await AxiosObj.request(config);
              setCountEvent(eventResponse.data.Data.length);
              if (eventResponse.data.Data) {
                secureLocalStorage.setItem('countEvent', eventResponse.data?.Data?.length)
              }
            } catch (error) {
              if (error.response.status === 401) {
                window.location.reload(true);
              }
              setCountEvent("Loading...");
            }
          }
        }
      
    }
  };

  useEffect(() => {
    resetLocal();
  }, []);

  useEffect(() => {
    if (
      countEvent === "Loading..." ||
      countResult === "Loading..." ||
      countStudent === "Loading..."
    ) {
      fetchData();
    }
  }, [isLoggedIn]);

  return (
    <>
      <CssBaseline />
      <Box width={"100%"}>
        <Stack flexDirection={"row"} alignItems="center" margin={2}>
          { (
            <Image
              src={require("../assets/Logo/noimage.png")}
              style={{ width: 90, marginLeft: 15, marginRight: 15 }}
            />
          )}
          <Stack>
            <Typography variant="h5">
              {school?.name || "School Name"}
            </Typography>
            <Typography variant="h6">
              Welcome to GYSP School Pannel
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Grid2 container>
          <Grid2 md={4} lg={4} key={4} sm={12} width={"100%"}>
            <HomeCard
              key={6}
              icon={<SchoolOutlinedIcon />}
              title={"Students"}
              manage="/students"
              countTitle={"Students"}
              count={countStudent}
              leftOptions={[
                <DialogBtnWrapper key={658455} openHandler={setOpenAddStudent}>
                  Add Student
                </DialogBtnWrapper>,
                <Button
                  key={3545}
                  color="info"
                  onClick={() => {
                    setOpenBulkUpload(true);
                  }}
                >
                  Add Bulk students
                </Button>,
              ]}
            />
          </Grid2>
          <Grid2 md={4} lg={4} key={9} sm={12} width={"100%"}>
            <HomeCard
              key={645}
              icon={<AssessmentOutlinedIcon />}
              title={"Results"}
              manage="/results"
              countTitle={"Total Results"}
              count={countResult}
              leftOptions={[
                <DialogBtnWrapper key={787} openHandler={setOpenAddResult}>
                  Add Result
                </DialogBtnWrapper>,
                <LinkBtnWrapper key={496}>.</LinkBtnWrapper>,
              ]}
            />
          </Grid2>
          <Grid2 md={4} lg={4} key={10} sm={12} width={"100%"}>
            <HomeCard
              key={425}
              icon={<SportsSoccerOutlinedIcon />}
              title={"Co-curricular"}
              manage="/cocurricular"
              countTitle={"Total Events"}
              count={countEvent}
              leftOptions={[
                <DialogBtnWrapper key={574} openHandler={setOpenAddEvent}>
                  Add Event
                </DialogBtnWrapper>,
                <Button
                  key={463}
                  color="info"
                  onClick={() => {
                    setOpenBulkUpload(true);
                  }}
                >
                  Add Bulk Event
                </Button>,
              ]}
            />
          </Grid2>
          <Grid2 md={4} lg={4} key={1} sm={12} width={"100%"}>
            <HomeCard
              key={545}
              icon={<ApartmentIcon />}
              title={"Infrastructure"}
              manage="/infrastructure"
              countTitle={""}
              count={" "}
              leftOptions={[
                <DialogBtnWrapper key={5} openHandler={setOpenAddClass}>
                  Add Class
                </DialogBtnWrapper>,
                <DialogBtnWrapper key={96} openHandler={setOpenAddTest}>
                  Add Test Pattern
                </DialogBtnWrapper>,
              ]}
              rightOptions={[
                <DialogBtnWrapper key={458} openHandler={setOpenAddTeacher}>
                  Add Techer
                </DialogBtnWrapper>,
                <DialogBtnWrapper key={455} openHandler={setOpenAddSubject}>
                  Add Subject
                </DialogBtnWrapper>,
              ]}
            />
          </Grid2>
          <Grid2 md={4} lg={4} key={3} sm={12} width={"100%"}>
            <HomeCard
              key={45}
              icon={<CreditCardOutlinedIcon />}
              title={"Billing"}
              manage="billing"
              countTitle={"Current Dues "}
              count={"INR 00.00"}
              leftOptions={[
                <LinkBtnWrapper key={444}>Invoices</LinkBtnWrapper>,
                <LinkBtnWrapper key={496}>Payment methods</LinkBtnWrapper>,
              ]}
              rightOptions={[
                <LinkBtnWrapper>.</LinkBtnWrapper>,
                <LinkBtnWrapper key={7898}>Transaction History</LinkBtnWrapper>,
              ]}
            />
          </Grid2>
        </Grid2>
        <AddStudentDialog open={openAddStudent} setOpen={setOpenAddStudent} />
        <AddBulkResult open={openAddResult} setOpen={setOpenAddResult} />
        <AddCocurricularEventDialog
          open={openAddEvent}
          setOpen={setOpenAddEvent}
        />
        <AddTestDialog open={openAddTest} setOpen={setOpenAddTest} />
        <AddTeacher open={openAddTeacher} setOpen={setOpenAddTeacher} />
        <AddClass open={openAddClass} setOpen={setOpenAddClass} />
        <AddSubject open={openAddSubject} setOpen={setOpenAddSubject} />
        <AddBulkStudent open={openBulkUpload} setOpen={setOpenBulkUpload} />
      </Box>
    </>
  );
}
