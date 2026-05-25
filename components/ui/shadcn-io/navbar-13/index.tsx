'use client';

import * as React from 'react';
import { BotMessageSquareIcon, MessageCircleDashedIcon } from 'lucide-react';
import UserMenu from './UserMenu';
import { Button } from '@repo/shadcn-ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@repo/shadcn-ui/components/ui/select';
import { cn } from '@repo/shadcn-ui/lib/utils';

// Types
export interface Navbar13AIModel {
  value: string;
  name: string;
  description: string;
}

export interface Navbar13Props extends React.HTMLAttributes<HTMLElement> {
  models?: Navbar13AIModel[];
  defaultModel?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onModelChange?: (model: string) => void;
  onTempChatClick?: () => void;
  onUserItemClick?: (item: string) => void;
}

// Default AI models
const defaultModels: Navbar13AIModel[] = [
  {
    value: 'orion-alpha-45',
    name: 'Orion-Alpha 4.5',
    description: 'Balanced performance and creativity',
  },
  {
    value: 'orion-code-4',
    name: 'Orion-Code 4',
    description: 'Optimized for code generation and understanding',
  },
  {
    value: 'nova-chat-4',
    name: 'Nova-Chat 4',
    description: 'Excels at natural, engaging conversations',
  },
  {
    value: 'galaxy-max-4',
    name: 'Galaxy-Max 4',
    description: 'Most powerful model for complex tasks',
  },
];

export const Navbar13 = React.forwardRef<HTMLElement, Navbar13Props>(
  (
    {
      className,
      models = defaultModels,
      defaultModel = 'orion-alpha-45',
      userName = 'John Doe',
      userEmail = 'john@example.com',
      userAvatar,
      onModelChange,
      onTempChatClick,
      onUserItemClick,
      ...props
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={cn(
          'border-b px-4 md:px-6 [&_*]:no-underline',
          className
        )}
        {...props}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div>
            <Select 
              defaultValue={defaultModel} 
              onValueChange={onModelChange}
              aria-label="Select AI model"
            >
              <SelectTrigger className="[&>svg]:text-muted-foreground/80 **:data-desc:hidden [&>svg]:shrink-0">
                <BotMessageSquareIcon size={16} aria-hidden="true" />
                <SelectValue placeholder="Choose an AI model" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                <SelectGroup>
                  <SelectLabel className="ps-2">Models</SelectLabel>
                  {models.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.name}
                      <span
                        className="text-muted-foreground mt-1 block text-xs"
                        data-desc
                      >
                        {model.description}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center justify-end gap-2">
            {/* Temporary chat button */}
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground size-8 rounded-full shadow-none"
              aria-label="Temporary chat"
              onClick={(e) => {
                e.preventDefault();
                if (onTempChatClick) onTempChatClick();
              }}
            >
              <MessageCircleDashedIcon size={16} aria-hidden="true" />
            </Button>
            {/* User menu */}
            <UserMenu 
              userName={userName}
              userEmail={userEmail}
              userAvatar={userAvatar}
              onItemClick={onUserItemClick}
            />
          </div>
        </div>
      </header>
    );
  }
);

Navbar13.displayName = 'Navbar13';

export { UserMenu };