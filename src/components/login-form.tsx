import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
          <img
            src="../../public/vibe-check-logo.png"
            alt="Logo"
            className="mx-auto mb-4 h-48 w-48"
          />
        <CardHeader>
            <CardTitle style={{ color: "#fff" }}>Entre na sua conta</CardTitle>
            <CardDescription style={{ color: "#fff" }}>
              Conecte-se usando sua conta do Google
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  style={{ backgroundColor: "#394779", color: "#fff", border: "none"}}
                >
                  Entrar com Google
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
