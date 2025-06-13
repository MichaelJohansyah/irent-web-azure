import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function AddProduct() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        stock: '',
        rent_price: '',
        max_rent_day: '',
        storage: '',
        color: '',
        description: '',
        image: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Add Product', href: '/dashboard/add-product' }]}>
            <Head title="Add Product" />
            <form onSubmit={submit} className="flex flex-col gap-8 p-8 md:flex-row">
                {/* Image upload */}
                <div className="flex w-full flex-col items-center md:w-1/3">
                    <div className="bg-muted mb-4 flex aspect-square w-full items-center justify-center rounded-lg">
                        {data.image ? (
                            <img src={URL.createObjectURL(data.image)} alt="Preview" className="h-full w-full rounded-lg object-contain" />
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
                            Add Product Image
                        </Button>
                    </label>
                </div>
                {/* Product fields */}
                <div className="flex flex-1 flex-col gap-4">
                    <div>
                        <label className="mb-1 block font-semibold">Product Name</label>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} required disabled={processing} />
                        <InputError message={errors.name} className="mt-1" />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Stock</label>
                        <Input type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} required disabled={processing} />
                        <InputError message={errors.stock} className="mt-1" />
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
                        <InputError message={errors.rent_price} className="mt-1" />
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
                        <InputError message={errors.max_rent_day} className="mt-1" />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Storage</label>
                        <Input value={data.storage} onChange={(e) => setData('storage', e.target.value)} required disabled={processing} />
                        <InputError message={errors.storage} className="mt-1" />
                    </div>
                    <div>
                        <label className="mb-1 block font-semibold">Color</label>
                        <Input value={data.color} onChange={(e) => setData('color', e.target.value)} required disabled={processing} />
                        <InputError message={errors.color} className="mt-1" />
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
                        <InputError message={errors.description} className="mt-1" />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button type="submit" disabled={processing} className="w-full md:w-auto">
                            Add Product
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
