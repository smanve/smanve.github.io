"use client";
import React, { useState } from "react";
import AlertBox from "./alertbox";

const Projects: React.FC = () => {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  const dismissAlert = () => setShowAlert(false);

  return (
    <>
      <h2 className="font-sfmono text-2xl">Links</h2>
      {showAlert && (
        <AlertBox
          message="gh/smanve"
          buttonText="GitHub"
          buttonLink="https://github.com/smanve"
          onDismiss={dismissAlert}
        />
      )}
      {showAlert && (
        <AlertBox
          message="rxresu.me"
          buttonText="Resume"
          buttonLink="https://rxresu.me/manvendrasingh1999/continuous-genuine-barracuda"
          onDismiss={dismissAlert}
        />
      )}
      {showAlert && (
        <AlertBox
          message="li/manvendra.singh"
          buttonText="LinkedIn"
          buttonLink="https://www.linkedin.com/in/manvendrasingh1999/"
          onDismiss={dismissAlert}
        />
      )}
      <div className="flex flex-col gap-4">
        <ul className="list-inside"></ul>
      </div>
    </>
  );
};

export default Projects;