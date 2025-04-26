
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VendorDashboardLayout from '@/components/layout/VendorDashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
}

const Products = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      image: ''
    }
  });

  const onSubmit = (data: ProductFormData) => {
    console.log('Product data:', data);
    setOpen(false);
    form.reset();
  };

  return (
    <VendorDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cameroon-blue">My Products</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cameroon-blue hover:bg-cameroon-blue/90">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter product name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter product description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (XAF)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="Enter price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" placeholder="Enter image URL" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-cameroon-blue hover:bg-cameroon-blue/90">
                    Add Product
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>No Products Yet</CardTitle>
              <CardDescription>
                Start adding your products to showcase them in the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-cameroon-blue/10 p-6">
                  <Plus className="h-12 w-12 text-cameroon-blue" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Add Your First Product</h3>
                <p className="mb-4 max-w-sm text-sm text-gray-600">
                  List your products with detailed descriptions, images, and pricing to start selling on the marketplace.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorDashboardLayout>
  );
};

export default Products;
