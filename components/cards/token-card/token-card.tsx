import { CheckCircledIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import UpdateTokenDialog from "@/components/dialogs/update-token-dialog";
import useTimer from "@/hooks/use-timer";
import { Token } from "@/lib/client";
import { getTOTP } from "@/lib/tokenUtils";
import { toast } from "sonner";
import { getIcon } from "./icons";

export interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  const { name, type } = token;

  const interval = token.interval || 60;
  const tokenKey = token.token;
  const icon = token.icon || "default";
  const algorithm = token.algorithm || "SHA-1";
  const digits = token.digits || 6;

  const time = useTimer(interval || 60);
  const percentage = (time / interval) * 100;

  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState<string>("------");
  const IconClass = getIcon(icon);

  useEffect(() => {
    if (type === "totp") {
      setCode(getTOTP(tokenKey, interval, digits, algorithm));
    }
  }, [algorithm, digits, interval, time, tokenKey, type]);

  const onCopied = () => {
    toast("Copied to clipboard", {
      description: "The token has been copied to your clipboard.",
      icon: <CheckCircledIcon />,
      richColors: true,
      style: {
        color: "#34D399",
      },
    });
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="border border-input shadow-lg rounded-lg p-4 relative cursor-pointer hover:scale-[1.05] transition-transform duration-75 ease-in-out">
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-between gap-2 w-full">
          <CopyToClipboard text={code} onCopy={onCopied}>
            <div className="flex items-center gap-2">
              <div className="w-[40px] h-[40px] rounded-full text-2xl">
                {IconClass ? (
                  <IconClass color="default" />
                ) : (
                  <LockClosedIcon width={"30px"} height={"30px"} />
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-500">{name}</p>
                <p className="text-2xl font-semibold">
                  {copied ? "Copied" : code}
                </p>
              </div>
            </div>
          </CopyToClipboard>

          <div className="flex flex-col justify-around items-center">
            <div>{time}</div>
            <UpdateTokenDialog tokenData={token} />
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 ease-linear"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
