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
    setLoading(true);
    const response = await testPostRequest({});
    setPostReturn(response.message);
    setLoading(false);
  };

  const [postReturn, setPostReturn] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <h1>NEW</h1>
      <button onClick={handleClickPost}>TEST POST</button>

      {loading ? (
        <div>
          <progress></progress>
          <p>Loading...</p>
        </div>
      ) : (
        <h2>{postReturn}</h2>
      )}
    </>
  );
}
