"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Calendar, Home, LogOut, Settings, ShieldAlert } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Logo } from "@/components/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut, isAdmin } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U"
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          {user && (
            <nav className="hidden md:flex gap-6">
              <Link href="/">
                <Button variant={isActive("/") ? "default" : "ghost"} className="h-8 gap-1">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/habits">
                <Button variant={isActive("/habits") ? "default" : "ghost"} className="h-8 gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Habits
                </Button>
              </Link>
              <Link href="/track">
                <Button variant={isActive("/track") ? "default" : "ghost"} className="h-8 gap-1">
                  <Calendar className="h-4 w-4" />
                  Track
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant={isActive("/admin") ? "default" : "ghost"} className="h-8 gap-1">
                    <ShieldAlert className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/settings">
                <Button variant={isActive("/settings") ? "default" : "ghost"} size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full overflow-hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url || "/placeholder.svg"}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                      />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.user_metadata?.full_name || user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>

      {user && (
        <div className="md:hidden border-t">
          <nav className="flex justify-between px-2">
            <Link href="/" className="flex-1">
              <Button variant="ghost" className="w-full h-12 gap-1 rounded-none">
                <Home className="h-4 w-4" />
                <span className="text-xs">Dashboard</span>
              </Button>
            </Link>
            <Link href="/habits" className="flex-1">
              <Button variant="ghost" className="w-full h-12 gap-1 rounded-none">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs">Habits</span>
              </Button>
            </Link>
            <Link href="/track" className="flex-1">
              <Button variant="ghost" className="w-full h-12 gap-1 rounded-none">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Track</span>
              </Button>
            </Link>
            <Link href="/settings" className="flex-1">
              <Button variant="ghost" className="w-full h-12 gap-1 rounded-none">
                <Settings className="h-4 w-4" />
                <span className="text-xs">Settings</span>
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex-1">
                <Button variant="ghost" className="w-full h-12 gap-1 rounded-none">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="text-xs">Admin</span>
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
