import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Key, Eye, Server, AlertTriangle } from "lucide-react";

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 animate-fadeIn">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-float">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            الأمان والحماية
          </h1>
          <p className="text-muted-foreground text-lg">
            أمانك وخصوصيتك أولويتنا القصوى
          </p>
        </div>

        <Card className="p-8 mb-6">
          <p className="text-lg leading-relaxed">
            في <span className="font-bold text-primary">Tolzy Stack</span>، نطبق أعلى معايير الأمان 
            لحماية بياناتك ومعلوماتك الشخصية.
          </p>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <Lock className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">تشفير البيانات</h2>
                <p className="text-muted-foreground">
                  جميع البيانات المرسلة بين جهازك وخوادمنا مشفرة باستخدام بروتوكول SSL/TLS. 
                  البيانات المخزنة محمية بتشفير AES-256.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <Key className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">المصادقة الآمنة</h2>
                <p className="text-muted-foreground">
                  نستخدم OAuth 2.0 مع Google و GitHub للمصادقة الآمنة. 
                  كلمات المرور مشفرة باستخدام bcrypt ولا يتم تخزينها بشكل نصي.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <Server className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">البنية التحتية الآمنة</h2>
                <p className="text-muted-foreground">
                  خوادمنا محمية بجدران نارية متقدمة ومراقبة على مدار الساعة. 
                  نستخدم Firebase من Google للبنية التحتية الآمنة.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <Eye className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">المراقبة المستمرة</h2>
                <p className="text-muted-foreground">
                  نراقب الأنشطة المشبوهة ونكتشف التهديدات الأمنية تلقائياً. 
                  فريقنا الأمني يعمل على مدار الساعة لحماية المنصة.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">الإبلاغ عن الثغرات</h2>
                <p className="text-muted-foreground mb-3">
                  إذا اكتشفت ثغرة أمنية، يرجى الإبلاغ عنها فوراً إلى:
                </p>
                <p className="text-primary font-semibold">security@tolzyprojects.com</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
