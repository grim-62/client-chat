"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggleButton } from "@/components/theme/theme-toggle-button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function handleSendOtp() {
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending OTP request for email:", email.trim());
      const response = await AuthService.requestOtp({ email: email.trim() });
      // console.log("OTP request successful:", response);
      toast.success("OTP sent successfully!");
      console.log("Redirecting to verify-otp page...");

      // Add a small delay to ensure the toast is visible
      // setTimeout(() => {
      router.push(`/verify-otp?identifier=${encodeURIComponent(email)}`);
      // }, 1000);
    } catch (err: any) {
      console.error("OTP request failed:", err);
      const errorMessage = err.message || "Failed to send OTP";
      setError(errorMessage);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && email.trim()) {
      handleSendOtp();
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br  p-4">
      <Card className="w-full max-w-md rounded-xl shadow">
        <CardHeader>
          <CardTitle className="text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              
              {/* <ThemeToggleButton variant="circle" start="center" /> */}

              <Label className="mb-2" htmlFor="email">
                Email or phone
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button
              className="w-full"
              onClick={handleSendOtp}
              disabled={!email.trim() || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send OTP"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
