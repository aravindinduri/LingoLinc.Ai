import { NextResponse } from 'next/server';
import { firestore } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  const { language } = await request.json();

  const userRef = doc(firestore, 'users', 'user-id'); 
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();

  const completedDays = userData?.languages?.[language] || 0;

  return NextResponse.json({ [language]: completedDays });
}
