import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertDonationSchema, type InsertDonation } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CheckoutFormProps {
  amount: number;
  onSuccess: (data: any) => void;
  onError: (message: string) => void;
}

export function CheckoutForm({ amount, onSuccess, onError }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertDonation>({
    resolver: zodResolver(insertDonationSchema),
    defaultValues: {
      amount, // Usar o valor total incluindo turbinamento
      name: "",
      email: "",
      cpf: "",
      phone: ""
    }
  });

  // Atualizar o valor do formulário quando o amount mudar
  useEffect(() => {
    form.setValue('amount', amount);
  }, [amount, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: InsertDonation) => {
      // Garantir que o amount está correto antes de enviar
      const payload = {
        ...data,
        amount: amount // Usar o valor total incluindo turbinamento
      };
      const res = await apiRequest("POST", "/api/donations", payload);
      return res.json();
    },
    onSuccess,
    onError: () => onError("Não foi possível processar sua doação. Por favor, tente novamente."),
    onSettled: () => setIsSubmitting(false)
  });

  const handleSubmit = async (data: InsertDonation) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Garantir que o amount está correto antes de enviar
    mutate({
      ...data,
      amount: amount // Usar o valor total incluindo turbinamento
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 px-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-700">Nome Completo</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  placeholder="Digite seu nome completo"
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-700">Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  {...field} 
                  className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">CPF</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">Telefone</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="(00) 00000-0000"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800">
          💡 Suas informações são necessárias para garantir a segurança e transparência da doação.
        </div>

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-10"
          disabled={isPending || isSubmitting}
        >
          {(isPending || isSubmitting) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Continuar com a Doação"
          )}
        </Button>
      </form>
    </Form>
  );
}