"use client"

import { useEffect, useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { Bolt } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import Link from "next/link";



import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export function Dropbox() {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  // Theme / Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    return localStorage.getItem("theme") !== "light"
  })

  useEffect(() => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  // API Key dialog
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("ai_voice_api_key")
    if (stored) setApiKey(stored)
  }, [])

  function saveApiKey() {
    try {
      localStorage.setItem("ai_voice_api_key", apiKey)
      alert("API key saved")
      setShowApiKeyDialog(false)
    } catch (e) {
      console.error(e)
      alert("Failed to save API key")
    }
  }

  function clearApiKey() {
    localStorage.removeItem("ai_voice_api_key")
    setApiKey("")
    alert("API key cleared")
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="[&_svg]:size-6 border-2 rounded-full h-10 w-10" variant="outline" aria-label="Open menu" >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuLabel className="border-b">Options</DropdownMenuLabel>
          <DropdownMenuGroup>
            

            {/* NEW: Theme Switch */}
            <DropdownMenuItem disabled={true}
              onSelect={() => setIsDark((s) => !s)}
              className="flex items-center justify-between"
            >
              <span>Dark mode</span>
              <Switch
                checked={isDark}
                onCheckedChange={(v) => setIsDark(Boolean(v))}
                aria-label="Toggle dark mode"
              />
            </DropdownMenuItem>

            {/* NEW: API Keys */}
            <DropdownMenuItem onSelect={() => setShowApiKeyDialog(true)}>
              API keys...
            </DropdownMenuItem>

            {/* NEW: GitHub Link */}
            <DropdownMenuItem asChild>
              <Link
                href="https://github.com/DebpratimSharma/voice-to-voice-ai-translate"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create New File Dialog */}

      {/* Share Dialog */}
      
      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>API Keys</DialogTitle>
            <DialogDescription>
              Enter your own <Link href="https://elevenlabs.io/app/developers/api-keys"><span className="font-bold underline" >Eevenlabs API key</span></Link> to use your own credentials for services.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-3">
            <Field>
              <Label htmlFor="apikey">API Key</Label>
              <Input
                id="apikey"
                name="apikey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-card">Cancel</Button>
            </DialogClose>
            <Button variant="ghost" onClick={clearApiKey}>Clear</Button>
            <Button onClick={saveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
