import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl">LinguaLearn</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Courses
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Master Languages with Revolutionary Methods
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Experience accelerated language learning through TPR, immersive storytelling, and joyful learning methodologies.
                </p>
              </div>
              <div className="space-x-4">
                <a
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="/register"
                >
                  Get Started
                </a>
                <a
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="#"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}

function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}

function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <a className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl">LinguaLearn</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Dashboard
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Courses
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Profile
          </a>
          <button className="text-sm font-medium hover:underline underline-offset-4">
            Logout
          </button>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track your progress and continue your language learning journey
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-2xl font-semibold whitespace-nowrap">Courses Enrolled</h3>
                <p className="text-sm text-muted-foreground">Your active courses</p>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold">3</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-2xl font-semibold whitespace-nowrap">Progress</h3>
                <p className="text-sm text-muted-foreground">Average completion</p>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold">67%</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-2xl font-semibold whitespace-nowrap">Study Streak</h3>
                <p className="text-sm text-muted-foreground">Consecutive days</p>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold">7</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-2xl font-semibold whitespace-nowrap">Certificates</h3>
                <p className="text-sm text-muted-foreground">Earned achievements</p>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold">2</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App