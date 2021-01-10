import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Menubar from "./Menubar";
import Login from "./Auth/Login";
import LoaderBar from "./Loader/LoaderBar";
function App() {
  const { isLoading, isAuthenticated, error } = useAuth0();

  if (isLoading) {
    return (
      <div
        class="col-md-12 col-lg-12 col-sm-12 text-center"
        style={{ marginTop: "50vh" }}
      >
        <LoaderBar />
      </div>
    );
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <Menubar />
      </div>
    );
  } else {
    return <Login />;
  }
}

export default App;
