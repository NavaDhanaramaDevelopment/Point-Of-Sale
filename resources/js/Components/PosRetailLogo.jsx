export default function PosRetailLogo({ className = "h-8 w-8" }) {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">R</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
                <span className="text-blue-600 font-bold text-lg leading-none">POS</span>
                <span className="text-blue-500 text-xs leading-none">Retail</span>
            </div>
        </div>
    );
}
