import BlogInfo from '@/BlogInfo.json';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pt-8 border-t border-border">
      <div className="flex flex-col gap-4">
        <p className="text-center text-xs text-muted-foreground">
          © {currentYear} {BlogInfo.profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
