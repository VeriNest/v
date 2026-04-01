import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="px-20 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
          No Spam Promise
        </span>
        <h2 className="text-3xl font-bold text-foreground mb-3">Are you a landowner?</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Discover ways to increase your home's value and get listed. No Spam.
        </p>
        <div className="flex items-center gap-3 max-w-md mx-auto mb-3">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="rounded-full px-5 h-12 border-border"
          />
          <Button className="rounded-full px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90">
            Submit
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Join <span className="font-semibold text-foreground">10,000+</span> other landlords in our estating community.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
