import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosNoToken, getAxiosWithToken } from "../../axios/AxiosObj";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";

export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ username, password }) => {
    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("username", username);
      formData.append("role", "k");

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "account/token/",
        data: formData,
      };
      const response = await AxiosNoToken.request(config);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.detail || "Invalid credentials");
      return false;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    mydata: null,
    loading: false,
    error: false,
    isLoggedIn: false,
    role: "",
    errorMsg: "",
    accessToken: secureLocalStorage.getItem("access"),
    refreshToken: secureLocalStorage.getItem("refresh"),
    loginUsername: "",
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.role = secureLocalStorage.getItem("role");
    },
    logout: (state, action) => {
      try {
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "account/logout/",
          data: null,
        };
        const AxiosObj = getAxiosWithToken();
        AxiosObj.request(config);
      } catch (error) {
        toast.error(error.response?.data || "Invalid credentials");
        return false;
      } finally {
        state.isLoggedIn = false;
        state.role = "";

        localStorage.clear();
        secureLocalStorage.clear();
        // Perform a hard refresh
        // window.location.href('/')
        window.location.reload(true);
      }
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLoginUsername: (state, action) => {
      state.loginUsername = action.payload;
      localStorage.setItem("username", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload === false) {
          state.errorMsg = "Username or password is incorrect";
        } else {
          state.error = false;
          secureLocalStorage.setItem("refresh", action.payload?.refresh);
          secureLocalStorage.setItem("access", action.payload?.access);
          localStorage.setItem("access", action.payload?.access);
          localStorage.setItem("refresh", action.payload?.refresh);
          secureLocalStorage.setItem("role", action.payload.role);
          state.accessToken = action.payload?.access;
          state.refreshToken = action.payload?.refresh;

          if (secureLocalStorage.getItem("access")) {
            state.isLoggedIn = true;
            state.role = action.payload.role;
          } else {
            // console.log("Token not found in browser");
            window.location.reload(true);
          }
        }
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const {
  login,
  logout,
  setAccessToken,
  setLoginUsername,
  setRefreshToken,
} = authSlice.actions;

export default authSlice.reducer;
