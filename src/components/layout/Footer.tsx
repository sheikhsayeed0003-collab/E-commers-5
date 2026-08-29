import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Customer Service",
    links: [
      { href: "/faq", label: "Help Center" },
      { href: "/contact", label: "Contact Us" },
      { href: "/return-policy", label: "Return & Refund Policy" },
      { href: "/shipping-policy", label: "Shipping & Delivery" },
      { href: "/payment-policy", label: "Payment Methods" },
    ],
  },
  {
    title: "Shopping with esy",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/deals", label: "SuperDeals" },
      { href: "/about", label: "About esy" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "My Account",
    links: [
      { href: "/account/login", label: "Sign In" },
      { href: "/account/register", label: "Register" },
      { href: "/account/orders", label: "My Orders" },
      { href: "/account/wishlist", label: "Wishlist" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-white mt-12">
      <div className="container-main py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <span className="text-2xl font-bold text-primary">esy</span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Bangladesh&apos;s trusted online shopping destination. Quality products, best prices, fast delivery.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +880 1700-000000</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@esy.com</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Dhaka, Bangladesh</p>
            </div>
            <div className="flex gap-3 mt-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h5 className="font-semibold text-sm mb-4">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment badges */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-3">We accept</p>
          <div className="flex flex-wrap gap-2">
            {["Cash on Delivery", "bKash", "Nagad", "Visa", "Mastercard"].map((method) => (
              <span key={method} className="px-3 py-1 text-xs bg-white/10 rounded-full text-gray-300">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} esy.com — All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Use</Link>
            <Link href="/return-policy" className="hover:text-white">Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
