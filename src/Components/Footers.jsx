import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const themes = {
  blue: "bg-blue-900 text-blue-400",
  green: "bg-green-900 text-green-400",
  red: "bg-red-900 text-red-400",
  purple: "bg-purple-900 text-purple-400",
  orange: "bg-orange-900 text-orange-400",
  gray: "bg-gray-400 text-gray-900",
  black: "bg-black text-white",
};

const Footer = () => {
  const [theme, setTheme] = useState("blue");

  return (
    <footer className={`${themes[theme]} text-white mt-auto relative overflow-hidden py-16 px-6`}>
      {/* Color Changer */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {Object.keys(themes).map((color) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-full ${themes[color].split(" ")[0]} border-2 border-white shadow-lg transition-all hover:scale-110`}
            onClick={() => setTheme(color)}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Smart Management</h2>
          <p className="text-gray-300">Empowering businesses with intelligent solutions for seamless operations and growth.</p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-3">
            {["dashboard", "reports", "team", "settings"].map((item) => (
              <li key={item}>
                <Link to={`/${item}`} className="flex items-center text-gray-500 hover:text-white transition duration-200">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 transform -translate-x-2 transition group-hover:opacity-100 group-hover:translate-x-0" />
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Contact Info</h4>
          <ul className="space-y-3">
            {[{ icon: Phone, text: "+1 (123) 456-7890" }, { icon: Mail, text: "support@smartmanagement.com" }, { icon: MapPin, text: "123 Smart Street, Tech City, USA" }].map((item, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gray-800/50">{<item.icon className="h-5 w-5 text-white" />}</div>
                <span className="text-gray-300 hover:text-white transition duration-200">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials & Newsletter */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white">Follow Us</h4>
          <div className="flex space-x-3">
            {[Facebook, Twitter, Linkedin, Github].map((Icon, index) => (
              <a key={index} href="#" className="p-2 rounded-lg bg-gray-800/50 transition duration-200 hover:bg-gray-700">
                <Icon className="h-5 w-5 text-gray-400 hover:text-white transition duration-200" />
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Newsletter</h4>
            <div className="flex">
              <Input type="email" placeholder="Enter your email" className="rounded-l-lg bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500" />
              <Button className="rounded-r-lg bg-blue-600 hover:bg-blue-500 text-white border-0">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8 bg-gray-700" />
      <div className="text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Smart Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
