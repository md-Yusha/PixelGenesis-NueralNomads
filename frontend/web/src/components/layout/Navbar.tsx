import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { config } from '@/config/env';
import { apiClient } from '@/lib/apiClient';

export const Navbar: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const token = apiClient.getToken();

  const handleLogout = () => {
    apiClient.clearToken();
    disconnect();
    navigate('/auth/login');
  };

  const isCorrectChain = chainId === config.chainId;
  const truncatedAddress = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : '';

  return (
    <nav className="bg-[#0f0f0f] border-b-4 border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="pixel-text text-sm text-white hover:text-[#06B6D4] transition-colors">
              PIXELGENESIS
            </Link>
            {token && (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/holder/dashboard"
                  className="px-3 py-2 pixel-text text-[10px] text-[#888] hover:text-white hover:border-[#4F46E5] border-2 border-transparent pixel-corners transition-colors"
                >
                  Holder
                </Link>
                <Link
                  to="/issuer/dashboard"
                  className="px-3 py-2 pixel-text text-[10px] text-[#888] hover:text-white hover:border-[#06B6D4] border-2 border-transparent pixel-corners transition-colors"
                >
                  Issuer
                </Link>
                <Link
                  to="/verifier/verify"
                  className="px-3 py-2 pixel-text text-[10px] text-[#888] hover:text-white hover:border-[#10B981] border-2 border-transparent pixel-corners transition-colors"
                >
                  Verifier
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Network Indicator */}
            {isConnected && (
              <div className="hidden sm:flex items-center space-x-2">
                {truncatedAddress && (
                  <span className="hidden lg:inline-flex px-3 py-1 pixel-text text-[9px] text-white bg-[#1a1a1a] border-2 border-[#2a2a2a] pixel-corners">
                    {truncatedAddress}
                  </span>
                )}
                {isCorrectChain ? (
                  <span className="px-3 py-1 pixel-text text-[9px] text-[#10B981] bg-[#1a1a1a] border-2 border-[#10B981] pixel-corners">
                    CHAIN {chainId}
                  </span>
                ) : (
                  <span className="px-3 py-1 pixel-text text-[9px] text-[#EF4444] bg-[#1a1a1a] border-2 border-[#EF4444] pixel-corners">
                    WRONG CHAIN · {config.chainId}
                  </span>
                )}
              </div>
            )}

            {/* Wallet Connection */}
            <ConnectButton />

            {/* Auth Buttons */}
            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 pixel-text text-[10px] text-[#888] hover:text-white hover:border-[#EF4444] border-2 border-transparent pixel-corners transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 pixel-text text-[10px] text-[#888] hover:text-white hover:border-[#4F46E5] border-2 border-transparent pixel-corners transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 pixel-text text-[10px] text-white bg-[#4F46E5] border-4 border-[#2a2a2a] pixel-corners hover:border-[#4F46E5] hover:bg-[#4338CA] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

