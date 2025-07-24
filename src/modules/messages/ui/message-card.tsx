import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { Prisma } from "@/generated/prisma";
import { fragmentStore } from "@/modules/projects/state";
import { Button } from "@/components/ui/button";

type MessageWithFragment = Prisma.MessageGetPayload<{
  include: { fragment: true };
}>;

type Props = {
  message: MessageWithFragment;
};

const MessageCard = ({ message }: Props) => {
  const isUser = message.role === "USER";
  const fragment = message.fragment;
  const setActiveFragment = fragmentStore((store) => store.setActiveFragment);
  const activeFragment = fragmentStore((store) => store.activeFragment);

  return (
    <div className="w-full px-4 py-2">
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-xl w-fit rounded-xl p-4 ${
            isUser
              ? "bg-[#f9f6f2] text-gray-800"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          {/* Optional role label */}
          {!isUser && (
            <div className="text-sm font-semibold text-gray-600 mb-2">Vibe</div>
          )}

          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {fragment && (
            <Button
              variant={
                activeFragment?.id === fragment.id ? "default" : "outline"
              }
              className="mt-4 text-sm space-y-1"
              onClick={() => setActiveFragment(fragment)}
            >
              Fragment
              <ArrowUpRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
