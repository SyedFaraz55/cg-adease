import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <img src="\logo.svg" alt="Logo" className="mx-auto mb-8 h-16 w-auto" />
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
