export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">Your privacy is important to us. This Privacy Policy explains how LivelyAPI collects, uses, and protects your information.</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>We only collect information necessary to provide our services.</li>
          <li>Your data is never sold or shared with third parties without your consent.</li>
          <li>All data is stored securely and encrypted where possible.</li>
          <li>You can request deletion of your data at any time.</li>
        </ul>
        <p className="text-gray-600">For more details, please contact our support team.</p>
      </div>
    </div>
  )
} 