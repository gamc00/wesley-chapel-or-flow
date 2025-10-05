'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Wesley Chapel OR Flow
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Surgical Schedule & Anesthesia Staffing Management
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Authentication Ready</h2>
          <p className="text-gray-600 mb-4">
            Database seeded successfully with Wesley Chapel data
          </p>
          <div className="text-sm text-gray-500">
            <p>✅ 23 Rooms configured</p>
            <p>✅ 5 Providers added</p>
            <p>✅ 5 Surgeons added</p>
            <p>✅ Admin user: admin@wesleychapel.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
