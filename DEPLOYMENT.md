# Vercel Deployment Instructions

## Steps to Deploy on Vercel

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository: `Mahmoud95965/CodeTolzy`

2. **Configure Environment Variables**
   In the Vercel dashboard, add these environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   ```

3. **Build Settings**
   Vercel will automatically detect the settings from `vercel.json`, but you can verify:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`
   - Root Directory: `.` (leave empty)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

## Important Notes

- The project is configured with `vercel.json` for proper routing
- API routes are handled by the Express server
- Static files are served from the `dist/public` directory
- Make sure to add your OpenAI API key in the environment variables

## SEO Optimization

The project includes comprehensive SEO optimization:

- **Meta Tags**: Complete meta tags for search engines
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: XML sitemap at `/sitemap.xml`
- **Robots.txt**: Search engine crawling instructions at `/robots.txt`
- **Performance**: Optimized for Core Web Vitals

## Local Development

To run locally:
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5000`

## SEO Checklist

After deployment, verify these SEO elements:

- [ ] Meta title and description are properly set
- [ ] Open Graph tags work for social sharing
- [ ] Structured data is valid (test with Google's Rich Results Test)
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`
- [ ] All pages have proper heading structure (H1, H2, H3)
- [ ] Images have alt attributes
- [ ] Site loads quickly (check with PageSpeed Insights)
