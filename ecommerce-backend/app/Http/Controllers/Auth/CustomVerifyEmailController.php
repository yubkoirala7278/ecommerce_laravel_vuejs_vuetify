<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

class CustomVerifyEmailController extends Controller
{
    public function __invoke(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect(config('app.frontend_url') . '/admin/home');
        }
    
        if ($request->route('id') == $request->user()->getKey() &&
            hash_equals((string) $request->route('hash'), sha1($request->user()->getEmailForVerification()))) {
            $request->user()->markEmailAsVerified();
            event(new Verified($request->user()));
    
            return redirect(config('app.frontend_url') . '/verification-success');
        }
    
        return response()->json(['message' => 'Invalid verification link'], 403);
    }
    
}
