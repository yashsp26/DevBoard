import { CloudOff, ShieldAlert, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-xl">
        <EmptyState
          action={
            <Button onClick={() => navigate("/dashboard")}>
              Go to dashboard
            </Button>
          }
          description="The page you requested does not exist or may have moved."
          icon={TriangleAlert}
          title="Page not found"
        />
      </div>
    </main>
  );
}

export function NetworkErrorPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-xl">
        <EmptyState
          action={
            <Button onClick={() => window.location.reload()}>Try again</Button>
          }
          description="DevBoard could not reach the server. Check your connection and try again."
          icon={CloudOff}
          title="Connection problem"
        />
      </div>
    </main>
  );
}

export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-xl">
        <EmptyState
          action={
            <Button onClick={() => navigate("/dashboard")}>
              Return to dashboard
            </Button>
          }
          description="You do not have permission to access this resource."
          icon={ShieldAlert}
          title="Access denied"
        />
      </div>
    </main>
  );
}
