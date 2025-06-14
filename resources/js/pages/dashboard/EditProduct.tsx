import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Product {
    id: number;
    name: string;
    stock: number;
    rent_price: number;
    max_rent_day: number;
    storage: string;
    color: string;
    description: string;
    image: string;
}

interface EditProductProps {
    product: Product;
}

export default function EditProduct({ product }: EditProductProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: product.name || '',
        stock: product.stock || '',
        rent_price: product.rent_price || '',
        max_rent_day: product.max_rent_day || '',
        storage: product.storage || '',
        color: product.color || '',
        description: product.description || '',
        image: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('products.update', product.id), {
            forceFormData: true,
            onSuccess: () => reset('image'),
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('products.delete', product.id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Edit Product', href: `/dashboard/edit-product/${product.id}` }]}>
            <Head title="Edit Product" />
            <form onSubmit={submit} className="flex flex-col gap-8 p-8 md:flex-row">
                {/* Image upload */}
                <div className="flex w-full flex-col items-center md:w-1/3">
                    <div className="bg-muted mb-4 flex aspect-square w-full items-center justify-center rounded-lg">
                        {data.image ? (
                            <img src={URL.createObjectURL(data.image)} alt="Preview" className="h-full w-full rounded-lg object-contain" />
                        ) : product.image ? (
                            <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full rounded-lg object-contain" />
                        ) : (
                            <span className="text-muted-foreground">Product Image Preview</span>
                        )}
                    </div>
                    <label className="w-full">
                        <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                        />
                        <Button
                            type="button"
                            className="w-full"
                            variant="secondary"
                            onClick={() => document.getElementById('product-image')?.click()}
                        >
                            Change Product Image
                        </Button>
                    </label>
                </div>
                {/* Product fields */}
                <div className="flex flex-1 flex-col gap-4">
                    <div>
                        <label className="mb-1 block font-semibold">Product Name</label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} required disabled={processing} />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Stock</label>
                        <Input type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} required disabled={processing} />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Rent Price (1 day)</label>
                        <Input
                            type="number"
                            value={data.rent_price}
                            onChange={(e) => setData('rent_price', e.target.value)}
                            required
                            disabled={processing}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Max Rent Duration (max 30 days)</label>
                        <Input
                            type="number"
                            value={data.max_rent_day}
                            onChange={(e) => setData('max_rent_day', e.target.value)}
                            required
                            disabled={processing}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Storage</label>
                        <Input value={data.storage} onChange={(e) => setData('storage', e.target.value)} required disabled={processing} />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Color</label>
                        <Input value={data.color} onChange={(e) => setData('color', e.target.value)} required disabled={processing} />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Product Description</label>
                        <textarea
                            className="bg-background text-foreground max-h-40 min-h-[80px] w-full resize-y rounded border p-2"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            required
                            disabled={processing}
                        />
                    </div>
                    <div className="mt-4 flex flex-col justify-end gap-2 md:flex-row">
                        <Button type="submit" disabled={processing} className="w-full md:w-auto">
                            Save Changes
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete} className="w-full md:w-auto">
                            Delete Product
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
