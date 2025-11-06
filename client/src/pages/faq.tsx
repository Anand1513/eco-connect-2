import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">FAQ</h1>
        <p className="text-muted-foreground mb-6">Frequently asked questions — quick answers neeche diye gaye hain.</p>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>EcoConnect ka main goal kya hai?</AccordionTrigger>
            <AccordionContent>
              Food waste ko kam karna, surplus khane ko NGOs aur communities tak pahuchana — restaurants, volunteers aur logistics ko ek hi platform par connect karke.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Volunteer kaise bane?</AccordionTrigger>
            <AccordionContent>
              Register karein <span className="text-primary">/auth</span> par. Profile complete karke nearby listings se pickup select karein. Safety guidelines follow karna zaroori hai.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Restaurants ke liye process kya hai?</AccordionTrigger>
            <AccordionContent>
              Restaurant accounts me surplus listings add hoti hain — pickup time window set karein, quantity aur location den. Volunteers/NGOs request karte hain aur pickup complete hota hai.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Food safety kaise ensure hota hai?</AccordionTrigger>
            <AccordionContent>
              Humne simple SOPs banaye hain: sealed packaging, temperature checks, jaldi distribution, aur high-risk items avoid karna. Volunteers ko training tips milte hain.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Platform free hai?</AccordionTrigger>
            <AccordionContent>
              Core features free hain. Advanced analytics aur priority logistics jaise features partners ke saath sponsored hote hain.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}