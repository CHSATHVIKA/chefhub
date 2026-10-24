# Deploying ChefHub

The setup is MySQL on Railway, the backend on Render as a Docker service, and the frontend on Vercel.

## 1. MySQL on Railway

1. Sign in at https://railway.app, then go to **New Project -> Deploy MySQL**.
2. Open the MySQL service and go to the **Variables** tab. Note down:
   - `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`
3. Go to **Settings -> Networking** and make sure a **public TCP proxy** is enabled. Render is outside Railway's private network, so it needs the public host and port. They look like `xxx.proxy.rlwy.net:12345`.
4. Your JDBC URL is:
   ```
   jdbc:mysql://<PUBLIC_HOST>:<PUBLIC_PORT>/<MYSQLDATABASE>?useSSL=true&requireSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata
   ```

## 2. Backend on Render (Docker)

1. Push the repo to GitHub (see NEXT_STEPS.md).
2. In https://render.com, go to **New -> Web Service** and connect the `chefhub` repo.
3. Use these settings:
   - **Language/Runtime:** Docker
   - **Root Directory:** `backend`
   - **Dockerfile Path:** `./Dockerfile`
   - **Instance type:** Free
4. Add these **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DB_URL` | the JDBC URL from step 1.4 |
   | `DB_USERNAME` | `MYSQLUSER` from Railway |
   | `DB_PASSWORD` | `MYSQLPASSWORD` from Railway |
   | `JWT_SECRET` | a new Base64 secret, for example the output of `openssl rand -base64 48` |
   | `ALLOWED_ORIGIN` | your Vercel URL, e.g. `https://chefhub.vercel.app` (no trailing slash; leave a placeholder for now and update it after step 3) |

   Render sets `PORT` itself, and the app already reads it.
5. Deploy. The first build takes about 5 minutes. When it finishes, open `https://<your-service>.onrender.com/api/chefs`. You should see JSON with 6 chefs, because the seeder fills the empty database.

## 3. Frontend on Vercel

From the `frontend` folder:

```bash
npm i -g vercel
vercel login
vercel link                 # create project "chefhub"
vercel env add VITE_API_URL production
# paste: https://<your-service>.onrender.com   (no trailing slash, no /api)
vercel --prod
```

Or use the dashboard instead: **Add New -> Project**, pick the repo, and set **Root Directory** to `frontend` (the Vite preset is detected automatically). Add `VITE_API_URL` under Environment Variables, then deploy.

`vercel.json` already rewrites every route to `index.html`, so page refreshes on `/chefs/1` work.

Note: `VITE_API_URL` is baked in at build time. If you change it, redeploy.

## 4. Connect the two

1. Copy the Vercel production URL.
2. On Render, set `ALLOWED_ORIGIN` to that URL. To allow preview URLs too, separate them with commas.
3. Render redeploys automatically.

## 5. Smoke-test checklist

- [ ] `GET https://<render-url>/api/chefs` returns 6 chefs
- [ ] `https://<render-url>/swagger-ui.html` loads
- [ ] The Vercel home page loads with images and the "Chefs cooking this week" cards
- [ ] Refreshing `/chefs` directly works (no Vercel 404)
- [ ] The city filter (Hyderabad) shows Ananya Rao
- [ ] Log in as `priya@example.com` / `password123` and book a slot, and it shows as **Pending** in My bookings
- [ ] Log in as the chef you booked (e.g. `meera@chefhub.in`), click **Accept**, and the status becomes **Confirmed**
- [ ] As the customer, try booking the same slot again: it should be gone from the list
- [ ] Log in as `admin@chefhub.in` / `admin123`: bookings are listed, and blocking a chef removes them from search
- [ ] The browser console shows no CORS errors (if it does, check `ALLOWED_ORIGIN` exactly matches the Vercel URL)

## Notes

- Render free instances sleep after inactivity, so the first request can take around 50 seconds.
- Railway's free trial has limited credits, so keep an eye on usage.
