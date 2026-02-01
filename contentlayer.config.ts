// contentlayer.config.ts
import type { Callout } from "@r4ai/remark-callout";
import remarkCallout from "@r4ai/remark-callout";
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const Book = defineDocumentType(() => ({
	name: "Book",
	filePathPattern: "book/*.md",
	contentType: "mdx",
	fields: {
		created: {
			type: "date",
			required: true,
		},
		tags: {
			type: "list",
			required: true,
			of: { type: "string" },
		},
		title: {
			type: "string",
			required: true,
		},
		author: {
			type: "string",
			required: true,
		},
		category: {
			type: "string",
			required: true,
		},
		total_page: {
			type: "number",
			required: true,
		},
		publish_date: {
			type: "date",
			required: true,
		},
		cover_url: {
			type: "string",
			required: true,
		},
		status: {
			type: "string",
			required: true,
		},
		start_read_date: {
			type: "date",
			required: true,
		},
		finish_read_date: {
			type: "date",
			required: true,
		},
		my_rate: {
			type: "number",
			required: true,
		},
		slug: {
			type: "string",
			required: true,
		},
		updated: {
			type: "date",
			required: true,
		},
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (doc) => `${doc.slug}/`,
		},
	},
}));

export const Post = defineDocumentType(() => ({
	name: "Post",
	filePathPattern: "**/*.md",
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			required: true,
		},
		date: {
			type: "date",
			required: true,
		},
		thumbnail: {
			type: "string",
			required: true,
		},
		category: {
			type: "string",
			required: true,
		},
		tags: {
			type: "list",
			required: true,
			of: { type: "string" },
		},
		excerpt: {
			type: "string",
			required: false,
		},
		slug: {
			type: "string",
			required: true,
		},
		updated: {
			type: "date",
			required: true,
		},
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (doc) => `${doc.slug}/`,
		},
	},
}));

const contentSource = makeSource({
	contentDirPath: "_posts",
	documentTypes: [Book, Post],
	contentDirExclude: ["**/.obsidian/**", "**/_template/**"],
	mdx: {
		remarkPlugins: [
			remarkGfm,
			[
				// @ts-ignore - remarkCallout 타입 호환성 문제
				remarkCallout,
				{
					root: (callout: Callout) => ({
						tagName: "callout",
						properties: {
							type: callout.type,
							isFoldable: callout.isFoldable,
							defaultFolded: callout.defaultFolded,
						},
					}),
					title: (callout: Callout) => ({
						tagName: "callout-title",
						properties: {
							type: callout.type,
							isFoldable: callout.isFoldable,
						},
					}),
					body: () => ({
						tagName: "callout-body",
					}),
				},
			],
		],
		rehypePlugins: [
			rehypeSlug,
			[
				// @ts-ignore
				rehypePrettyCode,
				{
					theme: "one-dark-pro",
					defaultLang: {
						block: "tsx",
						inline: "plaintext",
					},
					keepBackground: false,
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ["anchor"],
					},
					behavior: "wrap",
				},
			],
		],
	},
});

export default contentSource;
