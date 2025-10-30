import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Target, Users, Lightbulb, Heart, Code2, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 animate-fadeIn">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-float">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            عن Tolzy Stack
          </h1>
          <p className="text-muted-foreground text-lg">
            منصة تعليمية ذكية للمطورين والطلاب
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">قصتنا</h2>
          <p className="text-lg leading-relaxed text-muted-foreground mb-4">
            <span className="font-bold text-primary">Tolzy Stack</span> هي منصة تعليمية مبتكرة 
            تابعة لشركة <span className="font-bold text-primary">Tolzy</span>، الشركة الرائدة في مجال 
            تطوير الحلول التقنية والتعليمية المبتكرة.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground mb-4">
            بدأت فكرة المنصة من رؤية بسيطة: جعل تعلم البرمجة أسهل وأكثر متعة من خلال توفير 
            مكتبة ذكية للمشاريع مفتوحة المصدر مدعومة بالذكاء الاصطناعي.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            نؤمن في <span className="font-bold text-primary">Tolzy</span> بأن أفضل طريقة للتعلم هي 
            من خلال الأمثلة العملية والمشاريع الحقيقية. لذلك، قمنا بإنشاء منصة تجمع أفضل 
            المشاريع من GitHub وتقدمها بطريقة تفاعلية مع شروحات ذكية بواسطة <span className="font-bold text-primary">TolzyAI</span>.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">رؤيتنا</h3>
                <p className="text-muted-foreground">
                  أن نكون المنصة الأولى عربياً لتعلم البرمجة من خلال المشاريع مفتوحة المصدر
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">مهمتنا</h3>
                <p className="text-muted-foreground">
                  تسهيل الوصول إلى المعرفة البرمجية وتمكين المطورين من التعلم والنمو
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">قيمنا الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">الجودة</h3>
              <p className="text-sm text-muted-foreground">
                نختار فقط أفضل المشاريع ذات الجودة العالية
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">الابتكار</h3>
              <p className="text-sm text-muted-foreground">
                نستخدم أحدث التقنيات لتحسين تجربة التعلم
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold mb-2">المجتمع</h3>
              <p className="text-sm text-muted-foreground">
                نبني مجتمعاً داعماً من المطورين والمتعلمين
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <h2 className="text-2xl font-bold mb-4 text-center">ماذا نقدم؟</h2>
          <div className="space-y-3 text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p>مكتبة ضخمة من المشاريع مفتوحة المصدر منظمة ومصنفة</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p><span className="font-semibold text-primary">TolzyAI</span> - نظام ذكاء اصطناعي متقدم لتحليل وتفسير المشاريع والأكواد</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p>واجهة عرض احترافية تشبه VS Code مع تكبير/تصغير الخط ووضع ملء الشاشة</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p>شجرة ملفات تفاعلية مع بحث متقدم وأيقونات ملونة</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p>إمكانية حفظ المشاريع المفضلة والوصول إليها بسهولة</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p>تحديثات مستمرة بأحدث المشاريع والتقنيات من GitHub</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-8 mt-8 bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">مدعوم بـ TolzyAI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نظام الذكاء الاصطناعي الخاص بنا يحلل المشاريع ويقدم رؤى عميقة حول البنية المعمارية، 
              جودة الكود، التقنيات المستخدمة، وحالات الاستخدام المثالية. كل ذلك لمساعدتك على 
              فهم المشاريع بشكل أفضل وأسرع.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
