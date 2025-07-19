import Link from 'next/link'
import { Bot, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">LivelyAPI</span>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Transform any API into conversational AI agents. Build, test, and deploy intelligent automation in minutes, not months.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/varshini-1396/lively-apis" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/builder" className="text-gray-600 hover:text-purple-600 transition-colors">Agent Builder</Link></li>
              <li><Link href="/playground" className="text-gray-600 hover:text-purple-600 transition-colors">Testing Playground</Link></li>
              <li><Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">Dashboard</Link></li>
              <li><Link href="/docs" className="text-gray-600 hover:text-purple-600 transition-colors">Documentation</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-purple-600 transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-purple-600 transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2025 LivelyAPI. Built for Suprathon 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}