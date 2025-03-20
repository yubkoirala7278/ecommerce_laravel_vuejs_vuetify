<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 200);
        }

        if (
            $request->route('id') == $request->user()->getKey() &&
            hash_equals((string) $request->route('hash'), sha1($request->user()->getEmailForVerification()))
        ) {
            $request->user()->markEmailAsVerified();
            event(new \Illuminate\Auth\Events\Verified($request->user()));
            return response()->json(['message' => 'Email verified successfully'], 200);
        }

        return response()->json(['message' => 'Invalid verification link'], 403);
    }
}
