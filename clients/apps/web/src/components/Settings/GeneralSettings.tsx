'use client'

import { ExpandMoreOutlined } from '@mui/icons-material'
import Button from '@polar-sh/ui/components/atoms/Button'
import ShadowListGroup from '@polar-sh/ui/components/atoms/ShadowListGroup'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@polar-sh/ui/components/ui/dropdown-menu'
import { useCallback, useEffect, useRef, useState } from 'react'
import Spinner from '../Shared/Spinner'
export type Theme = 'system' | 'light' | 'dark'

interface GeneralSettingsProps {
  returnTo?: string
}

const GeneralSettings: React.FC<GeneralSettingsProps> = () => {
  const [theme, setTheme] = useState<Theme | undefined>()
  const didSetTheme = useRef(false)

  const onInitialLoad = () => {
    if (didSetTheme.current) {
      return
    }
    if (typeof localStorage === 'undefined') {
      return
    }

    didSetTheme.current = true
    const t = localStorage.getItem('theme')
    if (t) {
      setTheme(t as Theme)
    } else {
      setTheme('system')
    }
  }
  useEffect(onInitialLoad, [])

  const handleThemeChange = useCallback((theme: Theme) => {
    return () => {
      switch (theme) {
        case 'system':
          localStorage.removeItem('theme')

          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }

          break
        case 'light':
          localStorage.setItem('theme', 'light')
          document.documentElement.classList.remove('dark')
          break
        case 'dark':
          localStorage.setItem('theme', 'dark')
          document.documentElement.classList.add('dark')
          break
      }

      setTheme(theme)
    }
  }, [])

  return (
    <ShadowListGroup>
      <ShadowListGroup.Item>
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-y-1">
            <h3>Theme</h3>
            <p className="dark:text-polar-500 text-sm text-gray-400">
              Override your browser&apos;s preferred theme settings
            </p>
          </div>
          {theme === undefined ? (
            <Spinner />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="justify-between" variant="secondary">
                  <span className="capitalize">{theme}</span>
                  <ExpandMoreOutlined className="ml-2" fontSize="small" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="dark:bg-polar-800 bg-gray-50 shadow-lg"
                align="end"
              >
                <DropdownMenuItem onClick={handleThemeChange('system')}>
                  <span>System</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeChange('light')}>
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleThemeChange('dark')}>
                  <span>Dark</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </ShadowListGroup.Item>
    </ShadowListGroup>
  )
}

export default GeneralSettings
