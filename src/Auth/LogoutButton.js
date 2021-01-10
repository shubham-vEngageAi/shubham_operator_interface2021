import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function LogoutButton() {
  const { isAuthenticated, logout } = useAuth0();

  return (
    isAuthenticated && (
      // <button onClick={() => {logout({ returnTo: window.location.origin });}}>Log out</button>
      // <li class="dropdown-item logoutbuttopm" onClick={() => {logout({ returnTo: window.location.origin });}} ><i class="icon-power mr-2"></i> Logout</li>
      <button
        type="button"
        onClick={() => {
          logout({ returnTo: window.location.origin });
        }}
        class="btn btn-primary"
      >
        Logout
      </button>
    )
  );
}

export default LogoutButton;
