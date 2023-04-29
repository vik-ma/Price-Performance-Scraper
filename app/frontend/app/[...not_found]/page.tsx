import {notFound} from "next/navigation"

// Display the not-found.tsx in app root directory when visiting a page that does not exist
export default function NotFoundCatchAll() {
  notFound()
}