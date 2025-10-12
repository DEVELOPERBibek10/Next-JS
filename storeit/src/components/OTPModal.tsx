"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { Button } from "./ui/button";
import { sendEmailOTP, verifyOTP } from "@/actions/userActions";
import { useRouter } from "next/navigation";
const OTPModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const sessionId = await verifyOTP({ accountId, password });

      if (sessionId) {
        router.push("/");
      }
      console.log("OTP verification sucessful");
    } catch (error) {
      console.log("Failed to verify OTP", error);
    }
  };

  const handleResentOTP = async () => {
    try {
      await sendEmailOTP({ email });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="space-y-4 max-w-[95%] sm:w-fit rounded-xl md:rounded-[30px] px-4 md:px-8 py-10 bg-white outline-none">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="text-[24px] leading-[36px] font-bold text-center">
            Enter your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close-btn"
              width={20}
              height={20}
              className="absolute -right-1 -top-7 cursor-pointer sm:-right-2 sm:-top-4"
              onClick={() => setIsOpen(false)}
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[14px] leading-[20px] font-semibold text-center text-light-100">
            We&apos;ve sent an OTP to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP
          maxLength={6}
          value={password}
          onChange={setPassword}
          className="w-full flex gap-1 sm:gap-2 justify-between"
        >
          <InputOTPGroup className="flex justify-center items-center gap-2 px-2">
            <InputOTPSlot
              index={0}
              className="text-[40px] font-medium rounded-xl! ring-brand! shadow-lg text-brand-100 justify-center flex size-12 border-0! md:size-16"
            />
            <InputOTPSlot
              index={1}
              className="text-[40px] font-medium rounded-xl ring-brand! shadow-lg text-brand-100 justify-center flex size-12 border-0! md:size-16"
            />
            <InputOTPSlot
              index={2}
              className="text-[40px] font-medium rounded-xl ring-brand! shadow-lg text-brand-100 justify-center flex size-12 border-0! md:size-16"
            />
            <InputOTPSlot
              index={3}
              className="text-[40px] font-medium rounded-xl ring-brand! outline-4 shadow-lg text-brand-100 justify-center flex size-12 border-0! md:size-16 "
            />
            <InputOTPSlot
              index={4}
              className="text-[40px] font-medium rounded-xl ring-brand! shadow-lg text-brand-100 justify-center flex size-12 border-0! md:size-16"
            />
            <InputOTPSlot
              index={5}
              className="text-[40px] font-medium rounded-xl! ring-brand! shadow-lg text-brand-100 justify-center flex size-12 border-0! md:size-16"
            />
          </InputOTPGroup>
        </InputOTP>
        <AlertDialogFooter>
          <div className="w-full flex flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              type="button"
              className="bg-brand button hover:bg-brand-100 transition-all rounded-full h-12 cursor-pointer"
            >
              Submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  className="ml-2 animate-spin
                  "
                  width={24}
                  height={24}
                />
              )}
            </AlertDialogAction>
            <div className="text-[14px] leading-[20px] font-semibold mt-1 text-center text-light-100">
              Did&apos;nt get a code?
              <Button
                type="button"
                className="text-brand pl-2 font-semibold cursor-pointer"
                variant={"link"}
                onClick={handleResentOTP}
              >
                Click to Resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
