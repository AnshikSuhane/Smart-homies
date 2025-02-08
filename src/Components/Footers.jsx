import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <Card className="bg-transparent border-none shadow-none">
            <CardContent>
              <div className="text-2xl flex items-center gap-2 font-bold uppercase">
                <span className="text-blue-500">Smart</span>
                <span className="text-gray-100">Management</span>
              </div>
              <p className="text-gray-400 mt-4">
                Empowering businesses with intelligent solutions for seamless operations and growth.
              </p>
            </CardContent>
          </Card>

          {/* Quick Links Section */}
          <Card className="bg-transparent border-none shadow-none">
            <CardContent>
              <h4 className="text-lg font-semibold text-blue-500 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["dashboard", "reports", "team", "settings"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item}`}
                      className="text-gray-300 hover:text-white transition duration-300"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-transparent border-none shadow-none">
            <CardContent>
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Contact Info
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-300" />
                  <span className="text-gray-300">+1 (123) 456-7890</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-300" />
                  <span className="text-gray-300">support@smartmanagement.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-300" />
                  <span className="text-gray-300">123 Smart Street, Tech City, USA</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Socials & Newsletter */}
          <Card className="bg-transparent border-none shadow-none">
            <CardContent>
              <h4 className="text-lg font-semibold text-blue-500 mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Linkedin, Github].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-300 hover:text-white transition duration-300"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>

              {/* Newsletter Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-500 mb-4">
                  Newsletter
                </h3>
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="Enter Your Email"
                    className="rounded-l bg-gray-100 text-gray-900"
                  />
                  <Button variant="default" className="bg-blue-600 rounded-r hover:bg-blue-500 text-white">
                    Subscribe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Bottom Section */}
        <Separator className="my-8 bg-gray-800" />
        <div className="text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Smart Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
