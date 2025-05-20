"use client";

import { useEffect, useState } from "react";
import api from "@/app/axios";

type PriceRow = {
  height: number;
  values: number[];
};

type PriceGrid = {
  widths: number[];
  heights: number[];
  prices: PriceRow[];
};

export default function PriceGridPage() {
  const [grid, setGrid] = useState<PriceGrid | null>(null);
  const [newHeight, setNewHeight] = useState<number | "">("");
  const [newWidth, setNewWidth] = useState<number | "">("");
  const [newPricesForRow, setNewPricesForRow] = useState<number[]>([]);
  const [newPricesForCol, setNewPricesForCol] = useState<number[]>([]);

  useEffect(() => {
    fetchGrid();
  }, []);

  const fetchGrid = async () => {
    const res = await api.get("/prices");
    setGrid(res.data);
  };

  const handleAddRow = async () => {
    if (newHeight === "" || !grid) return;

    const promises = grid.widths.map((width, idx) =>
      api.post("/prices", {
        width,
        height: newHeight,
        price: newPricesForRow[idx] || 0,
      })
    );

    await Promise.all(promises);
    setNewHeight("");
    setNewPricesForRow([]);
    fetchGrid();
  };

  const handleAddCol = async () => {
    if (newWidth === "" || !grid) return;

    const promises = grid.heights.map((height, idx) =>
      api.post("/prices", {
        width: newWidth,
        height,
        price: newPricesForCol[idx] || 0,
      })
    );

    await Promise.all(promises);
    setNewWidth("");
    setNewPricesForCol([]);
    fetchGrid();
  };

  const borderColumn = (index: number, type: string) => {
    if (index % 2 === 0 && type === "height") {
      return "border-r border-r-gray-400 bg-white p-2 font-bold text-black";
    } else if (type === "height") {
      return "border-r border-r-gray-400 bg-blue-100 p-2 font-bold text-black";
    } else if (index % 2 === 0 && type === "price") {
      return "bg-white p-2 font-medium";
    } else if (type === "price") {
      return "bg-blue-100 p-2 font-medium";
    }
  };

  if (!grid) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Price Grid</h1>
      <div className="overflow-auto">
        <table className="min-w-max table-auto border-collapse">
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border-b border-b-gray-400 p-2 bg-blue-100"
              >
                WIDTH TO
              </th>
              {grid.widths.map((w) => (
                <th
                  key={w}
                  className="border-b border-b-gray-400 p-2 bg-blue-100"
                >
                  {w}"
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.prices.map((row, idx) => (
              <tr key={row.height}>
                {idx === 0 && (
                  <td
                    rowSpan={grid.prices.length}
                    className="text-center bg-blue-100 font-medium"
                  >
                    <div className="transform -rotate-90 whitespace-nowrap font-bold text-black">
                      HEIGHT TO
                    </div>
                  </td>
                )}
                <td className={borderColumn(idx, "height")}>{row.height}"</td>
                {row.values.map((price, i) => (
                  <td key={i} className={borderColumn(idx, "price")}>
                    ${price}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Add New Row (Height)</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            placeholder="Height (e.g. 72)"
            value={newHeight}
            onChange={(e) => setNewHeight(Number(e.target.value))}
            className="border p-2 rounded w-40"
          />
          {grid.widths.map((w, idx) => (
            <input
              key={w}
              type="number"
              placeholder={`Price for ${w}"`}
              value={newPricesForRow[idx] || ""}
              onChange={(e) => {
                const updated = [...newPricesForRow];
                updated[idx] = Number(e.target.value);
                setNewPricesForRow(updated);
              }}
              className="border p-2 rounded w-32"
            />
          ))}
          <button
            onClick={handleAddRow}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Row
          </button>
        </div>
      </div>

      {/* Add Column */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-semibold mb-2">Add New Column (Width)</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            placeholder="Width (e.g. 84)"
            value={newWidth}
            onChange={(e) => setNewWidth(Number(e.target.value))}
            className="border p-2 rounded w-40"
          />
          {grid.heights.map((h, idx) => (
            <input
              key={h}
              type="number"
              placeholder={`Price for ${h}"`}
              value={newPricesForCol[idx] || ""}
              onChange={(e) => {
                const updated = [...newPricesForCol];
                updated[idx] = Number(e.target.value);
                setNewPricesForCol(updated);
              }}
              className="border p-2 rounded w-32"
            />
          ))}
          <button
            onClick={handleAddCol}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );
}
