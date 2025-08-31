const config = {
	plugins: {
		"@tailwindcss/postcss": {
			optimize: false, // Turbopack에서는 최적화를 비활성화
		},
	},
};

export default config;
