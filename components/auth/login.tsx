"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

type LoginViewProps = {
    email: string
    password: string
    showPassword: boolean
    isSubmitting: boolean
    errorMessage: string
    onEmailChange: (value: string) => void
    onPasswordChange: (value: string) => void
    onTogglePassword: () => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onGoogleSignIn?: () => void
}

export default function Login({
    email,
    password,
    showPassword,
    isSubmitting,
    errorMessage,
    onEmailChange,
    onPasswordChange,
    onTogglePassword,
    onSubmit,
    onGoogleSignIn,
}: LoginViewProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#000000] px-4 py-4 text-[#E2E8F0] sm:px-6 lg:px-8">
            <div className="grid w-full max-w-6xl min-h-[580px] items-stretch gap-6 lg:grid-cols-2">
                <section
                    className="relative hidden min-h-[580px] overflow-hidden rounded-lg border border-[#222631] shadow-2xl lg:block"
                >
                    <Image
                        src="/Issueforgeimg.png"
                        alt="IssueForge workspace"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.35)_40%,rgba(0,0,0,0.85)_100%)]" />

                    <div className="relative z-10 flex h-full flex-col p-7">
                        <div>
                            <div className="text-xl font-semibold text-[#E2E8F0]">IssueForge</div>
                        </div>

                        <div className="mt-auto max-w-md pb-5">
                            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#E2E8F0] xl:text-4xl">
                                Work without
                                <br />
                                the chaos.
                            </h2>

                            <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                                Organize projects, collaborate effortlessly, and stay in control—
                                all from one workspace built for modern teams.
                            </p>

                            <div className="mt-5 flex items-center gap-2">
                                <span className="h-1.5 w-8 rounded-full bg-[#DDE1E5]/60" />
                                <span className="h-1.5 w-8 rounded-full bg-[#DDE1E5]/40" />
                                <span className="h-1.5 w-8 rounded-full bg-[#E2E8F0]" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex min-h-[580px] items-center justify-center rounded-lg px-4 py-8 sm:px-8">
                    <div className="w-full max-w-120">
                        <div className="mx-auto max-w-110 py-1">
                            <div className="space-y-0.5">
                                <h1 className="text-3xl font-medium tracking-tight text-[#E2E8F0] sm:text-4xl pb-1">
                                    Welcome Back!
                                </h1>
                                <p className="text-xs sm:text-sm text-[#94A3B8]">
                                    Welcome Back! Please enter your details!
                                </p>
                            </div>

                            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => onEmailChange(e.target.value)}
                                        placeholder="Email"
                                        className="h-10 rounded-sm border-[#222631] bg-[#1A1D24] pl-11 text-[#E2E8F0] placeholder:text-[#94A3B8] focus-visible:border-[#DDE1E5] focus-visible:ring-[#DDE1E5]/30"
                                    />
                                </div>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => onPasswordChange(e.target.value)}
                                        placeholder="Enter your password"
                                        className="h-10 rounded-sm border-[#222631] bg-[#1A1D24] pr-11 text-[#E2E8F0] placeholder:text-[#94A3B8] focus-visible:border-[#DDE1E5] focus-visible:ring-[#DDE1E5]/30"
                                    />

                                    <button
                                        type="button"
                                        onClick={onTogglePassword}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-[#94A3B8] transition-colors hover:text-[#E2E8F0] cursor-pointer"
                                    >
                                        {showPassword ? (
                                             <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-10 w-full mt-1 rounded-sm bg-[#ffffff] text-sm font-medium text-black hover:bg-gray-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                                >
                                    {isSubmitting ? "Signing in..." : "Sign in"}
                                </Button>

                                <div className="flex items-center gap-4 py-0.5">
                                    <Separator className="flex-1 bg-[#222631]" />
                                    <span className="shrink-0 text-xs text-[#94A3B8]">
                                        Or sign in with
                                    </span>
                                    <Separator className="flex-1 bg-[#222631]" />
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onGoogleSignIn}
                                    disabled={isSubmitting}
                                    className="h-10 w-full rounded-sm border-[#222631] bg-transparent text-[#E2E8F0] hover:bg-[#171A21] hover:text-[#E2E8F0] flex items-center justify-center gap-2.5 cursor-pointer font-normal disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        />
                                    </svg>
                                    Sign in with Google
                                </Button>
                                <div className="pt-2 text-center">
                                    <p className="text-xs sm:text-sm text-[#94A3B8]">
                                        Doesn't have an account yet?{" "}
                                        <Link href="/register" className="underline underline-offset-4 text-[#E2E8F0] hover:text-[#E2E8F0]">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}