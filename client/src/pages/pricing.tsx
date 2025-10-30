import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for trying out CodeTolzy AI",
      features: [
        "10 AI requests per month",
        "All programming languages",
        "Code history (local storage)",
        "Monaco Editor",
        "Copy & Download code",
        "Community support",
      ],
      cta: "Get Started Free",
      variant: "outline" as const,
    },
    {
      name: "Pro",
      price: "$20",
      period: "/month",
      description: "Unlimited power for professional developers",
      features: [
        "Unlimited AI requests",
        "All programming languages",
        "Unlimited code history",
        "Priority support",
        "Advanced AI models",
        "Export projects as ZIP",
        "Early access to new features",
      ],
      cta: "Upgrade to Pro",
      variant: "default" as const,
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 relative ${
                plan.popular ? "border-primary border-2" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/editor">
                <Button
                  variant={plan.variant}
                  className="w-full"
                  size="lg"
                  data-testid={`button-${plan.name.toLowerCase()}-plan`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <Card className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What counts as an AI request?</h3>
                <p className="text-muted-foreground text-sm">
                  Each time you ask the AI to generate or modify code counts as one request. 
                  Simple edits in the Monaco Editor don't count.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I upgrade or downgrade anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! You can change your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is my code data secure?</h3>
                <p className="text-muted-foreground text-sm">
                  All code is stored locally in your browser. We never store or access your code on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit cards through our secure payment processor Stripe.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
