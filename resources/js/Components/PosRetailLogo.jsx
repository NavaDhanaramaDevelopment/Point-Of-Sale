export default function PosRetailLogo({ className = "h-8 w-8" }) {
    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <div className="relative">
                {/* Main logo with transparent background */}
                <div className="w-16 h-16 flex items-center justify-center relative">
                    {/* Your TOKAKU character image */}
                    <img
                        src="/logo.png"
                        alt="TOKAKU Character"
                        className="w-10 h-10 object-contain z-10 drop-shadow-lg rounded-full"
                        onError={(e) => {
                            // Fallback if image not found
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                    {/* Fallback circle with gradient (hidden by default) */}
                    <div
                        className="w-12 h-12 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-full shadow-lg items-center justify-center overflow-hidden absolute inset-0"
                        style={{ display: 'none' }}
                    >
                        <span className="text-white font-bold text-xl z-10 drop-shadow-sm">T</span>
                    </div>
                </div>
                {/* Floating sparkle elements around the character */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse sparkle-animation"></div>
                <div className="absolute top-2 -left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping delay-500"></div>
                <div className="absolute -bottom-1 right-1 w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-2 -left-2 w-1 h-1 bg-yellow-200 rounded-full animate-pulse delay-700"></div>
            </div>
            <div className="flex flex-col">
                <span className="text-orange-600 font-bold text-xl leading-tight tracking-wide">TOKAKU</span>
                <span className="text-orange-500/80 text-xs leading-none font-medium">Aplikasi Toko Kasir Ku</span>
            </div>
        </div>
    );
}
