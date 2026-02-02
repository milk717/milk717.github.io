'use client';

import type { Callout } from '@r4ai/remark-callout';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BugIcon,
  CheckCircleIcon,
  FlameIcon,
  HelpCircleIcon,
  InfoIcon,
  LightbulbIcon,
  ListIcon,
  PencilIcon,
  QuoteIcon,
  XCircleIcon,
} from 'lucide-react';
import * as React from 'react';
import { match, P } from 'ts-pattern';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/** 콜아웃 5색: global.css 토큰(callout-{color}, callout-{color}-foreground)과 1:1 */
type CalloutColor = 'gray' | 'blue' | 'green' | 'orange' | 'red';

const calloutColorClasses: Record<CalloutColor, { base: string; trigger: string; body: string }> = {
  gray: {
    base: 'bg-callout-gray',
    trigger: 'decoration-callout-gray-foreground [&>svg]:stroke-callout-gray-foreground text-callout-gray-foreground',
    body: 'bg-[color-mix(in_srgb,var(--background)_70%,var(--callout-gray)_30%)]',
  },
  blue: {
    base: 'bg-callout-blue',
    trigger: 'decoration-callout-blue-foreground [&>svg]:stroke-callout-blue-foreground text-callout-blue-foreground',
    body: 'bg-[color-mix(in_srgb,var(--background)_65%,var(--callout-blue)_35%)]',
  },
  green: {
    base: 'bg-callout-green',
    trigger:
      'decoration-callout-green-foreground [&>svg]:stroke-callout-green-foreground text-callout-green-foreground',
    body: 'bg-[color-mix(in_srgb,var(--background)_65%,var(--callout-green)_35%)]',
  },
  orange: {
    base: 'bg-callout-orange',
    trigger:
      'decoration-callout-orange-foreground [&>svg]:stroke-callout-orange-foreground text-callout-orange-foreground',
    body: 'bg-[color-mix(in_srgb,var(--background)_50%,var(--callout-orange)_50%)]',
  },
  red: {
    base: 'bg-callout-red',
    trigger: 'decoration-callout-red-foreground [&>svg]:stroke-callout-red-foreground text-callout-red-foreground',
    body: 'bg-[color-mix(in_srgb,var(--background)_70%,var(--callout-red)_30%)]',
  },
};

/** 타입별 색상 + 아이콘 + 기본 제목만 지정 (debug.md 예시 순서) */
const calloutVariants = {
  note: { color: 'gray', icon: PencilIcon, defaultTitle: 'Note' },
  abstract: { color: 'blue', icon: ListIcon, defaultTitle: 'Abstract' },
  summary: { color: 'blue', icon: ListIcon, defaultTitle: 'Summary' },
  tldr: { color: 'blue', icon: ListIcon, defaultTitle: 'TL;DR' },
  info: { color: 'blue', icon: InfoIcon, defaultTitle: 'Info' },
  tip: { color: 'green', icon: LightbulbIcon, defaultTitle: 'Tip' },
  hint: { color: 'green', icon: LightbulbIcon, defaultTitle: 'Hint' },
  important: { color: 'red', icon: FlameIcon, defaultTitle: 'Important' },
  success: { color: 'green', icon: CheckCircleIcon, defaultTitle: 'Success' },
  check: { color: 'green', icon: CheckCircleIcon, defaultTitle: 'Check' },
  done: { color: 'green', icon: CheckCircleIcon, defaultTitle: 'Done' },
  question: { color: 'orange', icon: HelpCircleIcon, defaultTitle: 'Question' },
  help: { color: 'orange', icon: HelpCircleIcon, defaultTitle: 'Help' },
  faq: { color: 'orange', icon: HelpCircleIcon, defaultTitle: 'FAQ' },
  warning: { color: 'orange', icon: AlertTriangleIcon, defaultTitle: 'Warning' },
  caution: { color: 'orange', icon: AlertTriangleIcon, defaultTitle: 'Caution' },
  attention: { color: 'orange', icon: AlertTriangleIcon, defaultTitle: 'Attention' },
  failure: { color: 'red', icon: XCircleIcon, defaultTitle: 'Failure' },
  fail: { color: 'red', icon: XCircleIcon, defaultTitle: 'Fail' },
  missing: { color: 'red', icon: XCircleIcon, defaultTitle: 'Missing' },
  danger: { color: 'red', icon: AlertCircleIcon, defaultTitle: 'Danger' },
  error: { color: 'red', icon: XCircleIcon, defaultTitle: 'Error' },
  bug: { color: 'red', icon: BugIcon, defaultTitle: 'Bug' },
  example: { color: 'gray', icon: ListIcon, defaultTitle: 'Example' },
  quote: { color: 'gray', icon: QuoteIcon, defaultTitle: 'Quote' },
  cite: { color: 'gray', icon: QuoteIcon, defaultTitle: 'Cite' },
} as const;

