import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', details: error?.message },
        { status: 401 }
      );
    }

    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'User data retrieved successfully',
      data: { 
        user: {
          id: user.id,
          email: user.email,
        },
        profile 
      },
    });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', details: error?.message },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Here you would typically validate the body and update the user profile
    // For now, we'll just echo it back with a success message

    return NextResponse.json({
      message: 'Data processed successfully',
      data: body,
      userId: user.id
    });
  } catch (error) {
    console.error('User API POST error:', error);
    return NextResponse.json(
      { error: 'Invalid request body or server error' },
      { status: 400 }
    );
  }
}
