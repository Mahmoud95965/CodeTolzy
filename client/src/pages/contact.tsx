import { useState } from "react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // محاكاة إرسال الرسالة
    setTimeout(() => {
      toast({
        title: "تم إرسال رسالتك!",
        description: "سنتواصل معك قريباً",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 animate-fadeIn">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-float">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            اتصل بنا
          </h1>
          <p className="text-muted-foreground text-lg">
            نحن هنا للإجابة على أسئلتك ومساعدتك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">البريد الإلكتروني</h3>
                  <p className="text-sm text-muted-foreground mb-1">للاستفسارات العامة:</p>
                  <p className="text-primary text-sm">info@tolzyprojects.com</p>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">للدعم الفني:</p>
                  <p className="text-primary text-sm">support@tolzyprojects.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">الهاتف</h3>
                  <p className="text-sm text-muted-foreground mb-1">متاح من 9 صباحاً - 5 مساءً</p>
                  <p className="text-primary text-sm">+20 123 456 7890</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">الموقع</h3>
                  <p className="text-sm text-muted-foreground">
                    القاهرة، مصر
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <h3 className="font-bold mb-3">ساعات العمل</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الأحد - الخميس</span>
                  <span className="font-medium">9:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الجمعة - السبت</span>
                  <span className="font-medium">مغلق</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أدخل اسمك"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">الموضوع *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="ما هو موضوع رسالتك؟"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message">الرسالة *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب رسالتك هنا..."
                    rows={6}
                    required
                    className="mt-2"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  disabled={loading}
                >
                  {loading ? (
                    "جاري الإرسال..."
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </Card>

            <Card className="p-6 mt-6 bg-muted/30">
              <h3 className="font-bold mb-3">الأسئلة الشائعة</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">كم يستغرق الرد على الرسائل؟</p>
                  <p className="text-muted-foreground">عادة نرد خلال 24-48 ساعة في أيام العمل.</p>
                </div>
                <div>
                  <p className="font-medium mb-1">هل الخدمة مجانية؟</p>
                  <p className="text-muted-foreground">نعم، جميع خدماتنا مجانية بالكامل.</p>
                </div>
                <div>
                  <p className="font-medium mb-1">كيف يمكنني المساهمة؟</p>
                  <p className="text-muted-foreground">يمكنك المساهمة بإضافة مشاريع جديدة أو تحسين المنصة عبر GitHub.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
