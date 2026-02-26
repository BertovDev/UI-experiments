"use client"

import { usePathname } from "next/navigation"
import { Link } from "@/components/ui/link"
import EXPERIMENTS from "@/lib/constants"
import { cn } from "@/lib/styles/cn"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../navigation-menu"

export const Header = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 z-50 w-full py-2">
      <div className="mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          Basement Experiments Starter
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-8 py-6 font-medium text-sm">
                Experiments
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-48 gap-1 bg-indigo-950/70 p-2 text-white backdrop-blur-3xl">
                  {EXPERIMENTS.map((experiment) => (
                    <li key={experiment.path}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={experiment.path}
                          className={cn(
                            "block rounded-sm px-2 py-2 font-medium text-sm transition-colors duration-200",
                            pathname === experiment.path
                              ? "bg-purple-600 text-white"
                              : "text-white hover:bg-purple-500/20"
                          )}
                        >
                          {experiment.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}
