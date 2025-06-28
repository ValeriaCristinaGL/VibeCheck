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
      <Card className="text-center border-none">
        <img
          src="/vibe-check-logo.png"
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
                  className="w-full bg-[#394779] text-white hover:bg-[#3d4381] hover:text-white border-none cursor-pointer"
                  type="button"
                  onClick={() => window.location.href = "http://localhost:8080/login"}
                >
                  Entrar com Google
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
