import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  badge?: string;
  gradient?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  features, 
  badge,
  gradient = "from-blue-500 to-blue-600"
}: FeatureCardProps) {
  const colorMap: Record<string, { bg: string; icon: string; border: string; hover: string; btnBg: string }> = {
    'from-blue-500 to-blue-600': { 
      bg: 'bg-blue-50', 
      icon: 'text-blue-600', 
      border: 'border-blue-100', 
      hover: 'hover:border-blue-200',
      btnBg: 'bg-blue-600'
    },
    'from-purple-500 to-purple-600': { 
      bg: 'bg-purple-50', 
      icon: 'text-purple-600', 
      border: 'border-purple-100', 
      hover: 'hover:border-purple-200',
      btnBg: 'bg-purple-600'
    },
    'from-green-500 to-green-600': { 
      bg: 'bg-emerald-50', 
      icon: 'text-emerald-600', 
      border: 'border-emerald-100', 
      hover: 'hover:border-emerald-200',
      btnBg: 'bg-emerald-600'
    },
    'from-orange-500 to-orange-600': { 
      bg: 'bg-amber-50', 
      icon: 'text-amber-600', 
      border: 'border-amber-100', 
      hover: 'hover:border-amber-200',
      btnBg: 'bg-amber-600'
    },
  };
  
  const colors = colorMap[gradient] || colorMap['from-blue-500 to-blue-600'];
  
  const isPrimaryChatFeature = title === 'Chat và tư vấn bán hàng';
  
  return (
    <Card className={`border ${colors.border} ${colors.hover} hover:shadow-md transition-all duration-200 group bg-white dark:bg-slate-800 dark:border-slate-700`}>
      <CardHeader className="pb-5">
        <div className="flex items-start justify-between mb-4">
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 ${!isPrimaryChatFeature ? colors.bg : ''}`}
            style={isPrimaryChatFeature ? {
              background: `rgba(var(--primary-color-rgb), 0.15)`
            } : {}}
          >
            <Icon 
              className={`w-6 h-6 ${!isPrimaryChatFeature ? colors.icon : ''}`}
              style={isPrimaryChatFeature ? { color: 'var(--primary-color)' } : {}}
            />
          </div>
          {badge && (
            <Badge 
              className="text-white border-0 text-xs px-2.5 py-0.5"
              style={{
                background: `linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)`
              }}
            >
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-slate-900 dark:text-slate-100 text-lg mb-2">{title}</CardTitle>
        <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2.5 mb-5">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full mt-2 flex-shrink-0`}>
                <div className={`w-1.5 h-1.5 ${colors.icon.replace('text-', 'bg-')} rounded-full`} />
              </div>
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          className={`w-full hover:opacity-90 text-white rounded-lg h-10 text-sm transition-all ${!isPrimaryChatFeature ? colors.btnBg : ''}`}
          style={isPrimaryChatFeature ? {
            background: `linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)`
          } : {}}
        >
          Truy cập
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
