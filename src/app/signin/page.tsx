"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import Alerts from "../components/alerts";

export default function SignIn() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [alertState, setAlertState] = useState("");

  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:8080/signin`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const json = await res.json();
      //localStorage.setItem("token", json.token);

      const expirationTime = new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours
      );

      Cookies.set("accessToken", json.token, {
        expires: expirationTime,
        path: "/",
      });

      setAlertState("Success");
      setAlertMessage("You have successfully signed in.");
      router.push("/home");
    } else {
      setAlertState("Error");
      setAlertMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
          <form className="w-full max-w-md">
            <div className="flex justify-center mx-auto">
              <Image
                className="w-auto h-7 sm:h-8"
                src="https://merakiui.com/images/logo.svg"
                alt=""
                width={200}
                height={50}
              ></Image>
            </div>

            <div className="flex items-center justify-center mt-6">
              <a
                //href="#"
                className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500 dark:border-blue-400 dark:text-white"
              >
                sign in
              </a>

              <a
                href="/"
                className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b dark:border-gray-400 dark:text-gray-300"
              >
                sign up
              </a>
            </div>

            <div className="relative flex items-center mt-8">
              <span className="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>

              <input
                type="text"
                className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="relative flex items-center mt-4">
              <span className="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>

              <input
                type="password"
                name="password"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                value={formData.password}
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <button
                className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transhtmlForm bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                onClick={handleSubmit}
                type="button"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        <Alerts
          message={alertMessage}
          type={alertState}
          setAlertState={setAlertState}
        ></Alerts>
      </section>
    </>
    // <Layout>

    //   <div className={styles.container}>
    //     <h1 className={styles.title}>Sign In</h1>
    //     <div className={styles.form}>
    //       <input className={styles.input} type="text" name="username" placeholder="username" value={state.username} onChange={handleChange} autoComplete="off" />
    //       <input className={styles.input} type="password" name="password" placeholder="password" value={state.password} onChange={handleChange} />
    //       <button className={styles.btn} onClick={handleSubmit}>Submit</button>
    //     </div>
    //   </div>
    // </Layout>
  );
}
