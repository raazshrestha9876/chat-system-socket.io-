import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { registerSchema } from "@/schema/registerSchema";
import AuthService from "@/services/authService";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}
const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    await AuthService.registerService(values);
    onRegisterSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Username field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      id="registerUsername"
                      type="text"
                      placeholder="Choose a username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Choose a unique username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="registerPassword"
                      type="password"
                      placeholder="Choose a password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Choose a strong password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Confirm your password for security.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default RegisterForm;
