import { useEffect, useState } from 'react';

export default function BarcodeScanner({ onScan, className = '' }) {
    const [isScanning, setIsScanning] = useState(false);
    const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

    useEffect(() => {
        // Load the library
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html5-qrcode';
        script.async = true;
        script.onload = () => setIsLibraryLoaded(true);
        document.body.appendChild(script);

        // Cleanup
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const startScanning = () => {
        if (!isLibraryLoaded) {
            alert('Barcode scanner library sedang dimuat. Silakan coba lagi.');
            return;
        }

        setIsScanning(true);
        const scanner = new window.Html5QrcodeScanner('barcode-scanner', {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.0
        });

        scanner.render((decodedText) => {
            onScan(decodedText);
            scanner.clear();
            setIsScanning(false);
        }, (error) => {
            console.warn(`QR error = ${error}`);
        });
    };

    return (
        <div className={className}>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={startScanning}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                    disabled={isScanning}
                >
                    {isScanning ? 'Scanning...' : 'Scan'}
                </button>
            </div>
            {isScanning && <div id="barcode-scanner" className="mt-2"></div>}
        </div>
    );
}
