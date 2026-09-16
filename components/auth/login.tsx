"use client"

import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Mail } from "lucide-react"

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
}: LoginViewProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#000000] px-4 py-6 text-[#E2E8F0] sm:px-6 lg:px-8">
            <div className="grid w-full max-w-7xl items-start gap-2 lg:grid-cols-[1fr_1fr]">
                <section
                    className="relative hidden h-175 overflow-hidden rounded-lg border border-[#222631] bg-[url('/images/login-hero.jpg')] bg-cover bg-center shadow-2xl lg:block"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,17,21,0.22)_0%,rgba(15,17,21,0.28)_45%,rgba(15,17,21,0.9)_100%)]" />

                    <div className="relative z-10 flex h-full flex-col p-8">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-semibold text-[#E2E8F0]">IssueForge</div>
                            <Button
                                asChild
                                variant="secondary"
                                className="rounded-full border border-[#222631] bg-[#1A1D24] px-4 text-sm text-[#E2E8F0] shadow-none hover:bg-[#171A21]"
                            >
                                <Link href="/">
                                    Back to website
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-auto max-w-md pb-10">
                            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-[#E2E8F0] xl:text-5xl">
                                Work without
                                <br />
                                the chaos.
                            </h2>

                            <p className="mt-4 text-base leading-7 text-[#94A3B8]">
                                Organize projects, collaborate effortlessly, and stay in control—
                                all from one workspace built for modern teams.
                            </p>

                            <div className="mt-8 flex items-center gap-2">
                                <span className="h-1.5 w-8 rounded-full bg-[#5E6AD2]/60" />
                                <span className="h-1.5 w-8 rounded-full bg-[#5E6AD2]/40" />
                                <span className="h-1.5 w-8 rounded-full bg-[#E2E8F0]" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center rounded-[1.5rem] px-5 py-20 sm:px-8">
                    <div className="w-full max-w-125">
                        <div className="mx-auto max-w-110 py-2 sm:py-4">
                            <div className="space-y-0">
                                <h1 className="text-4xl tracking-tight text-[#E2E8F0] sm:text-5xl pb-3">
                                    Welcome Back!
                                </h1>
                                <p className="text-sm text-[#94A3B8]">
                                    Welcome Back! Please enter your details!
                                </p>
                            </div>

                            <form className="mt-12 space-y-7" onSubmit={onSubmit}>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => onEmailChange(e.target.value)}
                                        placeholder="Email"
                                        className="h-11 rounded-sm border-[#222631] bg-[#1A1D24] pl-11 text-[#E2E8F0] placeholder:text-[#94A3B8] focus-visible:border-[#5E6AD2] focus-visible:ring-[#5E6AD2]/30"
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
                                        className="h-11 rounded-sm border-[#222631] bg-[#1A1D24] pr-11 text-[#E2E8F0] placeholder:text-[#94A3B8] focus-visible:border-[#5E6AD2] focus-visible:ring-[#5E6AD2]/30"
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

                                {errorMessage ? (
                                    <p className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-200">
                                        {errorMessage}
                                    </p>
                                ) : null}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-11 w-full mt-2 rounded-sm bg-[#ffffff] text-sm font-medium text-black hover:bg-gray-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                                >
                                    {isSubmitting ? "Signing in..." : "Sign in"}
                                </Button>

                                <div className="flex items-center gap-4 py-1">
                                    <Separator className="flex-1 bg-[#222631]" />
                                    <span className="shrink-0 text-sm text-[#94A3B8]">
                                        Or sign in with
                                    </span>
                                    <Separator className="flex-1 bg-[#222631]" />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 rounded-sm border-[#222631] bg-transparent text-[#E2E8F0] hover:bg-[#171A21] hover:text-[#E2E8F0]"
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                            <path fill="#EA4335" d="M12 10.2v3.95h5.62c-.24 1.38-1.52 4.04-5.62 4.04A6.87 6.87 0 0 1 12 4.95c1.96 0 3.28.84 4.04 1.56l2.76-2.66C16.03 1.52 14.23.5 12 .5 6.48.5 2 4.98 2 10.5S6.48 20.5 12 20.5c5.74 0 9.55-4.03 9.55-9.72 0-.65-.07-1.14-.16-1.64H12Z" />
                                        </svg>
                                        Google
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 rounded-sm border-[#222631] bg-transparent text-[#E2E8F0] hover:bg-[#171A21] hover:text-[#E2E8F0]"
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                                            <path d="M17.05 20.28c-.98.95-2.06.79-3.08.35-1.08-.45-2.08-.47-3.22 0-1.43.58-2.19.41-3.05-.35C2.76 15.84 3.45 8.88 7.62 8.6c1.1.06 1.87.63 2.52.68.96-.19 1.88-.78 2.91-.71 1.24.1 2.18.59 2.82 1.49-2.56 1.53-2.16 4.96.39 6.03-.54 1.44-1.23 2.86-3.21 4.19Zm-2.09-15.9c.2-1.82 1.7-3.29 3.32-3.44.22 1.98-1.46 3.54-3.32 3.44Z" />
                                        </svg>
                                        Apple
                                    </Button>
                                </div>
                                <div className="pt-4 text-center">
                                    <p className="text-sm text-[#94A3B8]">
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