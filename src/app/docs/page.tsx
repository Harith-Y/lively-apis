export default function DocsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">Documentation</h1>
        <p className="text-gray-700 mb-4">Welcome to the LivelyAPI documentation. Here you&apos;ll find guides, API references, and best practices to help you build and deploy AI agents with ease.</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Getting Started: Learn how to set up your project and connect APIs.</li>
          <li>Agent Builder: Step-by-step guide to creating conversational agents.</li>
          <li>Playground: Test and iterate on your agents in real time.</li>
          <li>Deployment: How to deploy your agents to production.</li>
          <li>FAQ: Frequently asked questions and troubleshooting tips.</li>
        </ul>
        <p className="text-gray-600">More detailed documentation coming soon!</p>
      </div>
    </div>
  )
} 