type CalloutType = keyof typeof calloutVariants;

const isCalloutType = (type: string): type is CalloutType => type in calloutVariants;

function coerceBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return Boolean(value);
}

/** MDX/HTML에서 소문자 속성으로 올 수 있으므로 정규화 */
function pickCalloutProps(props: Record<string, unknown>) {
  return {
    type: (props.type ?? props.callouttype ?? 'note') as string,
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
      .with([false, P._], () => 'item-1' as const)
      .with([true, false], () => 'item-1' as const)
      .with([true, true], () => undefined)
      .otherwise(() => 'item-1' as const);

  const [value, setValue] = React.useState<string | undefined>(getInitialValue);

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={setValue}
      className={cn(
        'callout w-full rounded-lg my-4 leading-loose',
        isCalloutType(type)
          ? calloutColorClasses[calloutVariants[type].color].base
          : 'callout-default-bar bg-muted/50 rounded-lg',
      )}
      {...rest}
    >
      <AccordionItem value="item-1" className="border-none" disabled={!foldable}>
        {children}
      </AccordionItem>
    </Accordion>
  );
}

/** 사용자가 작성한 제목 텍스트가 있는지 확인 (문자열 또는 React 노드) */
function hasTitleContent(children: React.ReactNode): boolean {
  if (children == null) return false;
  if (typeof children === 'string') return children.trim() !== '';
  return React.Children.count(children) > 0;
}

export function CalloutTitle({
  type: typeProp = 'note',
  isFoldable: isFoldableProp,
  children,
  ...rest
}: Pick<Callout, 'type' | 'isFoldable'> & React.PropsWithChildren & Record<string, unknown>) {
  const type = typeProp;
  const foldable = isFoldableProp !== undefined ? coerceBoolean(isFoldableProp) : false;

  const Icon = isCalloutType(type) ? calloutVariants[type].icon : null;

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
        'flex items-center justify-start gap-2 font-semibold px-4 py-3 data-[state=open]:py-2 [&[data-state=open]>svg]:rotate-180',
        isCalloutType(type) ? calloutColorClasses[calloutVariants[type].color].trigger : '',
        !foldable && '[&>svg]:hidden hover:no-underline disabled:opacity-100',
      )}
      {...rest}
    >
      <p className={cn('flex items-center gap-1.5 text-sm font-semibold')}>
        {Icon && <Icon className="size-3 shrink-0" />}
        {displayTitle}
      </p>
    </AccordionTrigger>
  );
}

export function CalloutBody({
  type: typeProp = 'note',
  children,
  ...rest
}: React.PropsWithChildren<{ type?: string }> & Record<string, unknown>) {
  const type = typeProp;
  const bodyClassName = isCalloutType(type) ? calloutColorClasses[calloutVariants[type].color].body : undefined;

  return (
    <AccordionContent className="callout-body text-base text-foreground px-2 pb-2 pt-0 rounded-b-lg" {...rest}>
      <div className={cn('rounded px-2', '[&>p]:first:mt-0 [&>p]:last:mb-0', bodyClassName)}>{children}</div>
    </AccordionContent>
  );
}
