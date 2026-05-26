import React from "react";
import { useDisputes } from "../lib/disputes";

const DisputesPage: React.FC = () => {
  const { data, isLoading, error } = useDisputes();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Disputes</h1>
      <p className="mb-4">Here you can view and manage your disputes. This page will show all disputes you are involved in, allow you to create a new dispute, and participate in Q&A if you are an admin.</p>
      {isLoading && (
        <div className="text-gray-500">Loading disputes...</div>
      )}
      {error && (
        <div className="text-red-500">Failed to load disputes.</div>
      )}
      {data && data.length === 0 && (
        <div className="border rounded p-4 bg-gray-50 text-gray-600">
          <em>No disputes found.</em>
        </div>
      )}
      {data && data.length > 0 && (
        <ul className="space-y-4">
          {data.map((dispute) => (
            <li key={dispute.id} className="border rounded p-4 bg-white shadow">
              <div className="font-semibold">Dispute #{dispute.id}</div>
              <div className="text-sm text-gray-600 mb-1">Reason: {dispute.reason}</div>
              <div className="text-xs text-gray-500 mb-1">Status: {dispute.status}</div>
              <div className="text-xs text-gray-400">Created: {new Date(dispute.created_at).toLocaleString()}</div>
              {dispute.verdict && (
                <div className="text-xs text-green-700 mt-1">Verdict: {dispute.verdict}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisputesPage;
