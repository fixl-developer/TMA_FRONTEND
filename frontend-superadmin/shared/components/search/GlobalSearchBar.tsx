/**
 * Global Search Bar Component
 * 
 * Search bar for header that searches across multiple entity types:
 * - Pageants
 * - Events
 * - Talents
 * - Campaigns
 * - Brands
 * 
 * Features:
 * - Search suggestions
 * - Recent searches
 * - Quick navigation to results
 */

"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { useDebounce } from "@/shared/hooks/use-debounce"

// Super Admin search types (limited to available entities)
export type SearchEntityType = "PAGEANT" | "TENANT" | "CONTENT" | "ALL"

export interface SearchResult {
  id: string
  type: SearchEntityType
  title: string
  subtitle?: string
  url: string
}

interface GlobalSearchBarProps {
  placeholder?: string
  onSearch?: (query: string, entityType?: SearchEntityType) => void
  className?: string
}

const MAX_RECENT_SEARCHES = 5
const MAX_SUGGESTIONS = 5

export function GlobalSearchBar({
  placeholder = "Search pageants, events, talents...",
  onSearch,
  className,
}: GlobalSearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches")
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to load recent searches:", e)
      }
    }
  }, [])

  // Generate suggestions based on query
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }

    // Mock suggestions - in real app, this would call an API
    const mockSuggestions: SearchResult[] = [
      {
        id: "1",
        type: "PAGEANT" as SearchEntityType,
        title: `Pageant matching "${debouncedQuery}"`,
        subtitle: "Miss India 2025",
        url: "/pageants",
      },
      {
        id: "2",
        type: "TENANT" as SearchEntityType,
        title: `Tenant matching "${debouncedQuery}"`,
        subtitle: "Pageant Organization",
        url: "/tenants",
      },
      {
        id: "3",
        type: "CONTENT" as SearchEntityType,
        title: `Content matching "${debouncedQuery}"`,
        subtitle: "Talent Showcase",
        url: "/talent-showcase",
      },
    ].slice(0, MAX_SUGGESTIONS)

    setSuggestions(mockSuggestions)
  }, [debouncedQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = useCallback(
    (searchQuery: string, entityType?: SearchEntityType) => {
      if (!searchQuery.trim()) return

      // Save to recent searches
      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, MAX_RECENT_SEARCHES)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      // Navigate to search results
      const params = new URLSearchParams({ q: searchQuery })
      if (entityType && entityType !== "ALL") {
        params.set("type", entityType)
      }
      router.push(`/search?${params.toString()}`)

      setIsOpen(false)
      setQuery("")
      onSearch?.(searchQuery, entityType)
    },
    [recentSearches, router, onSearch]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      handleSearch(query)
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const hasContent = query.length > 0 || recentSearches.length > 0 || suggestions.length > 0

  return (
    <div ref={searchRef} className={cn("relative flex-1 max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 h-9 text-[11px] bg-white border-slate-200 focus:border-blue-500"
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {query && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-500 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && hasContent && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-2 py-1">
                Suggestions
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSearch(query, suggestion.type)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800 truncate">
                      {suggestion.title}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-[10px] text-slate-500 truncate">
                        {suggestion.subtitle}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && query.length === 0 && (
            <div className="p-2 border-t border-slate-200">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide px-2 py-1">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(search)
                    handleSearch(search)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors text-left"
                >
                  <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-xs text-slate-700 flex-1 truncate">
                    {search}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Search */}
          {query.length >= 2 && (
            <div className="p-2 border-t border-slate-200">
              <button
                onClick={() => handleSearch(query)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
              >
                <span className="text-xs text-slate-700">
                  Search for &quot;{query}&quot;
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
