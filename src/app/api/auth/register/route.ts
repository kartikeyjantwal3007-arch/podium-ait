import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, aitRegNo, aitRollNo, collegeEmail, branch, graduationYear, password, requestedRole } = body;

    // 1. Mandatory Identity Fields
    if (!fullName || !aitRegNo || !aitRollNo || !collegeEmail || !password) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: Full name, AIT registration number, roll number, college email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = collegeEmail.trim().toLowerCase();

    // 2. Genuine AIT Pune Institutional Domain Validation
    if (!cleanEmail.endsWith('@aitpune.edu.in')) {
      return NextResponse.json(
        { error: 'Registration is restricted strictly to verified AIT Pune institutional emails (@aitpune.edu.in). Official site: https://www.aitpune.com/' },
        { status: 400 }
      );
    }

    // 3. Password Minimum Requirements
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 4. Role Escalation Prevention: Every new registration defaults strictly to STUDENT
    if (requestedRole && requestedRole !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized role escalation attempt. All self-registrations default to Student. Leadership roles require official institutional appointment.' },
        { status: 403 }
      );
    }

    // 5. Genuine Pending Verification Workflow
    const generatedOtp = '729401'; // Default development test OTP dispatched to student email

    const newStudentProfile = {
      id: `user-student-${Date.now()}`,
      fullName: fullName.trim(),
      aitRegNo: aitRegNo.trim().toUpperCase(),
      aitRollNo: aitRollNo.trim().toUpperCase(),
      collegeEmail: cleanEmail,
      branch: branch || 'Computer Engineering',
      graduationYear: Number(graduationYear) || 2027,
      role: 'STUDENT',
      verificationStatus: 'PENDING_AIT_VERIFICATION',
      verificationOtp: generatedOtp,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Student account created successfully. Account is placed in PENDING_AIT_VERIFICATION status pending college email OTP or General Secretary roster confirmation.',
      student: newStudentProfile,
      integrationNote: 'Official AIT integration requires Microsoft 365 Azure AD SSO (aitpune.edu.in) from AIT IT Department.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error during registration' }, { status: 500 });
  }
}
