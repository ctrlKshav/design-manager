/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as NewChatImport } from './routes/newChat'
import { Route as ChatImport } from './routes/chat'
import { Route as AdminRouteImport } from './routes/admin-route'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const NewChatRoute = NewChatImport.update({
  id: '/newChat',
  path: '/newChat',
  getParentRoute: () => rootRoute,
} as any)

const ChatRoute = ChatImport.update({
  id: '/chat',
  path: '/chat',
  getParentRoute: () => rootRoute,
} as any)

const AdminRouteRoute = AdminRouteImport.update({
  id: '/admin-route',
  path: '/admin-route',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/admin-route': {
      id: '/admin-route'
      path: '/admin-route'
      fullPath: '/admin-route'
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRoute
    }
    '/chat': {
      id: '/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatImport
      parentRoute: typeof rootRoute
    }
    '/newChat': {
      id: '/newChat'
      path: '/newChat'
      fullPath: '/newChat'
      preLoaderRoute: typeof NewChatImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/admin-route': typeof AdminRouteRoute
  '/chat': typeof ChatRoute
  '/newChat': typeof NewChatRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/admin-route': typeof AdminRouteRoute
  '/chat': typeof ChatRoute
  '/newChat': typeof NewChatRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/admin-route': typeof AdminRouteRoute
  '/chat': typeof ChatRoute
  '/newChat': typeof NewChatRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/about' | '/admin-route' | '/chat' | '/newChat'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/about' | '/admin-route' | '/chat' | '/newChat'
  id: '__root__' | '/' | '/about' | '/admin-route' | '/chat' | '/newChat'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  AdminRouteRoute: typeof AdminRouteRoute
  ChatRoute: typeof ChatRoute
  NewChatRoute: typeof NewChatRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  AdminRouteRoute: AdminRouteRoute,
  ChatRoute: ChatRoute,
  NewChatRoute: NewChatRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/admin-route",
        "/chat",
        "/newChat"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/admin-route": {
      "filePath": "admin-route.tsx"
    },
    "/chat": {
      "filePath": "chat.tsx"
    },
    "/newChat": {
      "filePath": "newChat.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
