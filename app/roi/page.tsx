"use client";
import Image from "next/image";
import { useState } from "react";

type RoiFields = {
  type: string;
  population: number;
  singleUse: number;
  locations: number;
};

const college = {
  type: "College",
  population: 40000,
  singleUse: 0.15,
  locations: 1,
};

const corporate = {
  type: "Corporate",
  population: 1000,
  singleUse: 0.15,
  locations: 1,
};
const hospital = {
  type: "Hospital",
  population: 500,
  singleUse: 0.15,
  locations: 1,
};

const reuseCost = 1.5;
const daysBetween = 7;
const returnRate = 0.9;
const months = [1, 3, 6, 9, 12, 24, 36];

export default function Page() {
  const [form, setForm] = useState<RoiFields>(college);
  function getDailyUses() {
    if (form.type == "College") {
      return form.population / 50;
    } else if (form.type == "Corporate") {
      return form.population / 20;
    }
    return form.population / 5;
  }

  function getInitialCost() {
    return getDailyUses() * (daysBetween + 3) * reuseCost;
  }

  function getMonthlyReuseCost() {
    return getDailyUses() * (daysBetween + 3) * (1 - returnRate) * reuseCost;
  }

  function getMonthlyCost() {
    return getDailyUses() * 30 * form.singleUse;
  }

  function getMonthlySavings() {
    const singleUse = getMonthlyCost();
    const reuse = getMonthlyReuseCost();
    return singleUse - reuse;
  }

  function getBreakEven() {
    return Math.round(getInitialCost() / getMonthlySavings());
  }

  function getAnnualSavings() {
    return getMonthlySavings() * 12 - getInitialCost();
  }

  function getThreeYearSavings() {
    return getMonthlySavings() * 36 - getInitialCost();
  }

  function isReuseCheaper(month: number) {
    return (
      getMonthlyReuseCost() * month + getInitialCost() <
      getMonthlyCost() * month
    );
  }

  return (
    <div className="h-screen w-full bg-re-dark-green-500 flex flex-col font-theinhardt text-white">
      <div className="flex w-full border-b border-re-gray-300 bg-re-black">
        <h1 className="text-2xl pl-6 py-4">Re ROI Calculator</h1>
      </div>
      <div className="absolute right-6 top-[4.5rem] flex">
        <Image
          src={"/images/logo.png"}
          height={54}
          width={71.12}
          alt={"Re Company Logo"}
        />
      </div>

      <div className="flex flex-col justify-center items-center h-full gap-4">
        <div className="bg-re-dark-green-300 border border-re-gray-300 rounded-md">
          <table>
            <thead>
              <tr>
                <th className="px-4 py-2 border-r border-re-gray-300">
                  Monthly Cost
                </th>
                {months.map((month) => (
                  <th
                    key={month}
                    className="px-4 py-2 border-r border-re-gray-300"
                  >
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <th className="border-r px-2 border-re-gray-300 border-b py-1">
                  Single Use
                </th>
                {months.map((month) => (
                  <th
                    key={"reuse " + month}
                    className="border-r px-2 border-re-gray-300 border-b py-1 hover:bg-re-table-hover"
                  >
                    $
                    {(month * getMonthlyCost()).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                    })}
                  </th>
                ))}
              </tr>
              <tr className="">
                <th className="border-r px-2 border-re-gray-300 py-1">Reuse</th>
                {months.map((month) => (
                  <th
                    key={"reuse " + month}
                    className={`border-r px-2 border-re-gray-300 py-1 hover:bg-re-table-hover ${
                      isReuseCheaper(month) ? "text-re-green-500" : ""
                    }`}
                  >
                    $
                    {(
                      getInitialCost() +
                      month * getMonthlyReuseCost()
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                    })}
                  </th>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-4">
          <div className="bg-re-dark-green-300 border border-re-gray-300 rounded-md">
            <h3 className="py-2 px-4 text-lg">Inputs</h3>
            <div className="w-full h-px bg-re-gray-300" />
            <div className="flex flex-col px-4 py-2 gap-2">
              <label className="text-re-gray-text">Business type</label>
              <div className="flex w-full justify-between mb-1">
                <button
                  id="college"
                  className={`px-3 py-1 bg-re-black border hover:border-re-green-500 active:border-re-green-700 rounded ${
                    form.type == "College"
                      ? "border-re-green-500"
                      : "border-re-dark-green-300"
                  }`}
                  onClick={() => setForm(college)}
                >
                  College
                </button>
                <button
                  id="corp"
                  className={`px-3 py-1 bg-re-black border hover:border-re-green-500 active:border-re-green-700 rounded ${
                    form.type == "Corporate"
                      ? "border-re-green-500"
                      : "border-re-dark-green-300"
                  }`}
                  onClick={() => setForm(corporate)}
                >
                  Corporate
                </button>
                <button
                  id="hosp"
                  className={`px-3 py-1 bg-re-black border hover:border-re-green-500 active:border-re-green-700 rounded ${
                    form.type == "Hospital"
                      ? "border-re-green-500"
                      : "border-re-dark-green-300"
                  }`}
                  onClick={() => setForm(hospital)}
                >
                  Hospital
                </button>
              </div>
              <label className="text-re-gray-text mb-1">
                Population
                <input
                  type="number"
                  value={form.population}
                  className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 border-re-gray-300 border"
                  onChange={(e) =>
                    setForm({ ...form, population: parseInt(e.target.value) })
                  }
                ></input>
              </label>
              <label className="text-re-gray-text mb-1">
                Cost of Single Use ($)
                <input
                  type="number"
                  step="0.01"
                  value={form.singleUse}
                  className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 border-re-gray-300 border"
                  onChange={(e) =>
                    setForm({ ...form, singleUse: parseFloat(e.target.value) })
                  }
                ></input>
              </label>
              {/* <label className="text-re-gray-text mb-1">
              Number of Locations
              <input
                type="number"
                value={form.locations}
                className="rounded bg-re-black bg-opacity-[0.32] text-white w-full p-2 border-re-gray-300 border"
                onChange={(e) =>
                  setForm({ ...form, locations: parseInt(e.target.value) })
                }
              ></input>
            </label> */}
            </div>
          </div>
          <div className="bg-re-dark-green-300 border border-re-gray-300 rounded-md">
            <h3 className="py-2 px-4 text-lg">Savings</h3>
            <div className="w-full h-px bg-re-gray-300" />
            <div className="flex flex-col px-4 py-2 gap-2">
              <label className="text-re-gray-text mb-1 gap-3 flex justify-between">
                Initial Investment:
                <p className="text-white">
                  $
                  {getInitialCost().toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                </p>
              </label>
              <label className="text-re-gray-text mb-1 gap-3 flex justify-between">
                Monthly Savings:
                <p className="text-re-green-500 text-lg">
                  $
                  {getMonthlySavings().toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                </p>
              </label>
              <label className="text-re-gray-text mb-1 gap-3 flex justify-between">
                Breakeven:
                <p className="text-re-green-500 text-lg">
                  {getBreakEven()} months
                </p>
              </label>
              <label className="text-re-gray-text mb-1 gap-3 flex justify-between">
                1 year savings:
                <p className="text-re-green-500 text-lg">
                  ${getAnnualSavings().toLocaleString()}
                </p>
              </label>
              <label className="text-re-gray-text mb-1 gap-3 flex justify-between">
                3 year savings:
                <p className="text-re-green-500 text-lg">
                  ${getThreeYearSavings().toLocaleString()}
                </p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
