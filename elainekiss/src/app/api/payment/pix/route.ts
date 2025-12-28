import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, description, email, firstName, lastName } = body;

        if (!process.env.MP_ACCESS_TOKEN) {
            return NextResponse.json(
                { error: 'Server configuration error: MP_ACCESS_TOKEN not found' },
                { status: 500 }
            );
        }

        const payment = new Payment(client);

        const result = await payment.create({
            body: {
                transaction_amount: Number(amount),
                description: description || 'Compra online',
                payment_method_id: 'pix',
                payer: {
                    email: email || 'test@test.com',
                    first_name: firstName || 'Test',
                    last_name: lastName || 'User',
                },
            },
        });

        return NextResponse.json({
            id: result.id,
            status: result.status,
            qr_code: result.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
            ticket_url: result.point_of_interaction?.transaction_data?.ticket_url,
        });

    } catch (error: any) {
        console.error('Mercado Pago Error:', error);
        return NextResponse.json(
            { error: error.message || 'Error processing payment' },
            { status: 500 }
        );
    }
}
