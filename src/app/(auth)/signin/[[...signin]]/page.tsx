import { SignIn } from "@clerk/nextjs";
import DemoTip from "@/components/DemoTip";

export default function SignInPage() {
  return (
    <>
      <SignIn />
      <DemoTip />
    </>
  );
}
