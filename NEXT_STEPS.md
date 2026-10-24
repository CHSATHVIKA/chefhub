# Next steps (manual)

Everything in the code is done and tested locally. These steps need your own accounts or logins.

## 1. Push to GitHub

```powershell
winget install GitHub.cli
# restart the terminal, then:
gh auth login
cd D:\ChefHub
gh repo create chefhub --public --source . --remote origin --push
```

## 2. Database and backend

Follow DEPLOY.md sections 1 and 2:
- Create MySQL on Railway and enable its public networking.
- Create a Docker web service on Render (root dir `backend`) and set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` and `ALLOWED_ORIGIN`.

## 3. Frontend on Vercel

```powershell
npm i -g vercel
vercel login
cd D:\ChefHub\frontend
vercel link
vercel env add VITE_API_URL production   # paste your Render URL
vercel --prod
```

## 4. Connect them

- Set `ALLOWED_ORIGIN` on Render to your Vercel URL.
- Run the smoke-test checklist in DEPLOY.md.

## 5. Optional cleanup

- Delete `D:\ChefHub-backend.log`, a leftover log from local testing.
- Add the live URLs and a couple of screenshots to README.md.
