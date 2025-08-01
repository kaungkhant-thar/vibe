"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ArrowUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Usage from "@/modules/usage/ui/usage";

type Props = {
  projectId: string;
};

const formSchema = z.object({
  content: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: usage } = useQuery(trpc.usages.get.queryOptions());
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const showUsage = Boolean(usage);

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message sent.");
        form.reset();
      },
      onError: () => {
        toast.error("Failed to send message.");
      },
    })
  );

  const onSubmit = async (data: FormValues) => {
    const message = await createMessage.mutateAsync({
      projectId,
      content: data.content,
    });

    console.log({ message });

    queryClient.invalidateQueries({
      queryKey: trpc.messages.getMany.queryKey({ projectId }),
    });
  };

  return (
    <Form {...form}>
      {showUsage && (
        <Usage
          points={usage?.remainingPoints || 0}
          nextCycleMilliseconds={usage?.msBeforeNext || 0}
        />
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 relative p-4 "
      >
        <FormField
          control={form.control}
          name="content"
          disabled={usage?.remainingPoints === 0}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Ask vibe..."
                  className="min-h-[100px] resize-none"
                  {...field}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    form.handleSubmit(onSubmit)()
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="absolute bottom-10 right-6">
          <Button
            type="submit"
            disabled={createMessage.isPending || usage?.remainingPoints === 0}
          >
            {createMessage.isPending ? "Sending..." : <ArrowUp />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageForm;
