
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface AlertSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockTicker?: string;
  currentPrice?: number;
}

interface AlertFormValues {
  priceThreshold: number;
  confidenceThreshold: number;
  deviationPercentage: number;
  emailNotifications: boolean;
  appNotifications: boolean;
  smsNotifications: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
}

const AlertSettings: React.FC<AlertSettingsProps> = ({ 
  open, 
  onOpenChange,
  stockTicker = '',
  currentPrice = 0
}) => {
  const { toast } = useToast();
  const [selectedFrequency, setSelectedFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  
  const form = useForm<AlertFormValues>({
    defaultValues: {
      priceThreshold: currentPrice,
      confidenceThreshold: 85,
      deviationPercentage: 5,
      emailNotifications: true,
      appNotifications: true,
      smsNotifications: false,
      frequency: 'instant'
    }
  });

  const handleSubmit = (data: AlertFormValues) => {
    // In a real application, this would save to a backend
    console.log('Alert settings saved:', data);
    
    toast({
      title: "Alert created",
      description: `You'll be notified when ${stockTicker || 'the stock'} crosses $${data.priceThreshold}`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Custom Alerts</DialogTitle>
          <DialogDescription>
            {stockTicker 
              ? `Configure alert preferences for ${stockTicker}` 
              : 'Configure your general alert preferences'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="priceThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Threshold</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Alert me if the stock crosses this price
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviationPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Deviation (%)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Slider
                        min={1}
                        max={20}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">1%</span>
                        <span className="text-xs text-gray-500 font-semibold">{field.value}%</span>
                        <span className="text-xs text-gray-500">20%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Notify me if price deviates by this percentage
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confidenceThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confidence Threshold (%)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Slider
                        min={50}
                        max={99}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">50%</span>
                        <span className="text-xs text-gray-500 font-semibold">{field.value}%</span>
                        <span className="text-xs text-gray-500">99%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Only notify me if prediction confidence exceeds this threshold
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-medium">Notification Channels</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={form.watch('emailNotifications')}
                  onCheckedChange={(checked) => form.setValue('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="app-notifications">In-App Notifications</Label>
                </div>
                <Switch 
                  id="app-notifications" 
                  checked={form.watch('appNotifications')}
                  onCheckedChange={(checked) => form.setValue('appNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
                <Switch 
                  id="sms-notifications" 
                  checked={form.watch('smsNotifications')}
                  onCheckedChange={(checked) => form.setValue('smsNotifications', checked)}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium">Notification Frequency</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  type="button" 
                  variant={selectedFrequency === 'instant' ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedFrequency('instant');
                    form.setValue('frequency', 'instant');
                  }}
                  className="w-full"
                >
                  Instant
                </Button>
                <Button 
                  type="button" 
                  variant={selectedFrequency === 'daily' ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedFrequency('daily');
                    form.setValue('frequency', 'daily');
                  }}
                  className="w-full"
                >
                  Daily
                </Button>
                <Button 
                  type="button" 
                  variant={selectedFrequency === 'weekly' ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedFrequency('weekly');
                    form.setValue('frequency', 'weekly');
                  }}
                  className="w-full"
                >
                  Weekly
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" className="w-full mt-4">Save Alert Settings</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertSettings;
