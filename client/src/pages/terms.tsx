import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            الشروط والأحكام
          </h1>
          <p className="text-muted-foreground text-lg">
            آخر تحديث: 30 أكتوبر 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-8 mb-6">
          <p className="text-lg leading-relaxed">
            مرحباً بك في <span className="font-bold text-primary">Tolzy Stack</span>. 
            باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية. 
            يرجى قراءتها بعناية قبل استخدام خدماتنا.
          </p>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">1. قبول الشروط</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>بالوصول إلى واستخدام Tolzy Stack، فإنك توافق على:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>الالتزام بجميع الشروط والأحكام المذكورة هنا</li>
                    <li>الامتثال لجميع القوانين واللوائح المعمول بها</li>
                    <li>احترام حقوق الملكية الفكرية</li>
                    <li>استخدام المنصة بطريقة مسؤولة وأخلاقية</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">2. استخدام الخدمة</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong className="text-foreground">يُسمح لك بـ:</strong></p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>تصفح واستكشاف المشاريع المتاحة</li>
                    <li>حفظ المشاريع المفضلة لديك</li>
                    <li>استخدام المشاريع للأغراض التعليمية</li>
                    <li>مشاركة المشاريع مع الآخرين</li>
                  </ul>
                  
                  <p className="mt-4"><strong className="text-foreground">غير مسموح بـ:</strong></p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>استخدام المنصة لأغراض غير قانونية</li>
                    <li>محاولة اختراق أو تعطيل الخدمة</li>
                    <li>نسخ أو توزيع محتوى المنصة دون إذن</li>
                    <li>انتحال شخصية مستخدمين آخرين</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">3. حسابات المستخدمين</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>عند إنشاء حساب، أنت مسؤول عن:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>الحفاظ على سرية معلومات حسابك</li>
                    <li>جميع الأنشطة التي تحدث تحت حسابك</li>
                    <li>إخطارنا فوراً بأي استخدام غير مصرح به</li>
                    <li>تقديم معلومات دقيقة وحديثة</li>
                  </ul>
                  <p className="mt-3">
                    نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 4 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">4. الملكية الفكرية</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    جميع المشاريع المعروضة على المنصة هي ملك لأصحابها الأصليين ومرخصة بموجب 
                    تراخيص المصدر المفتوح الخاصة بها.
                  </p>
                  <p>
                    محتوى وتصميم منصة Tolzy Stack (الشعار، الواجهة، النصوص) محمي بحقوق النشر 
                    ولا يجوز استخدامه دون إذن كتابي.
                  </p>
                  <p>
                    عند رفع أو مشاركة محتوى، فإنك تمنحنا ترخيصاً غير حصري لاستخدامه وعرضه على المنصة.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 5 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">5. إخلاء المسؤولية</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">الخدمة مقدمة "كما هي"</strong> دون أي ضمانات من أي نوع.
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>لا نضمن دقة أو اكتمال المحتوى المعروض</li>
                    <li>لا نتحمل مسؤولية أي أضرار ناتجة عن استخدام المشاريع</li>
                    <li>لا نضمن توفر الخدمة بشكل متواصل دون انقطاع</li>
                    <li>المشاريع المعروضة هي مسؤولية مطوريها الأصليين</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 6 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">6. تحديد المسؤولية</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    في أي حال من الأحوال، لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة، 
                    عرضية أو تبعية ناتجة عن:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>استخدام أو عدم القدرة على استخدام الخدمة</li>
                    <li>الوصول غير المصرح به إلى بياناتك</li>
                    <li>أخطاء أو حذف في المحتوى</li>
                    <li>أي محتوى أو سلوك من طرف ثالث</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 7 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">7. التعديلات على الشروط</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>إشعار على المنصة</li>
                    <li>بريد إلكتروني إلى عنوانك المسجل</li>
                    <li>تحديث تاريخ "آخر تحديث" أعلى هذه الصفحة</li>
                  </ul>
                  <p className="mt-3">
                    استمرارك في استخدام الخدمة بعد التعديلات يعني موافقتك على الشروط الجديدة.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 8 */}
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">8. إنهاء الخدمة</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>يمكنك إنهاء حسابك في أي وقت من خلال:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>إعدادات الحساب</li>
                    <li>التواصل مع الدعم الفني</li>
                  </ul>
                  <p className="mt-3">
                    نحتفظ بالحق في تعليق أو إنهاء حسابك إذا انتهكت هذه الشروط أو لأي سبب آخر 
                    نراه مناسباً، مع أو بدون إشعار مسبق.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact */}
        <Card className="p-8 mt-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <h2 className="text-2xl font-bold mb-4 text-center">الاتصال بنا</h2>
          <p className="text-center text-muted-foreground mb-4">
            إذا كان لديك أي أسئلة حول الشروط والأحكام، يرجى التواصل معنا:
          </p>
          <div className="text-center">
            <p className="text-primary font-semibold">legal@tolzyprojects.com</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
