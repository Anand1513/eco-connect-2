import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactFormSchema = insertContactSchema.extend({
  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, "Phone number is required")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      phone: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message Sent!",
        description: "Thank you! Your message has been sent successfully.",
      });
      // Open WhatsApp with the submitted details
      const v = form.getValues();
      const phoneDisplay = v.phone?.trim() || "(not provided)";
      const text = encodeURIComponent(
        `New contact via EcoConnect\nName: ${v.name}\nEmail: ${v.email}\nPhone: ${phoneDisplay}\nMessage: ${v.message}`
      );
      const whatsappNumber = "917703976645"; // user's WhatsApp number in international format without '+'
      const waUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
      try {
        window.open(waUrl, "_blank");
      } catch {}
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Oops! Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Contact form error:", error);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    // Only send the fields the API expects
    const payload: InsertContact = { name: data.name, email: data.email, message: data.message };
    contactMutation.mutate(payload);
  };

  const contactInfo = [
    {
      icon: "fas fa-envelope",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      title: "Email",
      value: "contact@ecoconnect.org"
    },
    {
      icon: "fas fa-phone",
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
      title: "Phone",
      value: "+91 7703976645 (WhatsApp)"
    },
    {
      icon: "fas fa-map-marker-alt",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      title: "Address",
      value: "knowledge park 3 sharda university 201310"
    }
  ];

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#" },
    { icon: "fab fa-twitter", href: "#" },
    { icon: "fab fa-instagram", href: "#" },
    { icon: "fab fa-linkedin-in", href: "#" },
  ];

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Contact Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? Want to partner with us? We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Let's Connect
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Whether you're a restaurant looking to reduce waste, an NGO seeking partnerships, or a volunteer ready to make a difference, we're here to help you get started.
                </p>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${info.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`${info.icon} ${info.iconColor} text-lg`}></i>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">{info.title}</div>
                      <div className="text-muted-foreground">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Social Media */}
              <div className="pt-6">
                <div className="font-semibold text-foreground mb-4">Follow Us</div>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all"
                      data-testid={`social-link-${index}`}
                    >
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">
                          Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your full name" 
                            {...field}
                            data-testid="contact-name-input"
                            className="px-4 py-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">
                          Email <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="your.email@example.com" 
                            {...field}
                            data-testid="contact-email-input"
                            className="px-4 py-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">
                          Phone <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Your phone number (required)" 
                            {...field}
                            data-testid="contact-phone-input"
                            className="px-4 py-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">
                          Message <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?"
                            className="resize-none px-4 py-3"
                            rows={5}
                            {...field}
                            data-testid="contact-message-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                    disabled={contactMutation.isPending}
                    data-testid="contact-submit-button"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
