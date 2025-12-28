'use client';

import { useState } from 'react';

interface PixPaymentProps {
    amount: number;
    productName: string;
}

export default function PixPayment({ amount, productName }: PixPaymentProps) {
    const [loading, setLoading] = useState(false);
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
    const [copyPasteCode, setCopyPasteCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePix = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/payment/pix', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    description: `Pagamento de ${productName}`,
                    email: 'cliente@exemplo.com',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao gerar PIX');
            }

            setQrCodeBase64(data.qr_code_base64);
            setCopyPasteCode(data.qr_code);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (copyPasteCode) {
            navigator.clipboard.writeText(copyPasteCode);
            alert('Código PIX copiado!');
        }
    };

    return (
        <div className="flex flex-col items-center p-6 border rounded-lg shadow-md max-w-sm mx-auto bg-white">
            <h3 className="text-xl font-bold mb-4">Pagamento via PIX</h3>
            <p className="mb-4 text-gray-700">Produto: {productName}</p>
            <p className="mb-6 text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
            </p>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            {!qrCodeBase64 ? (
                <button
                    onClick={handleGeneratePix}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Gerando...' : 'Gerar QR Code PIX'}
                </button>
            ) : (
                <div className="flex flex-col items-center w-full">
                    <div className="mb-4">
                        <img
                            src={`data:image/png;base64,${qrCodeBase64}`}
                            alt="QR Code PIX"
                            className="w-64 h-64 border rounded"
                        />
                    </div>

                    <div className="w-full mb-4">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Código Copia e Cola:</p>
                        <textarea
                            readOnly
                            value={copyPasteCode || ''}
                            className="w-full p-2 border rounded bg-gray-50 text-xs h-24 resize-none"
                        />
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200"
                    >
                        Copiar Código
                    </button>
                </div>
            )}
        </div>
    );
}
