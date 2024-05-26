import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
    return <div className="w-full bg-[#001117] px-6 pt-[64px] text-white  overflow-hidden">
        <div className="w-full grid grid-cols-4">
            <div>
                <h4 className="text-logo-main text-[#D3CCC4] !text-[24px]">Social Culture</h4>
                <div className="flex flex-col gap-1 mt-2">
                    <Link href={'/'} className="helvetica-medium text-[#D3CCC4] text-[18px]">About Us</Link>
                    <Link href={'/'} className="helvetica-medium text-[#D3CCC4] text-[18px]">Editorial</Link>
                    <Link href={'/'} className="helvetica-medium text-[#D3CCC4] text-[18px]">News Room</Link>
                </div>
            </div>
            <div>
                <h4 className="text-logo-main text-[#D3CCC4] !text-[24px]">Social Culture</h4>
                <div className="flex flex-col gap-1 mt-2">
                    <Link href={'/'} className="helvetica-medium text-[#D3CCC4] text-[18px]">About Us</Link>
                    <Link href={'/'} className="helvetica-medium text-[#D3CCC4] text-[18px]">Editorial</Link>
                    <Link href={'/'} className="helvetica-medium text-[#D3CCC4] text-[18px]">News Room</Link>
                </div>
            </div>
            <div className="col-start-4 flex flex-col justify-between pr-6">
                <div>
                    <h4 className="text-logo-main text-[#D3CCC4] !text-[24px]">Newsletter</h4>
                    <div className="flex flex-col gap-1 mt-2">
                        <p className="helvetica-medium text-[#D3CCC4] text-[18px]">Get the latest deals and info about new product drops!</p>

                    </div>
                </div>
                <div className="mt-12 flex flex-row w-full justify-between items-center">
                    <Link href={'/'} className="helvetica-medium text-[#D3CCC4] text-[18px]">Sign up now</Link>
                    <ArrowRight color="#D3CCC4" />
                </div>
            </div>
        </div>
        <div className="flex items-end justify-center mb-[-120px] w-full">
            <p className="!text-[#EB0E0E] whitespace-nowrap text-[24vw] main-text-display-font uppercase">Social Culture</p>
        </div>
    </div>;
}