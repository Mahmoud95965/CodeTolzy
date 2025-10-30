import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Check, Crown, Zap, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PricingPage() {
  const [, setLocation] = useLocation();
  const { user, userData } = useAuthStore();
  const { toast } = useToast();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'Free Forever',
      description: 'For beginners and personal use',
      features: [
        '5 daily code generation operations',
        'Smart code editor',
        'Basic autocomplete',
        'Error debugging',
        'Text to code generation',
        'Save 3 projects',
      ],
      limitations: [
        'No access to advanced scenarios',
        'No project summarizer',
      ],
      cta: 'Start Free',
      current: userData?.plan === 'free',
    },
    {
      name: 'Pro',
      price: '99',
      period: 'Monthly',
      description: 'For professionals and small teams',
      popular: true,
      features: [
        'Unlimited operations',
        'All free plan features',
        'Access to all smart scenarios',
        'Smart project summarizer',
        'Advanced autocomplete',
        'Advanced debugging with suggestions',
        'Unlimited project storage',
        'Priority technical support',
        'Early access to new features',
      ],
      cta: 'Upgrade to Pro',
      current: userData?.plan === 'pro',
    },
  ];

  const handleUpgrade = async () => {
    if (!user) {
      setLocation('/login');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 11) {
      toast({
        title: "رقم غير صحيح",
        description: "الرجاء إدخال رقم فودافون كاش صحيح",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call Vodafone Cash API
      const response = await fetch('/api/payment/vodafone-cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          amount: 99,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم إرسال طلب الدفع",
          description: "سيصلك إشعار على هاتفك لإتمام الدفع",
        });
        setIsPaymentOpen(false);
      } else {
        toast({
          title: "خطأ في الدفع",
          description: data.message || "حدث خطأ أثناء معالجة الدفع",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة الدفع",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
Simple and Clear Pricing
          </Badge>
          <h2 className="text-5xl font-bold mb-4">Choose the Right Plan for You</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free or get more features with Pro plan
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-primary shadow-2xl scale-105'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    الأكثر شعبية
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-3xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== '0' && (
                    <span className="text-xl text-muted-foreground"> جنيه</span>
                  )}
                </div>
                <CardDescription className="text-base">{plan.period}</CardDescription>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-3 opacity-50">
                      <div className="rounded-full bg-muted p-1 mt-0.5">
                        <span className="h-4 w-4 block text-xs">✕</span>
                      </div>
                      <span className="text-sm line-through">{limitation}</span>
                    </div>
                  ))}
                </div>

                {plan.current ? (
                  <Button className="w-full" disabled>
                    <Check className="h-4 w-4 mr-2" />
Current Plan
                  </Button>
                ) : user && plan.name === 'Pro' ? (
                  <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        size="lg"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {plan.cta}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Vodafone Cash Payment</DialogTitle>
                        <DialogDescription>
                          Enter your Vodafone Cash number to complete payment
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Vodafone Cash Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="01xxxxxxxxx"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            maxLength={11}
                          />
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Pro Plan</span>
                            <span className="font-semibold">99 EGP</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Monthly subscription auto-renews
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={handleUpgrade}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Complete Payment'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : !user && plan.name === 'Pro' ? (
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" size="lg">
                      <Zap className="h-4 w-4 mr-2" />
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Link href={user ? '/dashboard' : '/login'}>
                    <Button className="w-full" variant="outline" size="lg">
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How is payment processed?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Payment is processed securely via Vodafone Cash. You'll receive a notification on your phone to confirm the payment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription anytime from your account settings. The subscription won't renew after the current period ends.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens when the daily free limit is reached?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The daily limit resets automatically every 24 hours. You can upgrade to Pro for unlimited access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
