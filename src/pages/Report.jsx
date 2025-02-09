import  { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; // Updated import path
import { Toaster } from "@/components/ui/toaster";

const Report = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    console.log('Report submitted:', formData);
    
    toast({
      title: "Success",
      description: "Report submitted successfully!",
    });

    setFormData({
      title: '',
      category: '',
      description: ''
    });
  };

  return (
    <>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Report an Issue</h2>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="content">Content Issue</SelectItem>
                  <SelectItem value="security">Security Concern</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please provide detailed information about the issue"
                className="min-h-[150px]"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Submit Report
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </>
  );
};

export default Report;