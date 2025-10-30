import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-muted-foreground text-lg">
            آخر تحديث: 30 أكتوبر 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-8 mb-6">
          <p className="text-lg leading-relaxed">
            في <span className="font-bold text-primary">Tolzy Stack</span>، نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. 
            توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا.
          </p>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">1. المعلومات التي نجمعها</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong className="text-foreground">معلومات الحساب:</strong> الاسم، البريد الإلكتروني، صورة الملف الشخصي (من Google أو GitHub)</p>
                  <p><strong className="text-foreground">معلومات الاستخدام:</strong> المشاريع المحفوظة، التفضيلات، سجل التصفح</p>
                  <p><strong className="text-foreground">معلومات تقنية:</strong> عنوان IP، نوع المتصفح، نظام التشغيل</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">2. كيف نستخدم معلوماتك</h2>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>تقديم وتحسين خدماتنا</li>
                  <li>تخصيص تجربتك على المنصة</li>
                  <li>إرسال إشعارات مهمة حول حسابك</li>
                  <li>تحليل استخدام المنصة لتحسين الأداء</li>
                  <li>حماية المنصة من الاحتيال والإساءة</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 3 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">3. حماية البيانات</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>نستخدم تقنيات أمان متقدمة لحماية بياناتك:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>تشفير البيانات أثناء النقل والتخزين (SSL/TLS)</li>
                    <li>مصادقة ثنائية العامل (2FA) متاحة</li>
                    <li>نسخ احتياطي منتظم للبيانات</li>
                    <li>مراقبة أمنية على مدار الساعة</li>
                    <li>الامتثال لمعايير GDPR وCCPA</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 4 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">4. حقوقك</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>لديك الحق في:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li><strong className="text-foreground">الوصول:</strong> طلب نسخة من بياناتك الشخصية</li>
                    <li><strong className="text-foreground">التصحيح:</strong> تحديث أو تصحيح معلوماتك</li>
                    <li><strong className="text-foreground">الحذف:</strong> طلب حذف حسابك وبياناتك</li>
                    <li><strong className="text-foreground">الاعتراض:</strong> الاعتراض على معالجة بياناتك</li>
                    <li><strong className="text-foreground">النقل:</strong> طلب نقل بياناتك إلى خدمة أخرى</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 5 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">5. ملفات تعريف الارتباط (Cookies)</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>نستخدم ملفات تعريف الارتباط لـ:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>الحفاظ على جلسة تسجيل الدخول</li>
                    <li>تذكر تفضيلاتك (مثل الوضع الليلي)</li>
                    <li>تحليل استخدام الموقع</li>
                    <li>تحسين الأداء والأمان</li>
                  </ul>
                  <p className="mt-3">يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 6 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">6. مشاركة البيانات</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong className="text-foreground">نحن لا نبيع بياناتك أبداً.</strong></p>
                  <p>قد نشارك معلوماتك فقط في الحالات التالية:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>مع موافقتك الصريحة</li>
                    <li>مع مزودي الخدمات الموثوقين (Firebase، OpenAI)</li>
                    <li>عند الضرورة القانونية</li>
                    <li>لحماية حقوقنا وسلامة المستخدمين</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact */}
        <Card className="p-8 mt-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <h2 className="text-2xl font-bold mb-4 text-center">تواصل معنا</h2>
          <p className="text-center text-muted-foreground mb-4">
            إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا:
          </p>
          <div className="text-center">
            <p className="text-primary font-semibold">support@tolzyprojects.com</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
