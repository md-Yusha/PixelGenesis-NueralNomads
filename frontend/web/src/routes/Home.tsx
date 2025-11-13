import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Shield, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#050505] to-[#020202] opacity-90" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <header className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners">
              <span className="pixel-text text-[10px] text-[#06B6D4]">DECENTRALIZED IDENTITY</span>
            </div>
            <h1 className="pixel-text text-2xl sm:text-3xl text-white tracking-wide">
              WELCOME TO PIXELGENESIS
            </h1>
            <p className="max-w-2xl mx-auto text-base text-[#cbd5f5] leading-relaxed">
              A retro-futuristic portal for issuing, holding, and verifying verifiable credentials.
              Own your identity, prove your authenticity, and stay in control.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/auth/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/verifier/verify">
                <Button variant="outline" size="lg">
                  Verify Credentials
                </Button>
              </Link>
            </div>
          </header>

          <section className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4F46E5] pixel-corners flex items-center justify-center border-4 border-[#2a2a2a]">
                    <Wallet className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <h2 className="pixel-text text-sm text-white">HOLDER PORTAL</h2>
                </div>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  Securely store and present your credentials with full transparency and control.
                </p>
                <Link to="/holder/dashboard">
                  <Button className="w-full" variant="secondary">
                    Enter Dashboard
                  </Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#06B6D4] pixel-corners flex items-center justify-center border-4 border-[#2a2a2a]">
                    <Shield className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <h2 className="pixel-text text-sm text-white">ISSUER CONTROL</h2>
                </div>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  Generate tamper-proof credentials with on-chain proofs and instant revocation.
                </p>
                <Link to="/issuer/dashboard">
                  <Button className="w-full">Launch Console</Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#10B981] pixel-corners flex items-center justify-center border-4 border-[#2a2a2a]">
                    <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <h2 className="pixel-text text-sm text-white">VERIFIER SUITE</h2>
                </div>
                <p className="text-sm text-[#9ca3af] leading-relaxed">
                  Validate credentials instantly with cryptographic proofs and revocation checks.
                </p>
                <Link to="/verifier/verify">
                  <Button className="w-full" variant="secondary">
                    Start Verifying
                  </Button>
                </Link>
              </div>
            </Card>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <Card>
              <div className="space-y-4">
                <h3 className="pixel-text text-sm text-[#06B6D4]">WHY PIXELGENESIS?</h3>
                <ul className="space-y-3 text-sm text-[#9ca3af]">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#06B6D4]" />
                    Zero-knowledge proven credential verification
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#06B6D4]" />
                    Non-custodial wallet-first design
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#06B6D4]" />
                    Retro-inspired UI with modern cryptography
                  </li>
                </ul>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <h3 className="pixel-text text-sm text-[#4F46E5]">LIVE STATS</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Credentials', value: '128' },
                    { label: 'Issuers', value: '32' },
                    { label: 'Verifications', value: '864' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-[#1a1a1a] border-4 border-[#2a2a2a] pixel-corners p-3 text-center"
                    >
                      <div className="pixel-text text-xs text-white">{stat.value}</div>
                      <div className="pixel-text text-[9px] text-[#888] mt-1 uppercase">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          <footer className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-3 bg-[#0a0a0a] border-4 border-[#2a2a2a] pixel-corners">
              <Award className="w-4 h-4 text-[#4F46E5]" />
              <span className="pixel-text text-[10px] text-white uppercase">
                Ready to mint your first credential?
              </span>
            </div>
            <Link to="/holder/dashboard">
              <Button size="lg">Enter App</Button>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

