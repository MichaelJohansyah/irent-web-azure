<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    // Show feedback form to user
    public function create()
    {
        return Inertia::render('feedback/create');
    }

    // Store feedback from user
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        Feedback::create([
            'user_id' => Auth::id(),
            'subject' => $request->subject,
            'content' => $request->content,
        ]);

        return redirect()->route('feedback.confirmation');
    }

    // Admin: List all feedback
    public function index()
    {
        $feedback = Feedback::with('user')->latest()->get();
        return Inertia::render('admin/FeedbackList', [
            'feedback' => $feedback,
        ]);
    }

    public function confirmation()
    {
    return Inertia::render('feedback/confirmation'); // or wherever you put the component
    }
}