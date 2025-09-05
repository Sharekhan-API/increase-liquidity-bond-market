"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page on app load
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-blue-600 p-4 rounded-lg inline-block mb-4">
          <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-blue-600 mb-2">MBond</h1>
        <p className="text-gray-600">Master Indian Bond Markets</p>
        <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
      </div>
    </div>
  );
}
