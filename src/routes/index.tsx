import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Link to='/chat'>ChatBot</Link>
      <br />
      <Link to='/newChat'>NewChatBot</Link>
    </div>
  )
}
