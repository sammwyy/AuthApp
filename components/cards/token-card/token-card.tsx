import useTimer from "@/hooks/use-timer";
import { Token } from "@/lib/client";
import Image from "next/image";

export interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  const { interval, name, type, token: tokenKey } = token;
  const icon = token.icon || "default";

  const time = useTimer(interval);
  const percentage = (time / interval) * 100;

  return (
    <div className="border border-input shadow-lg rounded-lg p-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <Image
              className="w-10 h-10 rounded-full"
              src={`/icons/${icon}.webp`}
              alt="Icon"
              width={40}
              height={40}
            />
            <div>
              <p className="font-semibold text-gray-500">{name}</p>
              <p className="text-2xl font-semibold">{tokenKey}</p>
            </div>
          </div>
          <div>{time}</div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 ease-linear"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
