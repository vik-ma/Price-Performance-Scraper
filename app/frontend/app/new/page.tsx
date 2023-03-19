"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

async function startPriceFetch(data = {}) {
  const response = await fetch(`http://localhost:8000/api/start_price_fetch/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export default function New() {
  const router = useRouter();

  const handleClickTest = async () => {
    setLoading(true);
    try {
      const response = await testPostRequest({});

      setLoading(false);

      if (response.hasOwnProperty("success")) {
        if (response.success) {
          router.push("/fetches");
        } else {
          setPostReturn(
            `'Success' exists and is false ${JSON.stringify(response)}`
          );
        }
      } else {
        setPostReturn(`No 'success' exists ${JSON.stringify(response)}`);
      }
    } catch {
      setLoading(false);
      setPostReturn(`Failed to communicate with server`);
    }
  };

  const handleClickStartPriceFetch = async () => {
    const data = {
      fetch_type: "CPU-Gaming",
      product_list:
        "AMD Ryzen 9 7900X,Intel Core i7-13700K,AMD Ryzen 7 5800X3D",
    };
    setLoading(true);
    try {
      const response = await startPriceFetch(data);

      setLoading(false);

      if (response.hasOwnProperty("success")) {
        if (response.success) {
          router.push(`/fetches/${response.message}`);
        } else {
          setPostReturn(
            `'Success' exists and is false ${JSON.stringify(response)}`
          );
        }
      } else {
        setPostReturn(`No 'success' exists ${JSON.stringify(response)}`);
      }
    } catch {
      setLoading(false);
      setPostReturn(`Failed to communicate with server`);
    }
  };

  const [postReturn, setPostReturn] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [tabIndex, setTabIndex] = useState(1);

  const toggleTab = (index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <h1>NEW</h1>
      <h2>Choose Benchmark Type</h2>
      <div className="benchmark-table-container">
        <div className="benchmark-table-tabs-container">
          <div
            className={
              tabIndex === 1
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(1)}
          >
            <strong>GPU</strong>
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(2)}
          >
            <strong>CPU (Gaming)</strong>
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmark-table-tabs benchmark-table-active-tabs"
                : "benchmark-table-tabs"
            }
            onClick={() => toggleTab(3)}
          >
            <strong>CPU (Multi-threading)</strong>
          </div>
        </div>
        <div className="benchmark-table-content-tabs">
          <div
            className={
              tabIndex === 1
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <h2>GPU</h2>
          </div>
          <div
            className={
              tabIndex === 2
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <h2>CPU (Gaming Performance)</h2>
          </div>
          <div
            className={
              tabIndex === 3
                ? "benchmark-table-content benchmark-table-active-content"
                : "benchmark-table-content"
            }
          >
            <h2>CPU (Multi-threaded Performance)</h2>
          </div>
        </div>
      </div>
      <br />
      <button onClick={handleClickTest} className="secondary">
        TEST POST
      </button>
      <button onClick={handleClickStartPriceFetch} className="secondary">
        START PRICE FETCH
      </button>
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
