import NextImage from "next/image";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ComponentProps<typeof NextImage> {
	showSkeleton?: boolean;
}

export function Image({
	className,
	showSkeleton = true,
	placeholder = showSkeleton ? "blur" : "empty",
	blurDataURL = showSkeleton
		? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNGY0ZjQiLz48L3N2Zz4="
		: undefined,
	...props
}: ImageProps) {
	return <NextImage {...props} className={cn(className)} placeholder={placeholder} blurDataURL={blurDataURL} />;
}
