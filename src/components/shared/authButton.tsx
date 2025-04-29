"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, logout, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      router.push(`/profile/${user?.id}`);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    }
  };
  if (user) {
    return (
      <Button variant="outline" onClick={logout}>
        Выйти
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <LogIn className="h-4 w-4" />
          <span>Войти</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4">
        <DropdownMenuLabel>Вход</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className={"w-full"} loading={loading}>
            Войти
          </Button>
        </form>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/register" className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Нет аккаунта? Зарегистрируйтесь</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
