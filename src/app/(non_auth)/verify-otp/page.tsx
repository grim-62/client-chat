"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import { verifyOtp } from "@/store/actions/user.action";
// import { verifyOtp } from "@/store/actions/user.action";

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const identifier = params.get("identifier") ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()
  const router = useRouter();


  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await dispatch(verifyOtp({email: identifier, code}))
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP invalid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center p-4">
      <Card className=" w-full md:w-lg flex items-center justify-center">
        <form onSubmit={handleVerify} className="w-full max-w-md space-y-4">
          <h1 className="text-center">Verify OTP</h1>
        <div>
          <label className="block text-sm font-medium">Enter OTP</label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" disabled={loading || code.length === 0}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
      </Card>
    </div>
  );
}
