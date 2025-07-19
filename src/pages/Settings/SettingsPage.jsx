import { useState } from "react";
import { useAuth } from "../../shared/api/useAuth";
import { Card } from "../../shared/ui/Card";
import { AlertCircle, CheckCircle } from "lucide-react";

export const SettingsPage = () => {
  const { logout } = useAuth();
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = () => {
    setError("");
    setSuccess("");
    if (passwords.new.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match.");
      return;
    }
    // In a real app, you'd call an API here.
    setSuccess("Password changed successfully!");
    setPasswords({ new: "", confirm: "" });
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <main className="p-6">
      <Card className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              New Password
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, new: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirm: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              {success}
            </div>
          )}
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={logout}
            className="w-full mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </Card>
    </main>
  );
};
