"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { AuthModal } from "@/components/ui/AuthModal";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthButton({ user }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.refresh();
    } catch (err) {
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-orange-50 border border-orange-200/60 px-3 py-1.5 rounded-full text-xs font-medium text-orange-800">
            <UserIcon className="w-3.5 h-3.5 text-orange-600" />
            <span className="max-w-[150px] truncate">{user.email}</span>
          </div>
          <Button
            onClick={handleSignOut}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-gray-300 hover:bg-gray-100 text-gray-700 gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setShowAuthModal(true)}
          variant="default"
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white gap-2 font-medium shadow-sm cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
