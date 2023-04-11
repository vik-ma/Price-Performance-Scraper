import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type TestApiProps = {
  message: string;
};

async function getApiData(): Promise<TestApiProps> {
  const res = await fetch(`${process.env.DJANGO_API_URL}/test_frontend/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}



export default async function Home() {
  const apiData = await getApiData();

  return (
    <main>
      <div>
        <h1 className="page-title">Home</h1>
        <p>API Test: {apiData.message}</p>

        <div className="padding-top: 3em">
          <Link href="/scrapes">View Completed Scrapes</Link>
        </div>
        
        <table>
          <tbody>
            <tr>
              <td>
                <div className="model-background model-gradient-0">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-1">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-2">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-3">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-4">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-5">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-6">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-7">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-8">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="model-background model-gradient-9">
                  <strong>TEST</strong>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* <p className="test-color-0"><strong>TEST</strong></p>
        <p className="test-color-1"><strong>TEST</strong></p>
        <p className="test-color-2"><strong>TEST</strong></p>
        <p className="test-color-3"><strong>TEST</strong></p>
        <p className="test-color-4"><strong>TEST</strong></p>
        <p className="test-color-5"><strong>TEST</strong></p>
        <p className="test-color-6"><strong>TEST</strong></p>
        <p className="test-color-7"><strong>TEST</strong></p>
        <p className="test-color-8"><strong>TEST</strong></p>
        <p className="test-color-9"><strong>TEST</strong></p>
        <p className="test-color-10"><strong>TEST</strong></p>
        <p className="test-color-11"><strong>TEST</strong></p>
        <p className="test-color-12"><strong>TEST</strong></p>
        <p className="test-color-13"><strong>TEST</strong></p>
        <p className="test-color-14"><strong>TEST</strong></p>
        <p className="test-color-15"><strong>TEST</strong></p>
        <p className="test-color-16"><strong>TEST</strong></p>
        <p className="test-color-17"><strong>TEST</strong></p>
        <p className="test-color-18"><strong>TEST</strong></p>
        <p className="test-color-19"><strong>TEST</strong></p>
        <p className="test-color-20"><strong>TEST</strong></p>
        <p className="test-color-21"><strong>TEST</strong></p>
        <p className="test-color-22"><strong>TEST</strong></p>
        <p className="test-color-23"><strong>TEST</strong></p>
        <p className="test-color-24"><strong>TEST</strong></p> */}
      </div>
    </main>
  );
}
