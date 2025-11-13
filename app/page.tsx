import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Zo Agenda
        </h1>
        <p className="text-center text-xl mb-8">
          Multi-Tenant Digital Appointment System
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Stack</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>✅ Next.js 15 + React 19</li>
            <li>✅ TypeScript</li>
            <li>✅ Tailwind CSS + shadcn/ui</li>
            <li>✅ Jotai (State Management)</li>
            <li>✅ Framer Motion (Animations)</li>
            <li>✅ react-big-calendar</li>
            <li>✅ Supabase (Database + Auth)</li>
            <li>✅ GraphQL + Apollo</li>
            <li>✅ Google Calendar Integration</li>
            <li>✅ Prisma ORM</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
