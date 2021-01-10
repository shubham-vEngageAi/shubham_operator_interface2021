import React from 'react'
import {useAuth0} from '@auth0/auth0-react';
const Login = () => {
    const { loginWithRedirect } = useAuth0();
    return (
        <div>
              <div class="card card-authentication1 mx-auto my-5 animated bounceInDown">
		<div class="user-lock rounded-top bg-primary">
              <div class="user-lock-img">                
                 <img src={process.env.PUBLIC_URL + 'assets/images/logo.png'} />
              </div>
           </div>
          <div class="card-body">
             <h4 class="text-center my-5 py-2">Welcome to Vengage</h4>
          <hr/>
			<h6>Welcome to Vengage operator dashboard. You can connect to a customer using the dashboard. In case you do not have a login please write to help@vengage.ai</h6>
          </div>
          <div class="form-footer mt-2" align="center">
			<a href="javascript:" onClick={()=>loginWithRedirect()} class="btn btn-primary btn-block login-btn loginbtn"><i class="fa fa-sign-in"></i>Login</a>
		 </div>
	     </div>
        </div>
    )
}

export default Login
