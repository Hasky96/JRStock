import React from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";

const clientId =
  "138234037090-qflbfgu5st5hfj7v7v2pc6qp2i5ugt5r.apps.googleusercontent.com";

export default function Test({ onGoogleLogin }) {
  const onSuccess = async (response) => {
    console.log(response);
    axios
      .post("http://localhost:8000/api/user/login/google/", {
        accessToken: response.accessToken,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        responseType={"id_token"}
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
}
