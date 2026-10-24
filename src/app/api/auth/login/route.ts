import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PROFILES } from '@/lib/data/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedDesignation, aitRegNo, aitRollNo, password } = body;

    if (!selectedDesignation || !aitRegNo || !aitRollNo || !password) {
      return NextResponse.json(
        { error: 'Designation, Registration Number, Roll Number, and Password are required.' },
        { status: 400 }
      );
    }

    // Exactly four designations allowed
    const validRoles = ['STUDENT', 'JOINT_SECRETARY', 'CLUB_SECRETARY', 'GENERAL_SECRETARY'];
    if (!validRoles.includes(selectedDesignation)) {
      return NextResponse.json(
        { error: `Invalid designation "${selectedDesignation}". CompetiHub authorizes exactly four designations: Student, Joint Secretary, Club Secretary, General Secretary.` },
        { status: 400 }
      );
    }

    const cleanReg = aitRegNo.trim().toUpperCase();
    const cleanRoll = aitRollNo.trim().toUpperCase();

    const profile = INITIAL_PROFILES.find(
      (p) => p.aitRegNo.toUpperCase() === cleanReg && p.aitRollNo.toUpperCase() === cleanRoll
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'Invalid AIT credentials. No matching student record found in institutional database.' },
        { status: 401 }
      );
    }

    if (profile.passwordHash && profile.passwordHash !== password.trim()) {
      return NextResponse.json(
        { error: 'Incorrect password. Access denied.' },
        { status: 401 }
      );
    }

    // Role Escalation Check
    if (profile.role !== selectedDesignation) {
      return NextResponse.json(
        {
          error: `Role Mismatch: Your account is authorized as "${profile.role.replace('_', ' ')}", not "${selectedDesignation.replace('_', ' ')}". Selecting a designation does not grant its privileges.`,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        fullName: profile.fullName,
        aitRegNo: profile.aitRegNo,
        aitRollNo: profile.aitRollNo,
        collegeEmail: profile.collegeEmail,
        role: profile.role,
        verificationStatus: profile.verificationStatus,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error during authentication' }, { status: 500 });
  }
}
