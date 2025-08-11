import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { buildCsvAction } from '@/actions/buildCsvAction';

function hasMessage(v: unknown): v is { message: unknown } {
  return typeof v === 'object' && v !== null && 'message' in v;
}

// lightweight validator here; heavy lifting in server action.
const schema = z.object({ ids: z.array(z.string().min(1)).min(1).max(200) });

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: 'INVALID_PAYLOAD',
          issues: parsed.error.issues,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const csv = await buildCsvAction(parsed.data.ids);
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=export_${Date.now()}.csv`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    let message = 'INTERNAL_ERROR';
    if (hasMessage(e) && typeof e.message === 'string') {
      message = e.message;
    }
    const status =
      message === 'INVALID_PAYLOAD' ? 400 : message === 'NO_DATA' ? 404 : 500;
    return new Response(
      JSON.stringify({
        error: message === 'NO_DATA' ? 'NO_DATA' : 'INTERNAL_ERROR',
      }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
