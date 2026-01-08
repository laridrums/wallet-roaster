import React, { useState, useEffect } from 'react';
import { Flame, Wallet, Coffee, Twitter, Send, Languages, Zap } from 'lucide-react';

const WalletRoaster = () => {
  const [language, setLanguage] = useState('en');
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [addressError, setAddressError] = useState('');

  const translations = {
    en: {
      title: "Solana Wallet Roaster",
      subtitle: "Let's roast your portfolio like a true friend! 🔥",
      connectWallet: "Connect Seed Vault",
      disconnect: "Disconnect",
      analyzeWallet: "Roast My Wallet!",
      analyzing: "Analyzing your financial decisions...",
      buyMeCoffee: "Buy Me a Coffee ☕",
      shareTwitter: "Share on X",
      shareTelegram: "Share on Telegram",
      donation: "Support the Roaster",
      donationText: "Enjoyed the roast? Buy me a coffee!",
      processing: "Processing...",
      error: "Oops! Something went wrong. Try again!",
      noWallet: "No wallet connected. Connect your Seed Vault first!",
      generatingRoast: "Crafting the perfect roast...",
      orText: "OR",
      manualAddressTitle: "Scan Any Wallet",
      manualAddressPlaceholder: "Paste Solana address here...",
      analyzeAddress: "Analyze This Address",
      invalidAddress: "Invalid Solana address. Please check and try again.",
      addressRequired: "Please enter a wallet address.",
    },
    fr: {
      title: "Critique de Wallet Solana",
      subtitle: "Laisse-moi chambrer ton portefeuille comme un vrai pote ! 🔥",
      connectWallet: "Connecter Seed Vault",
      disconnect: "Déconnecter",
      analyzeWallet: "Chambre Mon Wallet !",
      analyzing: "Analyse de tes décisions financières...",
      buyMeCoffee: "Paie-moi un café ☕",
      shareTwitter: "Partager sur X",
      shareTelegram: "Partager sur Telegram",
      donation: "Soutenir le Chambreur",
      donationText: "Tu as aimé ? Paie-moi un café !",
      processing: "En cours...",
      error: "Oups ! Quelque chose s'est mal passé. Réessaye !",
      noWallet: "Aucun wallet connecté. Connecte ton Seed Vault d'abord !",
      generatingRoast: "Création de la meilleure critique...",
      orText: "OU",
      manualAddressTitle: "Scanner N'importe Quel Wallet",
      manualAddressPlaceholder: "Colle l'adresse Solana ici...",
      analyzeAddress: "Analyser Cette Adresse",
      invalidAddress: "Adresse Solana invalide. Vérifie et réessaye.",
      addressRequired: "Entre une adresse de wallet s'il te plaît.",
    }
  };

  const t = translations[language];

  // Validate Solana address format
  const isValidSolanaAddress = (address) => {
    // Basic validation: Solana addresses are base58 encoded and typically 32-44 characters
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  };

  // Simulate Seeker Seed Vault connection
  const connectSeedVault = async () => {
    try {
      setLoading(true);
      
      // In production, this would use the actual Seeker SDK
      // For now, we'll simulate the connection
      if (typeof window !== 'undefined' && window.seedvault) {
        // Real Seeker integration would go here
        const response = await window.seedvault.connect();
        setWalletAddress(response.publicKey);
        setConnected(true);
      } else {
        // Simulation for demo purposes
        setTimeout(() => {
          const demoAddress = 'Demo' + Math.random().toString(36).substring(2, 15);
          setWalletAddress(demoAddress);
          setConnected(true);
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress('');
    setWalletData(null);
    setRoast('');
  };

  const analyzeManualAddress = () => {
    setAddressError('');
    
    if (!manualAddress.trim()) {
      setAddressError(t.addressRequired);
      return;
    }

    if (!isValidSolanaAddress(manualAddress.trim())) {
      setAddressError(t.invalidAddress);
      return;
    }

    // Set the wallet address and analyze
    setWalletAddress(manualAddress.trim());
    setConnected(false); // Not connected via Seed Vault
    analyzeWallet(manualAddress.trim());
  };

  const analyzeWallet = async (addressToAnalyze = null) => {
    const targetAddress = addressToAnalyze || walletAddress;
    
    if (!targetAddress && !connected) {
      alert(t.noWallet);
      return;
    }

    setLoading(true);
    setRoast('');

    try {
      // Vérifier si on a une clé API
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        // Pas de clé API = utiliser les critiques de test
        const mockRoasts = {
          fr: [
            "😂 Alors comme ça on investit dans BONK ? Ton portefeuille ressemble à une blague qui a mal tourné !",
            "🐕 WIF, BONK, PEPE... T'as transformé ton wallet en ménagerie ou quoi ?",
            "💀 Sérieux, avec un portefeuille pareil, j'espère que t'as gardé ton CV à jour !",
          ],
          en: [
            "😂 So you're investing in BONK? Your portfolio looks like a joke that went wrong!",
            "🐕 WIF, BONK, PEPE... Did you turn your wallet into a zoo or what?",
            "💀 Seriously, with a portfolio like that, I hope you kept your resume updated!",
          ]
        };
        const roastList = mockRoasts[language];
        const generatedRoast = roastList[Math.floor(Math.random() * roastList.length)];
        setRoast(generatedRoast);
      } else {
        // Clé API présente = utiliser la VRAIE IA Claude
        const roastPrompt = language === 'fr' 
          ? `Tu es un pote qui chambre gentiment son ami sur son portefeuille crypto. Génère une critique humoristique et amicale (pas méchante) en français du portefeuille suivant. Utilise un ton de pote qui se moque gentiment, avec des blagues sur les tokens meme, les choix d'investissement, etc. Maximum 4-5 phrases courtes et percutantes.

Portefeuille analysé:
- Adresse: ${targetAddress}
- Tokens: ${mockWalletData.tokens.map(t => `${t.name} (${t.amount.toFixed(2)} tokens, ~$${t.value.toFixed(2)})`).join(', ')}
- NFTs: ${mockWalletData.nfts}
- Valeur totale: $${mockWalletData.totalValue.toFixed(2)}
- Nombre de transactions: ${mockWalletData.transactionCount}

Fais une critique personnalisée basée sur ces données réelles. Mentionne les tokens spécifiques et les montants pour que ce soit vraiment personnalisé !`
          : `You're a friend playfully roasting your buddy about their crypto portfolio. Generate a humorous and friendly (not mean) roast in English about the following wallet. Use a friendly tone with jokes about meme tokens, investment choices, etc. Maximum 4-5 short punchy sentences.

Analyzed wallet:
- Address: ${targetAddress}
- Tokens: ${mockWalletData.tokens.map(t => `${t.name} (${t.amount.toFixed(2)} tokens, ~$${t.value.toFixed(2)})`).join(', ')}
- NFTs: ${mockWalletData.nfts}
- Total value: $${mockWalletData.totalValue.toFixed(2)}
- Transaction count: ${mockWalletData.transactionCount}

Make a personalized roast based on this real data. Mention the specific tokens and amounts to make it truly customized!`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              { role: "user", content: roastPrompt }
            ],
          })
        });

        const data = await response.json();
        const generatedRoast = data.content.find(block => block.type === 'text')?.text || t.error;
        
        setRoast(generatedRoast);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setRoast(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async (amount) => {
    setLoading(true);
    try {
      // In production, integrate with Seeker's payment system
      // This would transfer SOL to cryptoric89.skr
      if (typeof window !== 'undefined' && window.seedvault) {
        await window.seedvault.transfer({
          to: 'cryptoric89.skr',
          amount: amount,
          currency: 'SOL'
        });
        alert(`Thank you for the ${amount} SOL donation! ❤️`);
      } else {
        // Demo alert
        alert(`Demo: Would send ${amount} SOL to cryptoric89.skr`);
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert(t.error);
    } finally {
      setLoading(false);
      setShowDonation(false);
    }
  };

  const shareOnTwitter = () => {
    const appUrl = 'https://seeker.app/wallet-roaster'; // Replace with your actual app URL
    const text = language === 'fr'
      ? `Mon wallet Solana vient de se faire chambrer ! 😂🔥\n\n${roast}\n\nEssayez le Wallet Roaster ici:`
      : `Just got my Solana wallet roasted! 😂🔥\n\n${roast}\n\nTry the Wallet Roaster here:`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnTelegram = () => {
    const appUrl = 'https://seeker.app/wallet-roaster'; // Replace with your actual app URL
    const text = language === 'fr'
      ? `Mon wallet Solana vient de se faire chambrer ! 😂🔥\n\n${roast}\n\nEssayez le Wallet Roaster ici: ${appUrl}`
      : `Just got my Solana wallet roasted! 😂🔥\n\n${roast}\n\nTry the Wallet Roaster here: ${appUrl}`;
    
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-orange-900 text-white p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4 animate-bounce" style={{animationDuration: '2s'}}>
            <Flame className="w-12 h-12 text-orange-500" />
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent" 
                style={{fontFamily: '"Comic Sans MS", "Marker Felt", cursive'}}>
              {t.title}
            </h1>
            <Flame className="w-12 h-12 text-orange-500" />
          </div>
          <p className="text-xl text-purple-200 font-bold" style={{fontFamily: 'monospace'}}>
            {t.subtitle}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            <Languages className="w-4 h-4" />
            <span className="font-bold">{language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 border-4 border-purple-500/50 shadow-2xl shadow-purple-500/20 mb-6">
          {/* Wallet Connection */}
          <div className="text-center mb-8">
            {!connected ? (
              <button
                onClick={connectSeedVault}
                disabled={loading}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50"
              >
                <span className="flex items-center gap-3">
                  <Wallet className="w-6 h-6" />
                  {loading ? t.processing : t.connectWallet}
                  <Zap className="w-6 h-6 animate-pulse" />
                </span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-green-400 font-bold text-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-mono">{walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-6 py-2 bg-red-600/50 hover:bg-red-600/70 rounded-xl transition-all duration-300 text-sm"
                >
                  {t.disconnect}
                </button>
              </div>
            )}
          </div>

          {/* OR Divider */}
          {!connected && (
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              <span className="text-purple-300 font-bold text-lg px-4">{t.orText}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            </div>
          )}

          {/* Manual Address Input */}
          {!connected && (
            <div className="mb-8">
              <h3 className="text-center text-xl font-bold text-purple-200 mb-4">
                {t.manualAddressTitle}
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => {
                    setManualAddress(e.target.value);
                    setAddressError('');
                  }}
                  placeholder={t.manualAddressPlaceholder}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-purple-500/50 rounded-xl text-white placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-all duration-300 font-mono"
                />
                {addressError && (
                  <p className="text-red-400 text-sm text-center font-semibold">
                    ⚠️ {addressError}
                  </p>
                )}
                <button
                  onClick={analyzeManualAddress}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/50"
                >
                  {loading ? t.processing : t.analyzeAddress}
                </button>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          {connected && walletAddress && (
            <div className="text-center mb-8">
              <button
                onClick={() => analyzeWallet()}
                disabled={loading}
                className="group relative px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-2xl font-black text-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-orange-500/50 animate-pulse"
                style={{animationDuration: '2s'}}
              >
                <span className="flex items-center gap-3">
                  <Flame className="w-8 h-8" />
                  {loading ? t.generatingRoast : t.analyzeWallet}
                  <Flame className="w-8 h-8" />
                </span>
              </button>
            </div>
          )}

          {/* Display current analyzed address */}
          {walletAddress && !connected && (
            <div className="text-center mb-6">
              <p className="text-purple-300 text-sm mb-2">🔍 Analyzing wallet:</p>
              <p className="text-purple-100 font-mono text-sm bg-black/30 px-4 py-2 rounded-lg inline-block">
                {walletAddress.substring(0, 12)}...{walletAddress.substring(walletAddress.length - 12)}
              </p>
            </div>
          )}

          {/* Roast Display */}
          {roast && (
            <div className="mb-8 animate-fadeIn">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border-2 border-purple-400/50 shadow-xl">
                <p className="text-lg md:text-xl leading-relaxed text-purple-100 font-semibold" 
                   style={{fontFamily: 'Georgia, serif'}}>
                  {roast}
                </p>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
                >
                  <Twitter className="w-5 h-5" />
                  {t.shareTwitter}
                </button>
                <button
                  onClick={shareOnTelegram}
                  className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-xl transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  {t.shareTelegram}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Buy Me a Coffee Section */}
        <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 backdrop-blur-xl rounded-3xl p-6 border-2 border-yellow-500/50">
          <div className="text-center">
            <h3 className="text-2xl font-black mb-3 flex items-center justify-center gap-2">
              <Coffee className="w-8 h-8 text-yellow-400" />
              {t.donation}
            </h3>
            <p className="text-yellow-100 mb-4 font-semibold">
              {t.donationText}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[0.01, 0.1, 1].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleDonation(amount)}
                  disabled={loading || !connected}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  ☕ {amount} SOL
                </button>
              ))}
            </div>
            <p className="text-xs text-yellow-200/70 mt-3 font-mono">
              → cryptoric89.skr
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300 text-sm">
          <p className="font-bold">🔥 Built for Seeker Airdrop • Powered by Claude AI 🔥</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WalletRoaster;
