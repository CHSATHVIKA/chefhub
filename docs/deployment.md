# Deploying ChefHub

The setup is MySQL on Aiven (free plan), the backend on Render as a Docker service, and the frontend on Vercel.

Live:
- Frontend: https://chefhub-rose.vercel.app
- Backend: https://chefhub-ozlh.onrender.com

## 1. MySQL on Aiven

1. Sign up at https://aiven.io (no card needed).
2. Go to **Create service -> MySQL**. Under **Customize plan and cloud**, pick the **Free** plan and an Asia Pacific region.
3. Wait until the status shows **Running**.
4. From **Connection information**, copy the Host, Port, User (`avnadmin`), Password and Database (`defaultdb`).
5. Your JDBC URL is:
   ```
   jdbc:mysql://<HOST>:<PORT>/defaultdb?sslMode=REQUIRED&serverTimezone=Asia/Kolkata
   ```

Free Aiven services power off after long inactivity. If that happens, power yours back on from the Aiven console.

## 2. Backend on Render (Docker)

1. In https://render.com, go to **New -> Web Service** and connect the `chefhub` GitHub repo.
2. Use these settings:
   - **Language:** Docker
   - **Root Directory:** `backend`
   - **Region:** Singapore
   - **Instance type:** Free
3. Add these **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DB_URL` | the JDBC URL from step 1.5 |
   | `DB_USERNAME` | `avnadmin` |
   | `DB_PASSWORD` | the Aiven password |
   | `JWT_SECRET` | a random Base64 string of at least 32 bytes, e.g. from `openssl rand -base64 48` |
   | `ALLOWED_ORIGIN` | the Vercel URL, e.g. `https://chefhub-rose.vercel.app` (no trailing slash) |

   Render sets `PORT` itself, and the app reads it.
4. Deploy. The first build takes about 5 to 10 minutes, and the seeder fills the empty database. Then check `https://<render-url>/api/chefs`.

## 3. Frontend on Vercel

1. In https://vercel.com, go to **Add New -> Project** and import the `chefhub` repo.
2. Set **Root Directory** to `frontend`. The framework is detected as Vite.
3. Add the environment variable `VITE_API_URL` = `https://<render-url>` (no trailing slash, no `/api`).
4. Click Deploy.

`vercel.json` rewrites every route to `index.html`, so page refreshes on routes like `/chefs/1` work. `VITE_API_URL` is baked in at build time, so redeploy after you change it.

## 4. Connect the two

Set `ALLOWED_ORIGIN` on Render to the exact Vercel URL and save. Render redeploys automatically.

## 5. Smoke-test checklist

- [ ] `GET https://<render-url>/api/chefs` returns 6 chefs
- [ ] `https://<render-url>/swagger-ui.html` loads
- [ ] The Vercel home page loads with images and the "Chefs cooking this week" cards
- [ ] Refreshing `/chefs` directly works (no 404)
- [ ] The city filter (Hyderabad) shows Ananya Rao
- [ ] Log in as `priya@example.com` / `password123` and book a slot, and it shows as **Pending** in My bookings
- [ ] Log in as that chef (e.g. `meera@chefhub.in`), click **Accept**, and the status becomes **Confirmed**
- [ ] The booked slot no longer appears on the chef page
- [ ] Log in as `admin@chefhub.in` / `admin123`: bookings are listed, and blocking a chef hides them from search
- [ ] The browser console shows no CORS errors

## Notes

- Render free instances sleep after about 15 minutes idle, so the first request takes around 50 seconds.
- Every push to `main` redeploys both Render and Vercel automatically.
