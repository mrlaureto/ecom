import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-[88vh]">
      <SignIn path="/sign-in" appearance={{
        elements: {
          modalBackdrop: 'shadow-sm',
          headerTitle: 'text-[24px] tracking-[0.02em] bold-font uppercase'
        }
      }}/>
    </div>
  );
}