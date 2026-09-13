"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

import { submitPublicSupportTicket } from "@/features/admin/supportActions";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitPublicSupportTicket({
        name,
        email,
        type: "feedback",
        subject: `Placement Feedback from ${name}`,
        message,
        rating: rating || undefined,
      });
      setSubmitted(true);
    } catch {
      // Still show thanks to user
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          {/* Rendered as an h1: this is the page's only heading, and the page
              had none at all before, which left it with no crawlable topic. */}
          <h1 className="text-center text-xl leading-none font-semibold">
            Send Feedback on Blync&rsquo;s Aptitude Games
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Tell us which placement round to add next, or what felt off in a game.
          </p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center text-green-600 font-medium">
              ✅ Thanks for your feedback!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Textarea
                placeholder="Write your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />

              {/* Rating */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`cursor-pointer ${star <= rating ? "text-yellow-500 fill-yellow-500" : ""
                      }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <Button type="submit" className="w-full">
                Submit Feedback
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
