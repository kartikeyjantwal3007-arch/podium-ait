import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { certId, requesterRole, pin, certDetails } = body;

    // Only General Secretary has authorized signing responsibilities
    if (requesterRole !== 'GENERAL_SECRETARY') {
      return NextResponse.json(
        { error: 'Unauthorized: Only the General Secretary possesses institutional certificate approval & cryptographic signing authority.' },
        { status: 403 }
      );
    }

    if (!pin || pin.length < 4) {
      return NextResponse.json(
        { error: 'Valid General Secretary Signing PIN required.' },
        { status: 400 }
      );
    }

    // Server-side cryptographic signature calculation (SHA-256 HMAC / Hash)
    const signaturePayload = `${certId}:${certDetails?.recipientRollNo || 'AIT'}:${certDetails?.competitionId || '2026'}:${Date.now()}`;
    const signatureHash = `SHA256:${crypto.createHash('sha256').update(signaturePayload).digest('hex')}`;

    return NextResponse.json({
      success: true,
      certId,
      status: 'ISSUED',
      signatureMode: 'MODE_B_CRYPTOGRAPHIC_PDF',
      signatureHash,
      signedBy: 'Nishant Singh (General Secretary, Technical Affairs, AIT Pune)',
      signedAt: new Date().toISOString(),
      qrVerificationUrl: `https://competihub.aitpune.ac.in/verify?id=${certId}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error signing certificate' }, { status: 500 });
  }
}
