
import { NextResponse } from 'next/server';

const currentEmployeesOfTheMonth = ['ashley', 'loren'];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name')?.toLowerCase() || '';
  const result = currentEmployeesOfTheMonth.includes(name);
  return NextResponse.json({ isEmployeeOfTheMonth: result });
}
