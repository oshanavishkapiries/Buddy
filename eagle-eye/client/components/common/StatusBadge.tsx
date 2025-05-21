import { Badge } from "@/components/ui/badge"

export default function StatusBadge({ color , text }: { color: string , text: string }) {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className={`size-1.5 rounded-full ${color}`}
        aria-hidden="true"
      ></span>
      {text}
    </Badge>
  )
}
