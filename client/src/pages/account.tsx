import { useAuthStore } from '@/store/authStore';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/header';
import { Crown, Mail, Calendar, TrendingUp, LogOut, CreditCard, Code2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, userData } = useAuthStore();
  const { logout } = useAuth();

  if (!user) {
    setLocation('/login');
    return null;
  }

  const usagePercentage = userData ? (userData.usageCount / userData.dailyLimit) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your basic account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback className="text-2xl">
                  {userData?.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {userData?.displayName || 'User'}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant={userData?.plan === 'pro' ? 'default' : 'secondary'}
                    className={
                      userData?.plan === 'pro'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : ''
                    }
                  >
                    {userData?.plan === 'pro' ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        Pro
                      </>
                    ) : (
                      'Free'
                    )}
                  </Badge>
                  
                  {userData?.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Member since {new Date(userData.createdAt).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Usage Statistics
            </CardTitle>
            <CardDescription>Track your daily platform usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Usage</span>
                <span className="text-sm text-muted-foreground">
                  {userData?.usageCount || 0} / {userData?.dailyLimit || 5}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {userData?.plan === 'pro'
                  ? 'You have unlimited operations'
                  : `${(userData?.dailyLimit || 5) - (userData?.usageCount || 0)} operations remaining today`}
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userData?.projects?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">
                  {userData?.usageCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">Operations today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Plan & Subscription
            </CardTitle>
            <CardDescription>Manage your current plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold mb-1">
                  {userData?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {userData?.plan === 'pro'
                    ? 'Unlimited operations and all features'
                    : '5 daily operations and basic features'}
                </p>
              </div>
              {userData?.plan === 'pro' ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Crown className="h-3 w-3 mr-1" />
Active
                </Badge>
              ) : (
                <Button onClick={() => setLocation('/pricing')}>
Upgrade to Pro
                </Button>
              )}
            </div>

            {userData?.plan === 'free' && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
                <h4 className="font-semibold mb-2">Get More with Pro</h4>
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Unlimited daily operations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Access to all advanced scenarios
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Smart project summarizer
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Priority technical support
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
Upgrade Now
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start">
                <Code2 className="h-4 w-4 mr-2" />
Back to Dashboard
              </Button>
            </Link>
            
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
