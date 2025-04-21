import Link from "next/link";
import AuthButton from "./authButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">DalsheBogaNet</span>
        </Link>

        {/* Десктопная навигация */}
        <div className=" md:flex items-center space-x-4">
          {/* Кнопка регистрации */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}