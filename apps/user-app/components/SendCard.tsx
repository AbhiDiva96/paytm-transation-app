"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { P2PTransfer } from "../app/lib/actions/P2PTransfer";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await P2PTransfer(number, Number(amount) * 100);

      if (res?.message === "Transaction created successfully") {
        setMessage("Transferred successfully");
      } else {
        setError("Error while processing transaction");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }

    setAmount("");
    setNumber("");
  };

 
  return (
    <Card title="Transfer Money">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <TextInput
            label="Number"
            placeholder="Enter number"
            onChange={(val) => setNumber(val)}
          />
          <TextInput
            label="Amount"
            placeholder="Enter amount"
            onChange={(val) => setAmount(val)}
          />

        <div className="pt-4">
          <button type="submit" disabled={loading} className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded">
             {loading ? "Processing..." : "Transfer"}
            </button>          
        </div>

          {message && <p className="text-green-700 mt-2">{message}</p>}
          {error && <p className="text-red-700 mt-2">{error}</p>}
        </form>
      </div>
    </Card>
  );
}
