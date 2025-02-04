import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-700 bg-clip-text text-transparent animate-pulse">
            Feedy - AI Feedback Generator
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Experience the future of team management.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Link 
              to="/chat" 
              className="group relative bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-2xl font-semibold text-white mt-4 mb-2">AI Chat Bot</h2>
              <p className="text-gray-400">Interactive conversation with our flagship model</p>
            </Link>

            <Link
              to="/newChat"
              className="group relative bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-2xl font-semibold text-white mt-4 mb-2">New Session</h2>
              <p className="text-gray-400">Start a fresh conversation thread</p>
            </Link>

            <Link
              to="/admin-route"
              className="group relative bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-2xl font-semibold text-white mt-4 mb-2">Admin Console</h2>
              <p className="text-gray-400">Manage conversations</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
