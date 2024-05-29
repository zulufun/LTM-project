import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux";
import { RouterLinks } from "./const/RouterLinks";
// import { AppContext, socket } from "./context/appContext";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/Layout";
import NotFound from "./pages/not-found/NotFound";
import ThongKeCount from "./pages/thong-ke-count";
import ErrorPage from "./pages/error-page/ErrorPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ThongKeTime from "./pages/thong-ke-time";
import Promotion from "./pages/them-thu-cong";
import ChatBoxAI from "./pages/aichatbox";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          {/* <AppContext.Provider value={{socket}}> */}
          <div className="MainApp">
            <div className="ContentApp">
              <Routes>
                <Route path="*" element={<NotFound />}></Route>
                <Route
                  path={RouterLinks.LOGIN}
                  element={<Login />}
                  errorElement={<ErrorPage />}
                ></Route>
                <Route
                  path={RouterLinks.REGISTER}
                  element={<Register />}
                  errorElement={<ErrorPage />}
                ></Route>
                <Route
                  path={RouterLinks.HOME_PAGE}
                  element={<MainLayout />}
                  errorElement={<ErrorPage />}
                >
                  <Route
                    path={RouterLinks.THONG_KE_COUNT}
                    element={<ThongKeCount />}
                    errorElement={<ErrorPage />}
                  ></Route>
                  <Route
                    path={RouterLinks.THONG_KE_TIME}
                    element={<ThongKeTime />}
                    errorElement={<ErrorPage />}
                  ></Route>
                  <Route
                    path={RouterLinks.THEM_THU_CONG}
                    element={<Promotion />}
                    errorElement={<ErrorPage />}
                  ></Route>
                  <Route
                    path={RouterLinks.HOI_DAP}
                    element={<ChatBoxAI />}
                    errorElement={<ErrorPage />}
                  ></Route>
                </Route>
              </Routes>
            </div>
          </div>
          {/* </AppContext.Provider> */}
        </PersistGate>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
