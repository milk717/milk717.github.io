import Link from "next/link";
import Image from "next/image";

import BlogInfo from "@/BlogInfo.json";
import { AtSignIcon, FileUserIcon, GithubIcon, Linkedin } from "lucide-react";

const profileInfo = [
	{
		name: "Email",
		Icon: AtSignIcon,
		link: `mailto:${BlogInfo.profile.link.email}`,
	},
	{ name: "Github", Icon: GithubIcon, link: BlogInfo.profile.link.github },
	{ name: "LinkedIn", Icon: Linkedin, link: BlogInfo.profile.link.linkedIn },
	{ name: "Resume", Icon: FileUserIcon, link: BlogInfo.profile.link.resume },
];

export const Profile = () => {
	return (
		<section className="flex flex-col gap-y-4">
			<div className="flex items-center gap-6">
				<Image
					className="rounded-full"
					src={BlogInfo.profile.profileImage}
					alt={`${BlogInfo.profile.name}의 프로필 이미지`}
					width={100}
					height={100}
				/>
				<div>
					<h1 className="text-xl font-bold text-foreground">{BlogInfo.profile.name}</h1>
					<p className="text-sm text-muted-foreground">{BlogInfo.profile.introduce}</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-x-6 gap-y-1">
				{profileInfo.map(({ name, Icon, link }) => (
					<Link key={link} className="flex items-center gap-1.5 h-fit cursor-pointer hover:underline text-foreground" href={link}>
						<Icon className="w-4 h-4" /> {name}
					</Link>
				))}
			</div>
		</section>
	);
};
