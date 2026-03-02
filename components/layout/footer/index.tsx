import { Link } from "@/components/ui/link"

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between p-safe font-mono uppercase 2xl:flex-row 2xl:items-end">
      <Link href="/" className="link">
        Experiments Lab
      </Link>
      <div>
        <Link href="/circular-ticker" className="link">
          circular ticker
        </Link>
        {" / "}
        <Link href="/text-movement" className="link">
          text movement
        </Link>
      </div>
    </footer>
  )
}
