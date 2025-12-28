import PixPayment from '@/components/PixPayment';

export default function TestPixPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-8 text-blue-800">Teste de Integração Mercado Pago PIX</h1>

            <div className="w-full max-w-md">
                <PixPayment
                    amount={20.00}
                    productName="Produto Teste 20 Reais"
                />
            </div>

            <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded max-w-md">
                <p className="font-bold">Nota:</p>
                <p>Para que o QR Code seja gerado, você precisa adicionar um Access Token válido no arquivo <code>.env</code> na variável <code>MP_ACCESS_TOKEN</code>.</p>
            </div>
        </div>
    );
}
