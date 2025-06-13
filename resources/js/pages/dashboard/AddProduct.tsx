import { useForm, Head } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';

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
            <form onSubmit={submit} className="flex flex-col md:flex-row gap-8 p-8">
                {/* Image upload */}
                <div className="flex flex-col items-center w-full md:w-1/3">
                    <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                        {data.image ? (
                            <img src={URL.createObjectURL(data.image)} alt="Preview" className="object-contain w-full h-full rounded-lg" />
                        ) : (
                            <span className="text-muted-foreground">Product Image Preview</span>
                        )}
                    </div>
                    <label className="w-full">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                        />
                        <Button type="button" className="w-full" variant="secondary" onClick={() => document.querySelector<HTMLInputElement>('#product-image')?.click()}>
                            Add Product Image
                        </Button>
                    </label>
                </div>
                {/* Product fields */}
                <div className="flex-1 flex flex-col gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Product Name</label>
                        <Input
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            disabled={processing}
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Stock</label>
                        <Input
                            type="number"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            required
                            disabled={processing}
                        />
                        <InputError message={errors.stock} className="mt-1" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Rent Price (1 day)</label>
                        <Input
                            type="number"
                            value={data.rent_price}
                            onChange={e => setData('rent_price', e.target.value)}
                            required
                            disabled={processing}
                        />
                        <InputError message={errors.rent_price} className="mt-1" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Max Rent Duration (max 30 days)</label>
                        <Input
                            type="number"
                            value={data.max_rent_day}
                            onChange={e => setData('max_rent_day', e.target.value)}
                            required
                            disabled={processing}
                        />
                        <InputError message={errors.max_rent_day} className="mt-1" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Storage</label>
                        <Input
                            value={data.storage}
                            onChange={e => setData('storage', e.target.value)}
                            required
                            disabled={processing}
                        />
                        <InputError message={errors.storage} className="mt-1" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Color</label>
                        <Input
                            value={data.color}
                            onChange={e => setData('color', e.target.value)}
                            required
                            disabled={processing}
                        />
                        <InputError message={errors.color} className="mt-1" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Product Description</label>
                        <textarea
                            className="w-full rounded border bg-background text-foreground p-2 min-h-[80px] max-h-40 resize-y"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            required
                            disabled={processing}
                        />
                        <InputError message={errors.description} className="mt-1" />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={processing} className="w-full md:w-auto">Add Product</Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
