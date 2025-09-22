
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const MemberFooter = () => {
  const [email, setEmail] = useState("");
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
    // Add your newsletter signup logic here
  };

  const socialLinks = [{
    icon: Facebook,
    href: "#",
    label: "Facebook"
  }, {
    icon: Instagram,
    href: "#",
    label: "Instagram"
  }, {
    icon: Twitter,
    href: "#",
    label: "Twitter"
  }, {
    icon: Youtube,
    href: "#",
    label: "YouTube"
  }];

  const quickLinks = [{
    title: t('resources'),
    links: [
      { text: t('tools'), href: "#" },
      { text: t('tutorials'), href: "#" },
      { text: t('api'), href: "#" },
      { text: t('documentation'), href: "#" }
    ]
  }, {
    title: t('company'),
    links: [
      { text: t('about'), href: "#" },
      { text: t('careers'), href: "#" },
      { text: t('press'), href: "#" },
      { text: t('partners'), href: "#" }
    ]
  }, {
    title: t('support'),
    links: [
      { text: t('helpCenter'), href: "#" },
      { text: t('contact'), href: "#" },
      { text: t('status'), href: "#" },
      { text: t('feedback'), href: "#" }
    ]
  }, {
    title: t('legal'),
    links: [
      { text: t('privacy'), href: "#" },
      { text: t('terms'), href: "#" },
      { text: t('cookies'), href: "#" },
      { text: t('licenses'), href: "#" }
    ]
  }];

  return (
    <footer className={`w-full text-foreground py-8 sm:py-12 md:py-16 overflow-hidden relative z-10 ${
      theme === 'dark' ? 'bg-[#18181B]' : 'bg-[#F9FAFB]'
    }`}>
      {/* Simple border for smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2" 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 sm:mb-6">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {t('footerPlatformDescription')}
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>suporte@cyruspremium.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{t('locationSaoPaulo')}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          {quickLinks.map((section, index) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {section.links.map(link => (
                  <li key={link.text}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm block"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <motion.div 
          className="border-t border-border pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            {socialLinks.map(social => (
              <motion.a
                key={social.label}
                href={social.href}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-muted hover:bg-primary/90 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-all duration-300 border border-border hover:border-primary/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © 2024 Cyrus Premium. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Versão 2.0.1 • Última atualização: Dezembro 2024
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Default export for MemberFooter component
export default MemberFooter;
