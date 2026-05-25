"use client";
import * as React from "react";
import {
  BotMessageSquareIcon,
  Contact2Icon,
  MessageCircleDashedIcon,
} from "lucide-react";
import UserMenu from "@/components/ui/shadcn-io/navbar-13/UserMenu";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef, useId } from "react";
import { LiquidButton } from "@/components/ui/shadcn-io/liquid-button";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useChatContext } from "@/context/ChatContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  LucideHome,
  MessageCircleIcon,
  InfoIcon,
  SquareChartGantt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;

const NavigationMenu = NavigationMenuPrimitive.Root;
const NavigationMenuList = NavigationMenuPrimitive.List;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const NavigationMenuLink = NavigationMenuPrimitive.Link;

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = TooltipPrimitive.Content;

export interface Navbar06NavItem {
  href?: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    "aria-hidden"?: boolean;
  }>;
  active?: boolean;
}

export interface Navbar13AIModel {
  value: string;
  name: string;
  description: string;
}
export interface Navbar13Props extends React.HTMLAttributes<HTMLElement> {
  models?: Navbar13AIModel[];
  navigationLinks?: Navbar06NavItem[];
  defaultModel?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onNavItemClick?: (href: string) => void;
  onModelChange?: (model: string) => void;
  onTempChatClick?: () => void;
  onUserItemClick?: (item: string) => void;
  onNewChat?: () => void;
}

const defaultNavigationLinks: Navbar06NavItem[] = [
  { href: "/", label: "Home", icon: LucideHome },
  { href: "/chat", label: "Chat", icon: MessageCircleIcon },
  { href: "/about", label: "About", icon: InfoIcon },
  { href: "/contact", label: "Contact", icon: Contact2Icon },
  { href: "/privacy-policy", label: "Privacy Policy", icon: SquareChartGantt },
];

// Default AI models
const defaultModels: Navbar13AIModel[] = [
  {
    value: "orion-alpha-45",
    name: "Travel Mate Standard",
    description: "Balanced performance for general tasks",
  },
  {
    value: "orion-code-4",
    name: "Travel Mate Pro",
    description: "Not Available !",
  },
];

const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

export const Header = React.forwardRef<HTMLElement, Navbar13Props>(
  (
    {
      className,
      models = defaultModels,
      defaultModel = "orion-alpha-45",
      userName = "John Doe",
      userEmail = "john@example.com",
      userAvatar,
      onModelChange,
      onTempChatClick,
      onUserItemClick,
      navigationLinks = defaultNavigationLinks,
      onNavItemClick,
      onNewChat,
      ...props
    },
    ref,
  ) => {
    const { isSignedIn, user } = useUser();

    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const selectId = useId();
    const breakpoint = 768;

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [breakpoint]);

    return (
      <header
        ref={ref}
        className={cn(
          "fixed w-full border-b px-3 md:px-6 bg-white top-0 z-50 [&_*]:no-underline",
          className,
        )}
        {...props}
      >
        <div className="flex h-13 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {isSignedIn && (
              <Select
                defaultValue={defaultModel}
                onValueChange={onModelChange}
                aria-label="Select AI model"
              >
                <SelectTrigger className="[&>svg]:text-muted-foreground/80 **:data-desc:hidden [&>svg]:shrink-0">
                  <BotMessageSquareIcon size={15} aria-hidden="true" />
                  <SelectValue placeholder="Choose an AI model" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                  <SelectGroup>
                    <SelectLabel className="ps-2">Models</SelectLabel>
                    {models.map((model) =>
                      model.name == "Travel Mate Pro" ? (
                        <SelectItem
                          key={model.value}
                          value={model.value}
                          disabled={true}
                        >
                          {model.name}
                          <span
                            className="text-muted-foreground mt-1 block text-xs"
                            data-desc
                          >
                            {model.description}
                          </span>{" "}
                        </SelectItem>
                      ) : (
                        <SelectItem key={model.value} value={model.value}>
                          {model.name}
                          <span
                            className="text-muted-foreground mt-1 block text-xs"
                            data-desc
                          >
                            {model.description}
                          </span>
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="h-8 w-8 p-1 hover:bg-accent  hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-45 p-1 bg-gray-100 rounded-md shadow-lg"
                >
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                          <NavigationMenuItem key={index} className="w-full">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = link.href || "";
                                console.log(link.href);
                                link.active = !link.active;
                                if (onNavItemClick && link.href)
                                  onNavItemClick(link.href);
                              }}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                link.active &&
                                  "bg-accent text-accent-foreground",
                              )}
                            >
                              <Icon
                                size={16}
                                className="text-muted-foreground"
                                aria-hidden
                              />
                              <span>{link.label}</span>
                            </button>
                          </NavigationMenuItem>
                        );
                      })}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}

            {!isMobile && (
              <NavigationMenu className="flex flex-row gap-2">
                <NavigationMenuList className="flex flex-row gap-2">
                  <TooltipProvider>
                    {navigationLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <NavigationMenuItem key={link.label}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <NavigationMenuLink
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.location.href = link.href || "";
                                  console.log(link.href);
                                  link.active = !link.active;
                                  if (onNavItemClick && link.href)
                                    onNavItemClick(link.href);
                                }}
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center p-1.5 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                  link.active &&
                                    "bg-accent text-accent-foreground",
                                )}
                              >
                                <Icon size={20} aria-hidden />
                                <span className="sr-only">{link.label}</span>
                              </NavigationMenuLink>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="px-2 py-1 text-xs"
                            >
                              {link.label}
                            </TooltipContent>
                          </Tooltip>
                        </NavigationMenuItem>
                      );
                    })}
                  </TooltipProvider>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            {isSignedIn ? (
              <>
                <UserMenu
                  userName={user?.firstName || ""}
                  userEmail={
                    user?.emailAddresses?.[0]?.emailAddress
                      ? `${user.emailAddresses[0].emailAddress.slice(0, 27)}...`
                      : "No email available"
                  }
                  userAvatar={user?.hasImage ? user?.imageUrl : undefined}
                  onItemClick={() => {}}
                />
              </>
            ) : (
              <>
                <LiquidButton
                  className="bg-sky-600 text-black hover:text-white hover:bg-sky-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/sign-in";
                  }}
                >
                  Log In
                </LiquidButton>
                <RippleButton
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/sign-up";
                  }}
                >
                  {" "}
                  Sign Up
                </RippleButton>
              </>
            )}
          </div>
        </div>
      </header>
    );
  },
);
Header.displayName = "Header";
export { UserMenu };
