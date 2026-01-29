"use client";

import type { Callout } from "@r4ai/remark-callout";
import * as React from "react";
import {
	BookmarkMinusIcon,
	BookOpenIcon,
	ClipboardPenLineIcon,
	QuoteIcon,
} from "lucide-react";
import { match, P } from "ts-pattern";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type CalloutContextType = {
	type: string;
	foldable: boolean;
	folded: boolean;
};

const CalloutContext = React.createContext<CalloutContextType | null>(null);

const useCallout = () => {
	const context = React.useContext(CalloutContext);
	if (!context) {
		throw new Error("Callout components must be used within CalloutComponent");
	}
	return context;
};

const calloutVariants = {
	quote: {
		classNames: {
			base: "bg-muted",
			trigger: "decoration-muted-foreground",
			title: "text-muted-foreground",
		},
		icon: QuoteIcon,
		defaultTitle: "quote",
	},
	note: {
		classNames: {
			base: "bg-indigo-50 dark:bg-indigo-950/30",
			trigger: "decoration-indigo-700",
			title: "text-indigo-700 dark:text-indigo-400",
		},
		icon: BookOpenIcon,
		defaultTitle: "note",
	},
	passage: {
		classNames: {
			base: "border border-border",
			trigger: "decoration-primary",
			title: "text-muted-foreground",
		},
		icon: null,
		defaultTitle: "",
	},
	example: {
		classNames: {
			base: "border border-border",
			trigger: "decoration-primary",
			title: "text-muted-foreground",
		},
		icon: null,
		defaultTitle: "보기",
	},
	TABLE_FETCH: {
		classNames: {
			base: "bg-muted",
			trigger: "decoration-primary",
			title: "text-primary",
		},
		icon: BookmarkMinusIcon,
		defaultTitle: "관련 학습자료 보기",
	},
	TRANSLATION: {
		classNames: {
			base: "bg-muted",
			trigger: "decoration-primary",
			title: "text-primary",
		},
		icon: ClipboardPenLineIcon,
		defaultTitle: "직독직해 보기",
	},
	// Obsidian-style types
	info: {
		classNames: {
			base: "bg-indigo-50 dark:bg-indigo-950/30",
			trigger: "decoration-indigo-700",
			title: "text-indigo-700 dark:text-indigo-400",
		},
		icon: BookOpenIcon,
		defaultTitle: "info",
	},
	warning: {
		classNames: {
			base: "bg-amber-50 dark:bg-amber-950/30",
			trigger: "decoration-amber-700",
			title: "text-amber-700 dark:text-amber-400",
		},
		icon: QuoteIcon,
		defaultTitle: "warning",
	},
	important: {
		classNames: {
			base: "bg-rose-50 dark:bg-rose-950/30",
			trigger: "decoration-rose-700",
			title: "text-rose-700 dark:text-rose-400",
		},
		icon: QuoteIcon,
		defaultTitle: "important",
	},
	tip: {
		classNames: {
			base: "bg-emerald-50 dark:bg-emerald-950/30",
			trigger: "decoration-emerald-700",
			title: "text-emerald-700 dark:text-emerald-400",
		},
		icon: QuoteIcon,
		defaultTitle: "tip",
	},
} as const;

type CalloutType = keyof typeof calloutVariants;

const isCalloutType = (type: string): type is CalloutType => type in calloutVariants;

function coerceBoolean(value: unknown): boolean {
	if (typeof value === "boolean") return value;
	if (value === "true" || value === true) return true;
	if (value === "false" || value === false) return false;
	return Boolean(value);
}

/** MDX/HTML에서 소문자 속성으로 올 수 있으므로 정규화 */
function pickCalloutProps(props: Record<string, unknown>) {
	return {
		type: (props.type ?? props.callouttype ?? "note") as string,
		isFoldable: props.isFoldable ?? props.isfoldable ?? props.foldable,
		defaultFolded: props.defaultFolded ?? props.defaultfolded ?? props.folded,
	};
}

export function CalloutComponent({
	type: typeProp,
	isFoldable: isFoldableProp,
	defaultFolded: defaultFoldedProp,
	children,
	...rest
}: Callout & React.PropsWithChildren & Record<string, unknown>) {
	const props = pickCalloutProps({
		type: typeProp,
		isFoldable: isFoldableProp,
		defaultFolded: defaultFoldedProp,
		...rest,
	});
	const foldable = coerceBoolean(props.isFoldable);
	const folded = coerceBoolean(props.defaultFolded);
	const type = props.type;

	const getInitialValue = () =>
		match([foldable, folded])
			.with([false, P._], () => "item-1" as const)
			.with([true, false], () => "item-1" as const)
			.with([true, true], () => undefined)
			.otherwise(() => "item-1" as const);

	const [value, setValue] = React.useState<string | undefined>(getInitialValue);

	return (
		<CalloutContext.Provider value={{ type, foldable, folded }}>
			<Accordion
				type="single"
				collapsible
				value={value}
				onValueChange={setValue}
				className={cn(
					"w-full rounded-lg px-4 py-2 my-4 leading-loose",
					isCalloutType(type) ? calloutVariants[type].classNames.base : "border-l-4 border-l-indigo-200 bg-muted/50",
				)}
				{...rest}
			>
				<AccordionItem value="item-1" className="border-none" disabled={!foldable}>
					{children}
				</AccordionItem>
			</Accordion>
		</CalloutContext.Provider>
	);
}

/** 사용자가 작성한 제목 텍스트가 있는지 확인 (문자열 또는 React 노드) */
function hasTitleContent(children: React.ReactNode): boolean {
	if (children == null) return false;
	if (typeof children === "string") return children.trim() !== "";
	return React.Children.count(children) > 0;
}

export function CalloutTitle({
	type: typeProp,
	isFoldable: isFoldableProp,
	children,
	...rest
}: Pick<Callout, "type" | "isFoldable"> & React.PropsWithChildren & Record<string, unknown>) {
	const context = useCallout();
	const type = typeProp ?? context.type;
	const foldable = isFoldableProp !== undefined ? coerceBoolean(isFoldableProp) : context.foldable;

	const Icon = isCalloutType(type) ? calloutVariants[type].icon : null;
	// 사용자가 작성한 제목이 있으면 그대로 표시, 없을 때만 defaultTitle 사용 (타입명 노출 X)
	const displayTitle = hasTitleContent(children)
		? children
		: isCalloutType(type)
			? calloutVariants[type].defaultTitle
			: null;

	if (isCalloutType(type) && !calloutVariants[type].defaultTitle && !hasTitleContent(children)) {
		return <div className="h-4" {...rest} />;
	}

	return (
		<AccordionTrigger
			className={cn(
				"flex items-center gap-2 font-semibold underline-offset-2 py-2 hover:no-underline [&[data-state=open]>svg]:rotate-180",
				isCalloutType(type) ? calloutVariants[type].classNames.trigger : "",
				!foldable && "[&>svg]:hidden hover:no-underline disabled:opacity-100",
			)}
			{...rest}
		>
			<div
				className={cn(
					"flex items-center gap-2",
					isCalloutType(type) ? calloutVariants[type].classNames.title : "",
				)}
			>
				{Icon && <Icon className="size-4 shrink-0" />}
				{displayTitle}
			</div>
		</AccordionTrigger>
	);
}

export function CalloutBody({ children, ...rest }: React.PropsWithChildren & Record<string, unknown>) {
	return (
		<AccordionContent className="text-base text-foreground" {...rest}>
			{children}
		</AccordionContent>
	);
}
