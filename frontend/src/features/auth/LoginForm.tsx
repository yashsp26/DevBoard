import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useLogin } from "../../services/useLogin";
import { type LoginFormValues, loginSchema } from "./authSchemas";

export function LoginForm() {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();
  const { isPending, mutate } = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: () => {
        navigate("/dashboard", { replace: true });
      },
    });
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoComplete="email"
        error={errors.email?.message}
        label="Email address"
        type="email"
        {...register("email")}
      />
      <div className="space-y-2">
        <Input
          autoComplete="current-password"
          error={errors.password?.message}
          label="Password"
          type="password"
          {...register("password")}
        />
        <Link
          className="text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          to="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
      <Button className="w-full" isLoading={isPending} type="submit">
        Sign in
      </Button>
      <p className="text-center text-sm text-muted">
        New to DevLupo?{" "}
        <Link
          className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          to="/register"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
