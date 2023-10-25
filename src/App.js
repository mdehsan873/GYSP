import "./App.css";
import { ThemeProvider } from "@mui/system";
import { LightTheme } from "./app/Themes/Themez";
import MyRoutes from "./app/routes/MyRoutes";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, setAccessToken } from "./app/store/slices/AuthSlice";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import AxiosObj, { getAxiosWithToken2 } from "./app/axios/AxiosObj";
import { useEffect, useRef, useState } from "react";
import {
  setRSessions,
  setRSchool,
  setRClassAndSection,
  setRStudentDetails,
} from "./app/store/slices/InfrastuctureSlice";
import { getAxiosWithToken } from "./app/axios/AxiosObj";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, refreshToken, accessToken, role } = useSelector((state) => state.auth);
  // const navigate = useNavigate();
  const { studentDetails } = useSelector((state) => state.infra);

  const [flag, setFlag] = useState(false);
  const timer = useRef();
  let localData = secureLocalStorage.getItem("access");

  if (secureLocalStorage.getItem("access") !== undefined && secureLocalStorage.getItem("access") !== null) dispatch(login());

  const getStudentDetails = async () => {
    if (role == "student") {
      const Axios = getAxiosWithToken();

      // if (secureLocalStorage.getItem("rStudentDetails")) {
      //   dispatch(setRStudentDetails(secureLocalStorage.getItem("rStudentDetails")));
      // } else {
        Axios.get("student/get/details/")
          .then((res) => {
            if (res.data?.Success) {
              // if (res.data.Data && res.data.Data?.id) {
              //   secureLocalStorage.setItem('rStudentDetails', res.data?.Data)
              // }
              dispatch(setRStudentDetails(res.data?.Data));
            }
          })
          .catch((e) => {
            if (e.response.status === 401) {
              window.location.reload(true);
            }
          })
          .finally();
      // }

      if (secureLocalStorage.getItem("rSessions")) {
        dispatch(setRSessions(secureLocalStorage.getItem("rSessions")));
      } else {
        Axios.get("session/get/all/")
          .then((res) => {
            if (res.data?.Success) {
              if (res.data?.data?.length !== 0) {
                secureLocalStorage.setItem('rSessions', res.data?.data)
              }
              dispatch(setRSessions(res.data?.data));
            }
          })
          .catch((e) => {
            if (e.response.status === 401) {
              window.location.reload(true);
            }
          }).finally();
      }
    }
  };

  if (role == "student" && !studentDetails) {
    getStudentDetails();
  }

  useEffect(() => {
    getStudentDetails();
  }, [role]);

  const getInfraData = async () => {

    const Axios = getAxiosWithToken();
    // Session
    if (secureLocalStorage.getItem("rSessions")) {
      dispatch(setRSessions(secureLocalStorage.getItem("rSessions")));
    } else {
      Axios.get("session/get/all/")
        .then((res) => {
          if (res.data?.Success) {
            if (res.data?.data?.length !== 0) {
              secureLocalStorage.setItem('rSessions', res.data?.data)
            }
            dispatch(setRSessions(res.data?.data));
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            window.location.reload(true);
          }
        }).finally();
    }

    // Class
    if (secureLocalStorage.getItem("rClassAndSection")) {
      dispatch(setRClassAndSection(secureLocalStorage.getItem("rClassAndSection")));
    } else {
      Axios.get("classes/get/classes/section/")
        .then((res) => {
          if (res.data?.Success) {
            if (res.data?.Data?.length !== 0) {
              secureLocalStorage.setItem('rClassAndSection', res.data?.Data)
            }
            dispatch(setRClassAndSection(res.data?.Data));
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            window.location.reload(true);
          }
        }).finally();
    }

    // Class
    // if (secureLocalStorage.getItem("rSchool")) {
    //   dispatch(setRSchool(secureLocalStorage.getItem("rSchool")));
    // } else {
      Axios.get("school/get/details/")
        .then((res) => {
          if (res.data?.Success) {
            // if (res.data?.Data?.length !== 0) {
            //   secureLocalStorage.setItem('rSchool', res.data?.Data)
            // }
            dispatch(setRSchool(res.data?.Data));
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            window.location.reload(true);
          }
        }).finally();
    // }
  };

  const requestAccessToken = async () => {
    if (localStorage.getItem("refresh")) {
      let data = new FormData();
      data.append("refresh", localStorage.getItem("refresh"));
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "account/token/refresh/",
        data: data,
      };

      AxiosObj.request(config)
        .then((response) => {
          localStorage.removeItem("access");
          secureLocalStorage.removeItem("access")

          localStorage.setItem("access", response.data?.access);
          secureLocalStorage.setItem("access", response.data?.access);
          dispatch(setAccessToken(response.data?.access));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch(logout());
      window.location.reload();
    }
  };
  const checkLoign = async () => {
    if (!localStorage.getItem("refresh")) {
      dispatch(logout());
      window.location.reload();
    }
  };


  useEffect(() => {
    if (!flag) {
      // requesting access token before expiring
      if (
        secureLocalStorage.getItem("role") === "school" ||
        secureLocalStorage.getItem("role") === "student" ||
        secureLocalStorage.getItem("role") === "admin"
      ) {
        requestAccessToken();
      }
      if (secureLocalStorage.getItem("role") === "school") {
        getInfraData();
      }
    } else {
      setFlag(true);
    }
  }, [flag]);

  useEffect(() => {
    // requesting access token before expiring
    if (isLoggedIn) {
      timer.current = setInterval(() => {
        requestAccessToken();
      }, 600000); // 10 minutes in milliseconds (10 * 60 * 1000)

      timer.current = setInterval(() => {
        checkLoign();
      }, 5000); // 5 sec in milliseconds (5 * 1000)
    }

    // Clear the interval when the component unmounts or when isLoggedIn becomes false
    return () => {
      clearInterval(timer.current);
    };
  }, [isLoggedIn]);

  return (
    <ThemeProvider theme={LightTheme}>
      {/* <main style={{ height: window.innerHeight }}> */}
      <main style={{ height: window.innerHeight }}>
        <MyRoutes />
      </main>
    </ThemeProvider>
  );
}

export default App;
