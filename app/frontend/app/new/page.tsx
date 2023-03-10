"use client";
import React from "react";
import { useState } from "react";

async function testPostRequest(data = {}) {
  const response = await fetch(`http://localhost:8000/api/test_post/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export default function New() {
  const handleClickPost = async () => {
    const response = await testPostRequest({});
    setPostReturn(response.message)
  };

  const [postReturn, setPostReturn] = useState<string>("")

  return (
    <>
    <h1>NEW</h1>
      <button onClick={handleClickPost}>TEST POST</button>
      <h2>{postReturn}</h2>
    </>
  );
}
