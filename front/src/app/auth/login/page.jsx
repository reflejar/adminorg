"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import Spinner from '@/components/spinner';
import Image from "next/image"

function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { login } = useAuthContext();


  const handleForm = async (event) => {
    setLoading(true)
    event.preventDefault();
    const user = await login(username, password);
      if (user) {
        router.push('/');
      } else {
        setError('Usuario o contraseña incorrecta' );
      }
    setLoading(false)
  };

  

  return (
      <div className="bg-gradient vh-100 d-flex align-items-center justify-content-center">
        <div className="col-md-6 col-lg-4 animate__animated animate__bounceInRight">
          <div className="card py-5 px-3">
            <div className="card-body text-center">
              {loading ? <Spinner /> : <>
                <Image src='/img/logo.png' width={0} height={0} style={{ width: '50%', height: '100%' }} alt="Logo de AdminOrg" className='mb-4' />
                <form onSubmit={handleForm} className="form">
                  <input
                      type="text"
                      className="form-control my-3"
                      name="username"
                      id="username"
                      placeholder="Usuario"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                      type="password"
                      className="form-control my-3"
                      name="password"
                      id="password"
                      placeholder="Contraseña"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                      type="submit"
                      className="btn btn-secondary w-100 my-3"
                  >
                      Ingresar
                  </button>

                </form>
                {error && <p className="text-danger">{error}</p>}
              </>}
              
            </div>
          </div>

        </div>
      </div>
  );
};
export default Login;