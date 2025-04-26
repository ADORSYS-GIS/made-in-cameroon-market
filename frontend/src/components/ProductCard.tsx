export interface ProductCardProps {
  name: string;
  price: number;
}

export function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="font-bold text-lg">{name}</h2>
      <p className="text-gray-700">$ {price.toFixed(2)}</p>
    </div>
  );
}
