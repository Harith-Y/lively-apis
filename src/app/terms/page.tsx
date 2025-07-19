export default function TermsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">Terms of Service</h1>
        <p className="text-gray-700 mb-4">By using LivelyAPI, you agree to the following terms and conditions:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Use the platform responsibly and in accordance with all applicable laws.</li>
          <li>Do not attempt to abuse, hack, or disrupt the service.</li>
          <li>Respect the privacy and rights of other users.</li>
          <li>We reserve the right to suspend or terminate accounts for violations.</li>
        </ul>
        <p className="text-gray-600">These terms may be updated at any time. Continued use of the platform constitutes acceptance of the latest terms.</p>
      </div>
    </div>
  )
} 