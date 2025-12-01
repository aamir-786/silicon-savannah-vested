'use client'

import Link from "next/link"
import { Building2, TrendingUp, Shield, Users, ArrowRight, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-mesh">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-[hsl(var(--primary))]" />
              <span className="text-xl font-bold gradient-text">Silicon Savannah Vested</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#properties" className="text-foreground/80 hover:text-foreground transition-colors">
                Properties
              </Link>
              <Link href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/api/auth/login"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/api/auth/signup"
                className="btn-premium text-sm px-6 py-2.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">SEC Compliant & Secure</span>
            </div>

            <h1 className="heading-1 mb-6 text-balance">
              Invest in <span className="gradient-text">Kenyan Real Estate</span> from Anywhere
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
              Own fractional shares in premium East African properties. Start with as little as $500 and earn regular dividends.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="btn-premium text-base px-8 py-4 w-full sm:w-auto"
              >
                Start Investing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/properties"
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 w-full sm:w-auto"
              >
                View Properties
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">$2.5M+</div>
                <div className="text-sm text-muted-foreground">Invested</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-muted-foreground">Investors</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">12.5%</div>
                <div className="text-sm text-muted-foreground">Avg. Return</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Why Choose Silicon Savannah Vested?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make international real estate investment simple, secure, and profitable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="premium-card p-8 text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">SEC Compliant</h3>
              <p className="text-muted-foreground">
                Fully regulated and compliant with U.S. securities laws for your protection
              </p>
            </div>

            <div className="premium-card p-8 text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">High Returns</h3>
              <p className="text-muted-foreground">
                Earn competitive returns through rental income and property appreciation
              </p>
            </div>

            <div className="premium-card p-8 text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Prime Properties</h3>
              <p className="text-muted-foreground">
                Carefully vetted real estate in Kenya's fastest-growing markets
              </p>
            </div>

            <div className="premium-card p-8 text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-brand mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Low Minimum</h3>
              <p className="text-muted-foreground">
                Start investing with as little as $500 - no need for millions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start investing in minutes with our simple 4-step process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-brand text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your account and complete KYC verification
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-brand text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse Properties</h3>
              <p className="text-muted-foreground">
                Explore vetted properties with detailed financials
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-brand text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Invest</h3>
              <p className="text-muted-foreground">
                Choose your shares and complete the investment securely
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-brand text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Returns</h3>
              <p className="text-muted-foreground">
                Receive quarterly dividends directly to your account
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/sign-up"
              className="btn-premium text-base px-8 py-4 inline-flex items-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">Your Investment, Secured</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We've partnered with industry-leading compliance and payment providers to ensure your investments are safe and transparent.
              </p>

              <div className="space-y-4">
                {[
                  "North Capital for SEC-compliant transactions",
                  "Dwolla for secure ACH transfers",
                  "Plaid for bank verification",
                  "DocuSign for legal documentation",
                  "Full audit trail and transparency",
                  "Quarterly performance reports",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="premium-card p-8 bg-gradient-brand text-white">
                <div className="mb-6">
                  <div className="text-sm opacity-80 mb-2">Total Portfolio Value</div>
                  <div className="text-4xl font-bold">$2,547,890</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm opacity-80 mb-1">Properties</div>
                    <div className="text-2xl font-semibold">8</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-80 mb-1">Avg. Return</div>
                    <div className="text-2xl font-semibold">12.5%</div>
                  </div>
                </div>

                <div className="h-32 bg-white/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-16 w-16 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="premium-card p-12 text-center bg-gradient-brand text-white">
            <h2 className="heading-2 mb-4">Ready to Start Building Wealth?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of investors who are already earning returns from Kenyan real estate
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold text-base bg-white text-[hsl(var(--primary))] hover:bg-white/90 transition-all duration-200"
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6 text-[hsl(var(--primary))]" />
                <span className="font-bold">Silicon Savannah Vested</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making international real estate investment accessible to everyone.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/properties" className="hover:text-foreground transition-colors">Properties</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclosures" className="hover:text-foreground transition-colors">Disclosures</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Silicon Savannah Vested. All rights reserved.</p>
            <p className="mt-2">Securities offered through North Capital. Member FINRA/SIPC.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
