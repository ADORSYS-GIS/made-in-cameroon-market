import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VendorDashboardLayout from "@/components/layout/VendorDashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: FileList;
}

interface Product extends Omit<ProductFormData, "image"> {
  id: string;
  imageUrl: string;
}

const Products = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: undefined,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const file = data.image?.[0];
    if (!file) {
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: URL.createObjectURL(file),
    };

    setProducts([...products, newProduct]);
    setOpen(false);
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Product name is required" }}
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
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter product description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    rules={{ required: "Price is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (XAF)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    rules={{ required: "Image is required" }}
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-cameroon-blue hover:bg-cameroon-blue/90"
                  >
                    Add Product
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {products.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Products Yet</CardTitle>
                <CardDescription>
                  Start adding your products to showcase them in the
                  marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-cameroon-blue/10 p-6">
                    <Plus className="h-12 w-12 text-cameroon-blue" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    Add Your First Product
                  </h3>
                  <p className="mb-4 max-w-sm text-sm text-gray-600">
                    List your products with detailed descriptions, images, and
                    pricing to start selling on the marketplace.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardTitle className="mt-4">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-cameroon-blue">
                      {Number(product.price).toLocaleString()} XAF
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </VendorDashboardLayout>
  );
};

export default Products;
