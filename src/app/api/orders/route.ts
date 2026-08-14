import { NextResponse } from 'next/server';
import { GET as serviceRequestsGET, POST as serviceRequestsPOST, PATCH as serviceRequestsPATCH, DELETE as serviceRequestsDELETE } from '../service-requests/route';

export async function GET(request: Request) {
  return serviceRequestsGET(request);
}

export async function POST(request: Request) {
  return serviceRequestsPOST(request);
}

export async function PATCH(request: Request) {
  return serviceRequestsPATCH(request);
}

export async function DELETE(request: Request) {
  return serviceRequestsDELETE(request);
}
